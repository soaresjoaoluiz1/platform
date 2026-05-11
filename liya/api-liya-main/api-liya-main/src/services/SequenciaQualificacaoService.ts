import { SequenciaQualificacao } from '../models';
import { Op } from 'sequelize';

interface CreateSequenciaQualificacaoData {
  pergunta: string;
  resposta?: string | null;
  tenantId: string;
}

interface UpdateSequenciaQualificacaoData {
  pergunta?: string;
  resposta?: string | null;
  ordem?: number;
}

export class SequenciaQualificacaoService {
  static async create(data: CreateSequenciaQualificacaoData) {
    // Buscar a próxima ordem automaticamente
    const maxOrdem = await SequenciaQualificacao.findOne({
      where: { tenantId: data.tenantId },
      order: [['ordem', 'DESC']],
      attributes: ['ordem'],
    });

    const proximaOrdem = maxOrdem ? maxOrdem.dataValues.ordem + 1 : 1;

    const sequencia = await SequenciaQualificacao.create({
      ...data,
      ordem: proximaOrdem,
    });

    return sequencia;
  }

  static async findAll(tenantId: string) {
    const sequencias = await SequenciaQualificacao.findAll({
      where: { tenantId },
      order: [['ordem', 'ASC']], // Ordenar pela ordem crescente
    });

    return sequencias;
  }

  static async findById(id: string, tenantId: string) {
    const sequencia = await SequenciaQualificacao.findOne({
      where: { id, tenantId },
    });

    if (!sequencia) {
      throw new Error('Sequência de qualificação não encontrada');
    }

    return sequencia;
  }

  static async update(id: string, tenantId: string, data: UpdateSequenciaQualificacaoData) {
    const sequencia = await this.findById(id, tenantId);

    // Se a ordem foi alterada, precisamos reordenar as outras sequências
    if (data.ordem !== undefined && data.ordem !== sequencia.ordem) {
      await this.reordenar(tenantId, sequencia.ordem, data.ordem);
    }

    await sequencia.update(data);
    return sequencia;
  }

  static async delete(id: string, tenantId: string) {
    const sequencia = await this.findById(id, tenantId);
    const ordemDeletada = sequencia.dataValues.ordem;

    await sequencia.destroy();

    // Reorganizar as ordens após a exclusão
    await SequenciaQualificacao.decrement('ordem', {
      by: 1,
      where: {
        tenantId,
        ordem: {
          [Op.gt]: ordemDeletada,
        },
      },
    });

    return { message: 'Sequência de qualificação deletada com sucesso' };
  }

  // Método auxiliar para reordenar as sequências quando uma ordem é alterada
  private static async reordenar(tenantId: string, ordemAntiga: number, ordemNova: number) {
    if (ordemNova > ordemAntiga) {
      // Movendo para baixo - decrementar as sequências entre a antiga e a nova posição
      await SequenciaQualificacao.decrement('ordem', {
        by: 1,
        where: {
          tenantId,
          ordem: {
            [Op.gt]: ordemAntiga,
            [Op.lte]: ordemNova,
          },
        },
      });
    } else {
      // Movendo para cima - incrementar as sequências entre a nova e a antiga posição
      await SequenciaQualificacao.increment('ordem', {
        by: 1,
        where: {
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
