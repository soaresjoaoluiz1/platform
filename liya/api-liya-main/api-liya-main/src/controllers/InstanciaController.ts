import { Request, Response } from 'express';
import InstanciaService from '../services/InstanciaService';
import logger from '../utils/logger';

class InstanciaController {
  /**
   * Conecta ou cria uma instância do WhatsApp para o usuário autenticado
   * POST /instancias/conectar
   */
  async conectar(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;

      const result = await InstanciaService.conectarInstancia(userId);

      res.status(200).json({
        success: true,
        data: {
          status: result.status,
          qrCode: result.qrCode,
          message: result.message,
          instanceName: result.instanceName,
        },
      });
    } catch (error: any) {
      logger.error('Erro no controller ao conectar instância:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao conectar instância',
      });
    }
  }

  /**
   * Obtém informações da instância do usuário autenticado
   * GET /instancias/minhas
   */
  async obterMinhaInstancia(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;

      const instancia = await InstanciaService.obterInstanciaUsuario(userId);

      if (!instancia) {
        res.status(404).json({
          success: false,
          message: 'Nenhuma instância encontrada para este usuário',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          id: instancia.id,
          instanceName: instancia.instanceName,
          status: instancia.status,
          lastConnection: instancia.lastConnection,
          qrCode: instancia.status === 'conectando' ? instancia.qrCode : undefined,
          createdAt: instancia.createdAt,
        },
      });
    } catch (error: any) {
      logger.error('Erro no controller ao obter instância:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao obter instância',
      });
    }
  }

  /**
   * Verifica o status de conexão da instância do usuário
   * GET /instancias/status
   */
  async verificarStatus(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;

      const instancia = await InstanciaService.obterInstanciaUsuario(userId);

      if (!instancia) {
        res.status(404).json({
          success: false,
          message: 'Nenhuma instância encontrada para este usuário',
        });
        return;
      }

      const statusResult = await InstanciaService.verificarStatusInstancia(
        instancia.instanceName
      );

      res.status(200).json({
        success: true,
        data: {
          instanceName: instancia.instanceName,
          status: statusResult.status,
          state: statusResult.state,
          lastConnection: instancia.lastConnection,
        },
      });
    } catch (error: any) {
      logger.error('Erro no controller ao verificar status:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao verificar status da instância',
      });
    }
  }

  /**
   * Desconecta e faz logout da instância do usuário
   * POST /instancias/desconectar
   */
  async desconectar(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;

      const result = await InstanciaService.desconectarInstancia(userId);

      res.status(200).json({
        success: result.success,
        message: result.message,
      });
    } catch (error: any) {
      logger.error('Erro no controller ao desconectar instância:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao desconectar instância',
      });
    }
  }

  /**
   * Atualiza o QR Code da instância (útil quando o QR Code expira)
   * POST /instancias/qrcode
   */
  async atualizarQRCode(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;

      const result = await InstanciaService.atualizarQRCode(userId);

      if (!result.success) {
        res.status(400).json({
          success: false,
          message: result.message,
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          qrCode: result.qrCode,
          message: result.message,
        },
      });
    } catch (error: any) {
      logger.error('Erro no controller ao atualizar QR Code:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao atualizar QR Code',
      });
    }
  }
}

export default new InstanciaController();
