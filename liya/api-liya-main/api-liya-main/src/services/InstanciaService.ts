import axios from 'axios';
import Instancia, { InstanciaStatus } from '../models/Instancia';
import User from '../models/User';
import logger from '../utils/logger';

export interface InstanciaConnectionResult {
  success: boolean;
  status: InstanciaStatus;
  qrCode?: string;
  message: string;
  instanceName?: string;
}

class InstanciaService {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly integration: string;

  constructor() {
    this.apiKey = process.env.WHATSAPP_API_KEY!;
    this.baseUrl = process.env.WHATSAPP_API_URL!;
    this.integration = process.env.WHATSAPP_INTEGRATION!;
  }

  /**
   * Conecta ou reconecta uma instância do WhatsApp para o usuário
   */
  async conectarInstancia(userId: string): Promise<InstanciaConnectionResult> {
    try {
      // Buscar usuário
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Verificar se já existe uma instância para o usuário
      let instancia = await Instancia.findOne({ where: { userId } });

      if (instancia) {
        // Instância existe - verificar status
        const connectionState = await this.verificarStatusInstancia(instancia.instanceName);
        
        if (connectionState.status === InstanciaStatus.CONECTADA) {
          // Já está conectada
          instancia.status = InstanciaStatus.CONECTADA;
          instancia.lastConnection = new Date();
          await instancia.save();

          // Atualizar campo instance no usuário
          user.instance = instancia.instanceName;
          await user.save();

          return {
            success: true,
            status: InstanciaStatus.CONECTADA,
            message: 'Instância já está conectada',
            instanceName: instancia.instanceName,
          };
        } else {
          // Desconectada - tentar reconectar
          const connectResult = await this.conectarInstanciaExterna(instancia.instanceName);
          
          instancia.status = connectResult.status;
          instancia.qrCode = connectResult.qrCode;
          if (connectResult.status === InstanciaStatus.CONECTADA) {
            instancia.lastConnection = new Date();
          }
          await instancia.save();

          // Atualizar campo instance no usuário
          user.instance = instancia.instanceName;
          await user.save();

          return connectResult;
        }
      } else {
        // Não existe instância - criar nova
        const instanceName = this.gerarNomeInstancia(user);
        
        // Criar instância na API externa
        const createResult = await this.criarInstanciaExterna(instanceName);
        
        if (!createResult.success) {
          throw new Error('Falha ao criar instância na API externa');
        }

        // Salvar no banco
        instancia = await Instancia.create({
          userId,
          instanceName,
          status: createResult.status,
          qrCode: createResult.qrCode,
          apiKey: this.apiKey,
          baseUrl: this.baseUrl,
          integration: this.integration,
          lastConnection: createResult.status === InstanciaStatus.CONECTADA ? new Date() : undefined,
        });

        // Atualizar campo instance no usuário
        user.instance = instanceName;
        await user.save();

        return {
          success: true,
          status: createResult.status,
          qrCode: createResult.qrCode,
          message: 'Instância criada com sucesso',
          instanceName,
        };
      }
    } catch (error) {
      logger.error('Erro ao conectar instância:', error);
      throw error;
    }
  }

