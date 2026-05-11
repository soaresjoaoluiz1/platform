import { api } from './api';
import type { User } from '../types';
import type { ApiUser } from './mappers';

export type LoginResponse = {
  token: string;
  user: ApiUser;
};

export const authService = {
  async login(email: string, password: string) {
    const { data } = await api.post<LoginResponse>('/api/auth/login', { email, password });
    return data;
  },
  async register(payload: Partial<User> & { password: string }) {
    const { data } = await api.post<User>('/api/auth/register', payload);
    return data;
  }
};
