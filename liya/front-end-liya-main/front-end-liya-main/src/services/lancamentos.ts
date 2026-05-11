import { api } from './api';
import type { 
  Lancamento,
  CreateLancamento,
  UpdateLancamento,
  MensagemLancamento,
  CreateMensagemLancamento,
  UpdateMensagemLancamento
} from '../types';

export const lancamentosService = {
  // ========== LANÇAMENTOS ==========
  async getAll(): Promise<Lancamento[]> {
    const { data } = await api.get<Lancamento[]>('/api/lancamentos');
    return data;
  },

  async getById(id: string): Promise<Lancamento> {
    const { data } = await api.get<Lancamento>(`/api/lancamentos/${id}`);
    return data;
  },

  async create(lancamento: CreateLancamento): Promise<Lancamento> {
    const { data } = await api.post<Lancamento>('/api/lancamentos', lancamento);
    return data;
  },

  async update(id: string, lancamento: UpdateLancamento): Promise<Lancamento> {
    const { data } = await api.put<Lancamento>(`/api/lancamentos/${id}`, lancamento);
    return data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/lancamentos/${id}`);
  },

  // ========== MENSAGENS DE LANÇAMENTO ==========
  async getMensagens(lancamentoId: string): Promise<MensagemLancamento[]> {
    const { data } = await api.get<MensagemLancamento[]>(`/api/lancamentos/${lancamentoId}/mensagens`);
    return data;
  },

  async createMensagem(lancamentoId: string, mensagem: CreateMensagemLancamento): Promise<MensagemLancamento> {
    const { data } = await api.post<MensagemLancamento>(`/api/lancamentos/${lancamentoId}/mensagens`, mensagem);
    return data;
  },

  async updateMensagem(mensagemId: string, mensagem: UpdateMensagemLancamento): Promise<MensagemLancamento> {
    const { data } = await api.put<MensagemLancamento>(`/api/mensagens-lancamento/${mensagemId}`, mensagem);
    return data;
  },

  async deleteMensagem(mensagemId: string): Promise<void> {
    await api.delete(`/api/mensagens-lancamento/${mensagemId}`);
  },
};
