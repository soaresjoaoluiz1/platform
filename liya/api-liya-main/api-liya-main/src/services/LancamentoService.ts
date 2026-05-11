import { Lancamento, MensagemLancamento } from '../models';

interface CreateLancamentoData {
  titulo: string;
  identificacaoAnuncio: string;
  tenantId: string;
}

interface UpdateLancamentoData {
  titulo?: string;
  identificacaoAnuncio?: string;
}

export class LancamentoService {
  static async create(data: CreateLancamentoData) {
    const lancamento = await Lancamento.create(data);
    return lancamento;
  }

  static async findAll(tenantId: string) {
    const lancamentos = await Lancamento.findAll({
      where: { tenantId },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: MensagemLancamento,
          as: 'mensagens',
          order: [['ordem', 'ASC']],
        },
      ],
    });

    return lancamentos;
  }

  static async findById(id: string, tenantId: string) {
    const lancamento = await Lancamento.findOne({
      where: { id, tenantId },
      include: [
        {
          model: MensagemLancamento,
          as: 'mensagens',
          order: [['ordem', 'ASC']],
        },
      ],
    });

    if (!lancamento) {
      throw new Error('Lançamento não encontrado');
    }

    return lancamento;
  }

  static async update(id: string, tenantId: string, data: UpdateLancamentoData) {
    const lancamento = await this.findById(id, tenantId);
    await lancamento.update(data);
    
    // Recarregar com as mensagens
    return await this.findById(id, tenantId);
  }

  static async delete(id: string, tenantId: string) {
    const lancamento = await this.findById(id, tenantId);
    await lancamento.destroy();
    return { message: 'Lançamento deletado com sucesso' };
  }
}
