import { MensagemLancamento } from '../models';
import { Op } from 'sequelize';

interface CreateMensagemLancamentoData {
  lancamentoId: string;
  pergunta: string;
  resposta: string;
  tenantId: string;
}

interface UpdateMensagemLancamentoData {
  pergunta?: string;
  resposta?: string;
  ordem?: number;
}

export class MensagemLancamentoService {
  static async create(data: CreateMensagemLancamentoData) {
    // Buscar a próxima ordem automaticamente para este lançamento específico
    const maxOrdem = await MensagemLancamento.findOne({
      where: { 
        lancamentoId: data.lancamentoId,
        tenantId: data.tenantId 
      },
      order: [['ordem', 'DESC']],
      attributes: ['ordem'],
    });

    const proximaOrdem = maxOrdem ? maxOrdem.dataValues.ordem + 1 : 1;

    const mensagem = await MensagemLancamento.create({
      ...data,
      ordem: proximaOrdem,
    });

    return mensagem;
  }

  static async findAllByLancamento(lancamentoId: string, tenantId: string) {
    const mensagens = await MensagemLancamento.findAll({
      where: { lancamentoId, tenantId },
      order: [['ordem', 'ASC']], // Ordenar pela ordem crescente
    });

    return mensagens;
  }

  static async findById(id: string, tenantId: string) {
    const mensagem = await MensagemLancamento.findOne({
      where: { id, tenantId },
    });

    if (!mensagem) {
      throw new Error('Mensagem de lançamento não encontrada');
    }

    return mensagem;
  }

  static async update(id: string, tenantId: string, data: UpdateMensagemLancamentoData) {
    const mensagem = await this.findById(id, tenantId);

    // Se a ordem foi alterada, precisamos reordenar as outras mensagens
    if (data.ordem !== undefined && data.ordem !== mensagem.dataValues.ordem) {
      await this.reordenar(mensagem.dataValues.lancamentoId, tenantId, mensagem.dataValues.ordem, data.ordem);
    }

    await mensagem.update(data);
    return mensagem;
  }

  static async delete(id: string, tenantId: string) {
    const mensagem = await this.findById(id, tenantId);
    const ordemDeletada = mensagem.dataValues.ordem;
    const lancamentoId = mensagem.dataValues.lancamentoId;

    await mensagem.destroy();

    // Reorganizar as ordens após a exclusão (apenas para este lançamento)
    await MensagemLancamento.decrement('ordem', {
      by: 1,
      where: {
        lancamentoId,
        tenantId,
        ordem: {
          [Op.gt]: ordemDeletada,
        },
      },
    });

    return { message: 'Mensagem de lançamento deletada com sucesso' };
  }

  // Método auxiliar para reordenar as mensagens quando uma ordem é alterada
  private static async reordenar(lancamentoId: string, tenantId: string, ordemAntiga: number, ordemNova: number) {
    if (ordemNova > ordemAntiga) {
      // Movendo para baixo - decrementar as mensagens entre a antiga e a nova posição
      await MensagemLancamento.decrement('ordem', {
        by: 1,
        where: {
          lancamentoId,
          tenantId,
          ordem: {
            [Op.gt]: ordemAntiga,
            [Op.lte]: ordemNova,
          },
        },
      });
    } else {
      // Movendo para cima - incrementar as mensagens entre a nova e a antiga posição
      await MensagemLancamento.increment('ordem', {
        by: 1,
        where: {
          lancamentoId,
          tenantId,
          ordem: {
            [Op.gte]: ordemNova,
            [Op.lt]: ordemAntiga,
          },
        },
      });
    }
  }
}