  /**
   * Cria uma nova instância na API externa
   */
  private async criarInstanciaExterna(instanceName: string): Promise<InstanciaConnectionResult> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/instance/create`,
        {
          instanceName,
          qrcode: true,
          integration: this.integration,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'apikey': this.apiKey,
          },
        }
      );

      return {
        success: true,
        status: InstanciaStatus.CONECTANDO,
        qrCode: response.data.qrcode?.base64 || response.data.qrcode,
        message: 'Instância criada, aguardando conexão via QR Code',
      };
    } catch (error: any) {
      logger.error('Erro ao criar instância externa:', error);
      return {
        success: false,
        status: InstanciaStatus.ERRO,
        message: error.response?.data?.message || 'Erro ao criar instância',
      };
    }
  }

  /**
   * Conecta uma instância existente
   */
  private async conectarInstanciaExterna(instanceName: string): Promise<InstanciaConnectionResult> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/instance/connect/${instanceName}`,
        {
          headers: {
            'apikey': this.apiKey,
          },
        }
      );

    console.log(response.data);

      return {
        success: true,
        status: InstanciaStatus.CONECTANDO,
        qrCode: response.data.base64 || response.data.qrcode,
        message: 'Conectando instância, aguarde leitura do QR Code',
        instanceName,
      };
    } catch (error: any) {
      logger.error('Erro ao conectar instância externa:', error);
      return {
        success: false,
        status: InstanciaStatus.ERRO,
        message: error.response?.data?.message || 'Erro ao conectar instância',
      };
    }
  }

  /**
   * Verifica o status de conexão da instância
   */
  async verificarStatusInstancia(instanceName: string): Promise<{ status: InstanciaStatus; state?: string }> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/instance/connectionState/${instanceName}`,
        {
          headers: {
            'apikey': this.apiKey,
          },
        }
      );

      const state = response.data.instance.state || response.data.status;
      let status: InstanciaStatus;

      // Mapear estados da API para nossos status
      if (state === 'open' || state === 'connected') {
        status = InstanciaStatus.CONECTADA;
      } else if (state === 'connecting') {
        status = InstanciaStatus.CONECTANDO;
      } else {
        status = InstanciaStatus.DESCONECTADA;
      }

      return { status, state };
    } catch (error: any) {
      logger.error('Erro ao verificar status da instância:', error);
      return { status: InstanciaStatus.ERRO };
    }
  }

  /**
   * Obtém informações da instância do usuário
   */
  async obterInstanciaUsuario(userId: string): Promise<Instancia | null> {
    try {
      const instancia = await Instancia.findOne({ where: { userId } });
      
      if (instancia) {
        // Atualizar status em tempo real
        const statusResult = await this.verificarStatusInstancia(instancia.instanceName);
        if (instancia.status !== statusResult.status) {
          instancia.status = statusResult.status;
          if (statusResult.status === InstanciaStatus.CONECTADA) {
            instancia.lastConnection = new Date();
          }
          await instancia.save();
        }
      }

      return instancia;
    } catch (error) {
      logger.error('Erro ao obter instância do usuário:', error);
      throw error;
    }
  }

  /**
   * Desconecta e faz logout da instância
   */
  async desconectarInstancia(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      const instancia = await Instancia.findOne({ where: { userId } });
      
      if (!instancia) {
        return {
          success: false,
          message: 'Instância não encontrada para este usuário',
        };
      }

      // Fazer logout na API externa
      await axios.delete(
        `${this.baseUrl}/instance/logout/${instancia.instanceName}`,
        {
          headers: {
            'apikey': this.apiKey,
          },
        }
      );

      // Atualizar status no banco
      instancia.status = InstanciaStatus.DESCONECTADA;
      instancia.qrCode = undefined;
      await instancia.save();

      // Limpar campo instance no usuário
      const user = await User.findByPk(userId);
      if (user) {
        user.instance = undefined;
        await user.save();
      }

      return {
        success: true,
        message: 'Instância desconectada com sucesso',
      };
    } catch (error: any) {
      logger.error('Erro ao desconectar instância:', error);
      throw new Error(error.response?.data?.message || 'Erro ao desconectar instância');
    }
  }

  /**
   * Gera um nome único para a instância baseado no usuário
   */
  private gerarNomeInstancia(user: User): string {
    const cleanEmail = user.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
    const timestamp = Date.now();
    return `${cleanEmail}-${timestamp}`;
  }

  /**
   * Atualiza o QR Code de uma instância
   */
  async atualizarQRCode(userId: string): Promise<{ success: boolean; qrCode?: string; message: string }> {
    try {
      const instancia = await Instancia.findOne({ where: { userId } });
      
      if (!instancia) {
        return {
          success: false,
          message: 'Instância não encontrada',
        };
      }

      if (instancia.status === InstanciaStatus.CONECTADA) {
        return {
          success: false,
          message: 'Instância já está conectada',
        };
      }

      // Obter novo QR Code
      const connectResult = await this.conectarInstanciaExterna(instancia.instanceName);
      
      instancia.qrCode = connectResult.qrCode;
      instancia.status = connectResult.status;
      await instancia.save();

      return {
        success: true,
        qrCode: connectResult.qrCode,
        message: 'QR Code atualizado',
      };
    } catch (error) {
      logger.error('Erro ao atualizar QR Code:', error);
      throw error;
    }
  }
}

export default new InstanciaService();
