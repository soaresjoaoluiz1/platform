import { api } from './api';
import type { User } from '../types';
import { mapUserFromApi, mapUserToApi, type ApiUser } from './mappers';

export type CreateUserInput = Omit<User, 'id'> & { password?: string };
type ApiUserCreate = ApiUser & { password?: string };

export const usersService = {
  async list() {
  const { data } = await api.get<ApiUser[]>('/api/users');
  return data.map(mapUserFromApi);
  },
  async get(id: string) {
  const { data } = await api.get<ApiUser>(`/api/users/${id}`);
  return mapUserFromApi(data);
  },
  async create(payload: CreateUserInput) {
  const body: Partial<ApiUserCreate> = { ...mapUserToApi(payload), password: payload.password };
  const { data } = await api.post<ApiUser>('/api/users', body);
  return mapUserFromApi(data);
  },
  async update(id: string, payload: Partial<User>) {
  const { data } = await api.put<ApiUser>(`/api/users/${id}`, mapUserToApi({ id, ...payload }));
  return mapUserFromApi(data);
  },
  async remove(id: string) {
    const { data } = await api.delete<{ success: boolean }>(`/api/users/${id}`);
    return data;
  },
  async toggleStatus(id: string) {
  const { data } = await api.patch<ApiUser>(`/api/users/${id}/toggle-status`, {});
  return mapUserFromApi(data);
  },
  async toggleRoleta(id: string) {
  const { data } = await api.patch<ApiUser>(`/api/users/${id}/toggle-roleta`, {});
  return mapUserFromApi(data);
  },
  async corretores(params?: { tenantId?: string; page?: number; limit?: number }) {
    const { data } = await api.get<ApiUser[]>('/api/users/corretores', { params });
    return data.map(mapUserFromApi);
  }
};
