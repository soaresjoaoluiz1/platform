import { api } from './api';
import type { 
  MensagemPronta, 
  CreateMensagemPronta, 
  UpdateMensagemPronta,
  MensagemProntaFilters 
} from '../types';

/**
 * Lista todas as mensagens prontas do tenant com filtros opcionais
 */
export async function fetchMensagensProntas(filters?: MensagemProntaFilters): Promise<MensagemPronta[]> {
  const params = new URLSearchParams();
  
  if (filters?.statusId) {
    params.append('statusId', filters.statusId);
  }
  if (filters?.search) {
    params.append('search', filters.search);
  }
  if (filters?.isActive !== undefined) {
    params.append('isActive', String(filters.isActive));
  }

  const query = params.toString();
  const url = query ? `/api/mensagens-prontas?${query}` : '/api/mensagens-prontas';
  
  const response = await api.get<MensagemPronta[]>(url);
  return response.data;
}

/**
 * Busca uma mensagem pronta específica por ID
 */
export async function fetchMensagemProntaById(id: string): Promise<MensagemPronta> {
  const response = await api.get<MensagemPronta>(`/api/mensagens-prontas/${id}`);
  return response.data;
}

/**
 * Busca mensagens prontas ativas por status
 */
export async function fetchMensagensProntasByStatus(statusId: string): Promise<MensagemPronta[]> {
  const response = await api.get<MensagemPronta[]>(`/api/mensagens-prontas/status/${statusId}`);
  return response.data;
}

/**
 * Cria uma nova mensagem pronta
 */
export async function createMensagemPronta(data: CreateMensagemPronta): Promise<MensagemPronta> {
  const formData = new FormData();
  formData.append('titulo', data.titulo);
  formData.append('conteudo', data.conteudo);
  if (data.statusId) formData.append('statusId', data.statusId);
  if (data.isActive !== undefined) formData.append('isActive', String(data.isActive));
  if (data.imagem) formData.append('image', data.imagem);
  if (data.video) formData.append('video', data.video);

  const response = await api.post<MensagemPronta>('/api/mensagens-prontas', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
}

/**
 * Atualiza uma mensagem pronta existente
 */
export async function updateMensagemPronta(
  id: string, 
  data: UpdateMensagemPronta
): Promise<MensagemPronta> {
  const formData = new FormData();
  if (data.titulo !== undefined) formData.append('titulo', data.titulo);
  if (data.conteudo !== undefined) formData.append('conteudo', data.conteudo);
  if (data.statusId !== undefined) formData.append('statusId', data.statusId || '');
  if (data.isActive !== undefined) formData.append('isActive', String(data.isActive));
  if (data.imagem !== undefined) {
    if (data.imagem === null) {
      formData.append('removeImagem', 'true');
    } else {
      formData.append('image', data.imagem);
    }
  }
  if (data.video !== undefined) {
    if (data.video === null) {
      formData.append('removeVideo', 'true');
    } else {
      formData.append('video', data.video);
    }
  }

  const response = await api.put<MensagemPronta>(`/api/mensagens-prontas/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
}

/**
 * Alterna o status ativo/inativo de uma mensagem pronta
 */
export async function toggleMensagemProntaActive(id: string): Promise<MensagemPronta> {
  const response = await api.patch<MensagemPronta>(`/api/mensagens-prontas/${id}/toggle-active`);
  return response.data;
}

/**
 * Deleta permanentemente uma mensagem pronta
 */
export async function deleteMensagemPronta(id: string): Promise<void> {
  await api.delete(`/api/mensagens-prontas/${id}`);
}
