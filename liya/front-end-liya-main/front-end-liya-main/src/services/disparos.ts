import { api } from './api';
import { mapDisparoFromApi, type ApiDisparo } from './mappers';

export const disparosService = {
  async list(params?: { tenantId?: string; page?: number; limit?: number; statusId?: string }) {
    const { data } = await api.get<{disparos: ApiDisparo[]}>('/api/disparos', { params });
    return data.disparos.map(mapDisparoFromApi);
  },
  async get(id: string) {
    const { data } = await api.get<ApiDisparo>(`/api/disparos/${id}`);
    return mapDisparoFromApi(data);
  },
  async create(payload: {
    message: string;
    image?: File;
    video?: File;
    scheduledAt?: string;
    instance: string;
    filter?: { statusId?: string[]; source?: string[] };
    tenantId?: string;
    allLeads?: boolean;
    tipo?: 'agendado' | 'follow_up';
    followUpDays?: number;
    followUpStatusId?: string;
  }) {
    const formData = new FormData();
    formData.append('message', payload.message);
    formData.append('instance', payload.instance);
    
    if (payload.scheduledAt) {
      formData.append('scheduledAt', payload.scheduledAt);
    }
    
    if (payload.image) {
      formData.append('image', payload.image);
    }
    
    if (payload.video) {
      formData.append('video', payload.video);
    }
    
    if (payload.filter) {
      formData.append('filter', JSON.stringify(payload.filter));
    }
    
    if (payload.tenantId) {
      formData.append('tenantId', payload.tenantId);
    }

    if (payload.allLeads !== undefined) {
      formData.append('allLeads', String(payload.allLeads));
    }

    if (payload.tipo) {
      formData.append('tipo', payload.tipo);
    }

    if (payload.followUpDays !== undefined) {
      formData.append('followUpDays', String(payload.followUpDays));
    }

    if (payload.followUpStatusId) {
      formData.append('followUpStatusId', payload.followUpStatusId);
    }

    const { data } = await api.post<ApiDisparo>('/api/disparos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return mapDisparoFromApi(data);
  },
  async update(id: string, payload: Partial<{
    message: string;
    image?: File;
    video?: File;
    scheduledAt?: string;
    instance: string;
    filter?: { statusId?: string[]; source?: string[] };
    allLeads?: boolean;
    tipo?: 'agendado' | 'follow_up';
    followUpDays?: number;
    followUpStatusId?: string;
  }>) {
    const formData = new FormData();
    
    if (payload.message) {
      formData.append('message', payload.message);
    }
    
    if (payload.scheduledAt) {
      formData.append('scheduledAt', payload.scheduledAt);
    }
    
    if (payload.instance) {
      formData.append('instance', payload.instance);
    }
    
    if (payload.image) {
      formData.append('image', payload.image);
    }
    
    if (payload.video) {
      formData.append('video', payload.video);
    }
    
    if (payload.filter) {
      formData.append('filter', JSON.stringify(payload.filter));
    }

    if (payload.allLeads !== undefined) {
      formData.append('allLeads', String(payload.allLeads));
    }

    if (payload.tipo) {
      formData.append('tipo', payload.tipo);
    }

    if (payload.followUpDays !== undefined) {
      formData.append('followUpDays', String(payload.followUpDays));
    }

    if (payload.followUpStatusId) {
      formData.append('followUpStatusId', payload.followUpStatusId);
    }

    const { data } = await api.put<ApiDisparo>(`/api/disparos/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return mapDisparoFromApi(data);
  },
  async remove(id: string) {
    const { data } = await api.delete<{ success: boolean }>(`/api/disparos/${id}`);
    return data;
  },
  async process(id: string) {
    const { data } = await api.post<{ success: boolean }>(`/api/disparos/${id}/process`, {});
    return data;
  }
};
