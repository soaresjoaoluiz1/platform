import { api } from "./api";
import type { Status } from "../types";

export interface ApiStatus {
    id: string;
    name: string;
    color: string;
    tipo: string;
    ordem: number;
    canUpdate: boolean;
    isDefault: boolean;
    isActive: boolean;
    tenantId: string;
    createdAt?: string;
    updatedAt?: string;
}

const mapStatusFromApi = (s: ApiStatus): Status => ({
    id: s.id,
    name: s.name,
    color: s.color,
    tipo: s.tipo as Status["tipo"],
    ordem: s.ordem,
    canUpdate: s.canUpdate,
    isDefault: s.isDefault,
    isActive: s.isActive,
    tenantId: s.tenantId,
    createdAt: s.createdAt ? new Date(s.createdAt) : undefined,
    updatedAt: s.updatedAt ? new Date(s.updatedAt) : undefined,
});

const mapStatusToApi = (s: Partial<Status>): Partial<ApiStatus> => ({
    name: s.name,
    color: s.color,
    tipo: s.tipo,
    ordem: s.ordem,
    isActive: s.isActive,
});

export const statusService = {
    async list() {
        const { data } = await api.get<ApiStatus[]>("/api/status");
        return data.map(mapStatusFromApi);
    },

    async get(id: string) {
        const { data } = await api.get<ApiStatus>(`/api/status/${id}`);
        return mapStatusFromApi(data);
    },

    async create(
        payload: Omit<
            Status,
            "id" | "tenantId" | "isDefault" | "createdAt" | "updatedAt"
        >,
    ) {
        const { data } = await api.post<ApiStatus>(
            "/api/status",
            mapStatusToApi(payload),
        );
        return mapStatusFromApi(data);
    },

    async update(
        id: string,
        payload: Partial<
            Omit<
                Status,
                "id" | "tenantId" | "isDefault" | "createdAt" | "updatedAt"
            >
        >,
    ) {
        const { data } = await api.put<ApiStatus>(
            `/api/status/${id}`,
            mapStatusToApi(payload),
        );
        return mapStatusFromApi(data);
    },

    async remove(id: string) {
        const { data } = await api.delete<{ success: boolean }>(
            `/api/status/${id}`,
        );
        return data;
    },
};
