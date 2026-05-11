import { api } from "./api";
import type { Lead } from "../types";
import { mapLeadFromApi, mapLeadToApi, type ApiLead } from "./mappers";

export const leadsService = {
    async list(
        params?: Partial<{
            statusId: string;
            assignedTo: string;
            source: string;
            page: number;
            limit: number;
            tenantId: string;
            viewType: "kanban" | "list";
        }>,
    ) {
        const { data } = await api.get<{
            leads: ApiLead[];
            total: number;
            pages: number;
            currentPage: number;
            counters?: Record<string, number>;
        }>("/api/leads", { params });
        return {
            items: data.leads.map(mapLeadFromApi),
            total: data.total,
            pages: data.pages,
            currentPage: data.currentPage,
            counters: data.counters || {},
        };
    },
    async get(id: string) {
        const { data } = await api.get<ApiLead>(`/api/leads/${id}`);
        return mapLeadFromApi(data);
    },
    async getDetails(id: string) {
        const { data } = await api.get<ApiLead>(`/api/leads/${id}/detalhes`);
        return mapLeadFromApi(data);
    },
    async create(payload: Omit<Lead, "id" | "dataContato">) {
        const { data } = await api.post<ApiLead>(
            "/api/leads",
            mapLeadToApi(payload),
        );
        return mapLeadFromApi(data);
    },
    async update(id: string, payload: Partial<Lead>) {
        const { data } = await api.put<ApiLead>(
            `/api/leads/${id}`,
            mapLeadToApi({ id, ...payload }),
        );
        return mapLeadFromApi(data);
    },
    async remove(id: string) {
        const { data } = await api.delete<{ success: boolean }>(
            `/api/leads/${id}`,
        );
        return data;
    },
    async assign(id: string) {
        const { data } = await api.patch<ApiLead>(
            `/api/leads/${id}/assign`,
            {},
        );
        return mapLeadFromApi(data);
    },
    async assignCadencia(id: string, cadenciaId: string) {
        const { data } = await api.patch<ApiLead>(`/api/leads/${id}/cadencia`, {
            cadenciaId,
        });
        return mapLeadFromApi(data);
    },
    async updateTentativa(id: string, tentativaId: string) {
        const { data } = await api.patch<ApiLead>(
            `/api/leads/${id}/tentativa`,
            {
                tentativaId,
            },
        );
        return mapLeadFromApi(data);
    },
    async exportToExcel(
        params?: Partial<{
            statusId: string;
            assignedTo: string;
            source: string;
            tenantId: string;
            startDate: string;
            endDate: string;
        }>,
    ) {
        const response = await api.get("/api/leads/export/excel", {
            params,
            responseType: "blob",
        });

        // Criar um link temporário para download
        const url = globalThis.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;

        // Extrair o nome do arquivo do header ou usar um padrão
        const contentDisposition = response.headers["content-disposition"];
        let filename = `leads_${new Date().toISOString().split("T")[0]}.xlsx`;
        if (contentDisposition) {
            const filenameMatch =
                contentDisposition.match(/filename="?(.+)"?/i);
            if (filenameMatch?.[1]) {
                filename = filenameMatch[1];
            }
        }

        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        globalThis.URL.revokeObjectURL(url);
    },
};
