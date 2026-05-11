import { api } from './api';
import type { 
  SequenciaQualificacao, 
  CreateSequenciaQualificacao, 
  UpdateSequenciaQualificacao 
} from '../types';

export const sequenciasService = {
  async getAll(): Promise<SequenciaQualificacao[]> {
    const { data } = await api.get<SequenciaQualificacao[]>('/api/sequencias-qualificacao');
    return data;
  },

  async getById(id: string): Promise<SequenciaQualificacao> {
    const { data } = await api.get<SequenciaQualificacao>(`/api/sequencias-qualificacao/${id}`);
    return data;
  },

  async create(sequencia: CreateSequenciaQualificacao): Promise<SequenciaQualificacao> {
    const { data } = await api.post<SequenciaQualificacao>('/api/sequencias-qualificacao', sequencia);
    return data;
  },

  async update(id: string, sequencia: UpdateSequenciaQualificacao): Promise<SequenciaQualificacao> {
    const { data } = await api.put<SequenciaQualificacao>(`/api/sequencias-qualificacao/${id}`, sequencia);
    return data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/sequencias-qualificacao/${id}`);
  },
};
