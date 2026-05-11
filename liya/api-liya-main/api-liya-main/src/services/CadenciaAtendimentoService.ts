import { CadenciaAtendimento, TentativaAtendimento } from "../models";
import { Op } from "sequelize";
import { TipoAcao } from "../models/TentativaAtendimento";

interface CreateCadenciaAtendimentoData {
    nome: string;
    descricao?: string;
    tenantId: string;
}

interface UpdateCadenciaAtendimentoData {
    nome?: string;
    descricao?: string;
    ativo?: boolean;
}

export interface CreateTentativaData {
    ordem: number;
    tipoAcao: TipoAcao;
    descricao: string;
    instrucoes?: string;
}

export interface UpdateTentativaData {
    ordem?: number;
    tipoAcao?: TipoAcao;
    descricao?: string;
    instrucoes?: string;
}

export class CadenciaAtendimentoService {
    // ===== Cadência =====

    static async create(data: CreateCadenciaAtendimentoData) {
        const cadencia = await CadenciaAtendimento.create(data);
        return cadencia;
    }

    static async findAll(tenantId?: string, ativo?: boolean) {
        const where: any = { };
        if (tenantId) {
            where.tenantId = tenantId;
        }
        if (ativo !== undefined) {
            where.ativo = ativo;
        }

        const cadencias = await CadenciaAtendimento.findAll({
            where,
            include: [
                {
                    model: TentativaAtendimento,
                    as: "tentativas",
                    order: [["ordem", "ASC"]],
                },
            ],
            order: [["createdAt", "DESC"]],
        });

        return cadencias;
    }

    static async findById(id: string, tenantId: string) {
        const cadencia = await CadenciaAtendimento.findOne({
            where: { id, tenantId },
            include: [
                {
                    model: TentativaAtendimento,
                    as: "tentativas",
                    order: [["ordem", "ASC"]],
                },
            ],
        });

        if (!cadencia) {
            throw new Error("Cadência de atendimento não encontrada");
        }

        return cadencia;
    }

    static async update(
        id: string,
        tenantId: string,
        data: UpdateCadenciaAtendimentoData,
    ) {
        const cadencia = await this.findById(id, tenantId);
        await cadencia.update(data);

        // Recarregar com associações
        const updated = await this.findById(id, tenantId);
        return updated;
    }

    static async delete(id: string, tenantId: string) {
        const cadencia = await this.findById(id, tenantId);

        // Verificar se há leads usando esta cadência
        const { Lead } = require("../models");
        const leadsCount = await Lead.count({
            where: { cadenciaAtendimentoId: id },
        });

        if (leadsCount > 0) {
            throw new Error(
                "Não é possível deletar uma cadência que tem leads associados",
            );
        }

        await cadencia.destroy();
        return { message: "Cadência de atendimento deletada com sucesso" };
    }

    // ===== Tentativas =====

    static async createTentativa(
        cadenciaId: string,
        tenantId: string,
        data: CreateTentativaData,
    ) {
        // Validar que a cadência existe e pertence ao tenant
        const cadencia = await this.findById(cadenciaId, tenantId);

        // Validar unicidade de ordem
        const tentativaExistente = await TentativaAtendimento.findOne({
            where: {
                cadenciaAtendimentoId: cadenciaId,
                ordem: data.ordem,
            },
        });

        if (tentativaExistente) {
            throw new Error(
                "Já existe uma tentativa com essa ordem nesta cadência",
            );
        }

        const tentativa = await TentativaAtendimento.create({
            ...data,
            cadenciaAtendimentoId: cadenciaId,
        });

        return tentativa;
    }

    static async getTentativas(cadenciaId: string, tenantId: string) {
        // Validar que a cadência existe e pertence ao tenant
        await this.findById(cadenciaId, tenantId);

        const tentativas = await TentativaAtendimento.findAll({
            where: { cadenciaAtendimentoId: cadenciaId },
            order: [["ordem", "ASC"]],
        });

        return tentativas;
    }

    static async getTentativaById(
        tentativaId: string,
        cadenciaId: string,
        tenantId: string,
    ) {
        // Validar que a cadência existe e pertence ao tenant
        await this.findById(cadenciaId, tenantId);

        const tentativa = await TentativaAtendimento.findOne({
            where: {
                id: tentativaId,
                cadenciaAtendimentoId: cadenciaId,
            },
        });

        if (!tentativa) {
            throw new Error("Tentativa de atendimento não encontrada");
        }

        return tentativa;
    }

    static async updateTentativa(
        tentativaId: string,
        cadenciaId: string,
        tenantId: string,
        data: UpdateTentativaData,
    ) {
        const tentativa = await this.getTentativaById(
            tentativaId,
            cadenciaId,
            tenantId,
        );

        // Se a ordem foi alterada, validar unicidade
        if (data.ordem !== undefined && data.ordem !== tentativa.ordem) {
            const tentativaComOrdem = await TentativaAtendimento.findOne({
                where: {
                    cadenciaAtendimentoId: cadenciaId,
                    ordem: data.ordem,
                    id: { [Op.ne]: tentativaId },
                },
            });

            if (tentativaComOrdem) {
                throw new Error(
                    "Já existe uma tentativa com essa ordem nesta cadência",
                );
            }
        }

        await tentativa.update(data);
        return tentativa;
    }

    static async deleteTentativa(
        tentativaId: string,
        cadenciaId: string,
        tenantId: string,
    ) {
        const tentativa = await this.getTentativaById(
            tentativaId,
            cadenciaId,
            tenantId,
        );

        // Verificar se há leads usando esta tentativa
        const { Lead } = require("../models");
        const leadsCount = await Lead.count({
            where: { tentativaAtendimentoId: tentativaId },
        });

        if (leadsCount > 0) {
            throw new Error(
                "Não é possível deletar uma tentativa que tem leads associados",
            );
        }

        await tentativa.destroy();
        return { message: "Tentativa de atendimento deletada com sucesso" };
    }

    // ===== Helpers =====

    static async getProximaTentativa(tentativaAtual: TentativaAtendimento) {
        const proximaTentativa = await TentativaAtendimento.findOne({
            where: {
                cadenciaAtendimentoId: tentativaAtual.cadenciaAtendimentoId,
                ordem: {
                    [Op.gt]: tentativaAtual.ordem,
                },
            },
            order: [["ordem", "ASC"]],
        });

        return proximaTentativa || null;
    }

    static async getTentativaInicial(cadenciaId: string) {
        const tentativa = await TentativaAtendimento.findOne({
            where: { cadenciaAtendimentoId: cadenciaId },
            order: [["ordem", "ASC"]],
        });

        return tentativa;
    }
}
