import { api } from './api';
import { mapDashboardFromApi, type ApiDashboardStats } from './mappers';

export const dashboardService = {
  async stats(params: { period?: string; from?: string; to?: string; tenantId?: string }) {
    const { data } = await api.get<ApiDashboardStats>('/api/dashboard/stats', { params });
    return mapDashboardFromApi(data);
  }
};
