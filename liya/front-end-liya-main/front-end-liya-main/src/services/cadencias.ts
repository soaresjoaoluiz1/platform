import { api } from "./api";
import type {
    CadenciaAtendimento,
    CreateCadenciaAtendimento,
    CreateTentativaAtendimento,
    TentativaAtendimento,
    UpdateCadenciaAtendimento,
    UpdateTentativaAtendimento,
} from "../types";

interface ApiTentativaAtendimento {
    id: string;
    cadenciaAtendimentoId: string;
    ordem: number;
    tipoAcao: TentativaAtendimento["tipoAcao"];
    descricao: string;
    instrucoes?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface ApiCadenciaAtendimento {
    id: string;
    nome: string;
    descricao?: string;
    tenantId: string;
    ativo: boolean;
    tentativas?: ApiTentativaAtendimento[];
    createdAt?: string;
    updatedAt?: string;
}

const mapTentativaFromApi = (
    tentativa: ApiTentativaAtendimento,
): TentativaAtendimento => ({
    id: tentativa.id,
    cadenciaAtendimentoId: tentativa.cadenciaAtendimentoId,
    ordem: tentativa.ordem,
    tipoAcao: tentativa.tipoAcao,
    descricao: tentativa.descricao,
    instrucoes: tentativa.instrucoes,
    createdAt: tentativa.createdAt ? new Date(tentativa.createdAt) : undefined,
    updatedAt: tentativa.updatedAt ? new Date(tentativa.updatedAt) : undefined,
});

const mapCadenciaFromApi = (
    cadencia: ApiCadenciaAtendimento,
): CadenciaAtendimento => ({
    id: cadencia.id,
    nome: cadencia.nome,
    descricao: cadencia.descricao,
    tenantId: cadencia.tenantId,
    ativo: cadencia.ativo,
    tentativas: (cadencia.tentativas || [])
        .map(mapTentativaFromApi)
        .sort((a, b) => a.ordem - b.ordem),
    createdAt: cadencia.createdAt ? new Date(cadencia.createdAt) : undefined,
    updatedAt: cadencia.updatedAt ? new Date(cadencia.updatedAt) : undefined,
});

const mapCadenciaToApi = (
    payload: CreateCadenciaAtendimento | UpdateCadenciaAtendimento,
) => ({
    nome: payload.nome,
    descricao: payload.descricao,
    ...(typeof payload.ativo === "boolean" ? { ativo: payload.ativo } : {}),
});

const mapTentativaToApi = (
    payload: CreateTentativaAtendimento | UpdateTentativaAtendimento,
) => ({
    ordem: payload.ordem,
    tipoAcao: payload.tipoAcao,
    descricao: payload.descricao,
    instrucoes: payload.instrucoes,
});

export const cadenciasService = {
    async list(params?: { ativo?: boolean }) {
        const { data } = await api.get<ApiCadenciaAtendimento[]>(
            "/api/cadencias-atendimento",
            { params },
        );
        return data.map(mapCadenciaFromApi);
    },

    async get(id: string) {
        const { data } = await api.get<ApiCadenciaAtendimento>(
            `/api/cadencias-atendimento/${id}`,
        );
        return mapCadenciaFromApi(data);
    },

    async create(payload: CreateCadenciaAtendimento) {
        const { data } = await api.post<ApiCadenciaAtendimento>(
            "/api/cadencias-atendimento",
            mapCadenciaToApi(payload),
        );
        return mapCadenciaFromApi(data);
    },

    async update(id: string, payload: UpdateCadenciaAtendimento) {
        const { data } = await api.put<ApiCadenciaAtendimento>(
            `/api/cadencias-atendimento/${id}`,
            mapCadenciaToApi(payload),
        );
        return mapCadenciaFromApi(data);
    },

    async remove(id: string) {
        const { data } = await api.delete<{ message: string }>(
            `/api/cadencias-atendimento/${id}`,
        );
        return data;
    },

    async createTentativa(
        cadenciaId: string,
        payload: CreateTentativaAtendimento,
    ) {
        const { data } = await api.post<ApiTentativaAtendimento>(
            `/api/cadencias-atendimento/${cadenciaId}/tentativas`,
            mapTentativaToApi(payload),
        );
        return mapTentativaFromApi(data);
    },

    async updateTentativa(
        cadenciaId: string,
        tentativaId: string,
        payload: UpdateTentativaAtendimento,
    ) {
        const { data } = await api.put<ApiTentativaAtendimento>(
            `/api/cadencias-atendimento/${cadenciaId}/tentativas/${tentativaId}`,
            mapTentativaToApi(payload),
        );
        return mapTentativaFromApi(data);
    },

    async removeTentativa(cadenciaId: string, tentativaId: string) {
        const { data } = await api.delete<{ message: string }>(
            `/api/cadencias-atendimento/${cadenciaId}/tentativas/${tentativaId}`,
        );
        return data;
    },
};
