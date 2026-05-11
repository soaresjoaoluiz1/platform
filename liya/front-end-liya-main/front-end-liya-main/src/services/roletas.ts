import { api } from "./api";
import { Roleta, CreateRoleta, UpdateRoleta } from "../types";

export const roletaService = {
    // Listar todas as roletas do tenant
    list: async (): Promise<Roleta[]> => {
        const response = await api.get("/api/roletas");
        return response.data;
    },

    // Buscar roleta por ID
    getById: async (id: string): Promise<Roleta> => {
        const response = await api.get(`/api/roletas/${id}`);
        return response.data;
    },

    // Criar nova roleta
    create: async (data: CreateRoleta): Promise<Roleta> => {
        const response = await api.post("/api/roletas", data);
        return response.data;
    },

    // Atualizar roleta
    update: async (id: string, data: UpdateRoleta): Promise<Roleta> => {
        const response = await api.put(`/api/roletas/${id}`, data);
        return response.data;
    },

    // Excluir roleta
    delete: async (id: string): Promise<void> => {
        await api.delete(`/api/roletas/${id}`);
    },
};
