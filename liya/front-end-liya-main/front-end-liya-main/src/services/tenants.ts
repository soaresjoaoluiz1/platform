import { api } from "./api";

export interface TenantDTO {
    id: string;
    name: string;
    isActive: boolean;
    primeiraMensagem?: string;
    createdAt?: string;
    updatedAt?: string;
    admin?: TenantAdminDTO | null;
}

export interface TenantAdminDTO {
    id: string;
    name: string;
    email: string;
    role: "IMOBILIARIA";
    whatsapp?: string;
    segmento?: string;
    instance?: string;
    isActive: boolean;
    participateInRoleta: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface UpdateTenantWithAdminPayload {
    tenant?: {
        name?: string;
        isActive?: boolean;
        primeiraMensagem?: string;
    };
    admin?: {
        name?: string;
        email?: string;
        password?: string;
        whatsapp?: string;
        segmento?: string;
        instance?: string;
        isActive?: boolean;
        participateInRoleta?: boolean;
    };
}

export interface TenantConfig {
    primeiraMensagem?: string;
}

export const tenantsService = {
    async list(params?: {
        page?: number;
        limit?: number;
        q?: string;
    }): Promise<TenantDTO[]> {
        const { data } = await api.get<{ tenants: TenantDTO[] }>(
            "/api/tenants",
            { params },
        );
        return data.tenants;
    },
    async create(payload: {
        name: string;
        isActive?: boolean;
    }): Promise<TenantDTO> {
        const { data } = await api.post<TenantDTO>("/api/tenants", {
            ...payload,
            isActive: payload.isActive ?? true,
        });
        return data;
    },
    async update(
        id: string,
        payload: UpdateTenantWithAdminPayload,
    ): Promise<TenantDTO> {
        const { data } = await api.put<TenantDTO>(
            `/api/tenants/${id}`,
            payload,
        );
        return data;
    },
    async toggleStatus(id: string, isActive: boolean): Promise<void> {
        await api.put(`/api/tenants/${id}/status`, {
            isActive,
        });
    },
    async delete(id: string): Promise<void> {
        await api.delete(`/api/tenants/${id}`);
    },
    async getConfig(tenantId: string): Promise<TenantConfig> {
        const { data } = await api.get<TenantConfig>(
            `/api/tenants/${tenantId}/config`,
        );
        return data;
    },
    async updateConfig(tenantId: string, config: TenantConfig): Promise<void> {
        await api.put(`/api/tenants/${tenantId}/config`, config);
    },
};
