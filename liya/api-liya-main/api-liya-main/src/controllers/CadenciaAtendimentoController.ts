import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth";
import { z } from "zod";
import {
    CadenciaAtendimentoService,
    CreateTentativaData,
    UpdateTentativaData,
} from "../services/CadenciaAtendimentoService";
import {
    createCadenciaAtendimentoSchema,
    updateCadenciaAtendimentoSchema,
    createTentativaAtendimentoSchema,
    updateTentativaAtendimentoSchema,
} from "../validation/schemas";

export class CadenciaAtendimentoController {
    // ===== Cadência =====

    static async create(req: AuthenticatedRequest, res: Response) {
        try {
            const tenantId = req.user?.tenantId;
            if (!tenantId) {
                return res
                    .status(400)
                    .json({ error: "Tenant ID é obrigatório" });
            }

            const validatedData = createCadenciaAtendimentoSchema.parse(
                req.body,
            );

            const cadencia = await CadenciaAtendimentoService.create({
                ...validatedData,
                tenantId,
            });

            res.status(201).json(cadencia);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: "Dados inválidos",
                    details: error.errors,
                });
            }

            console.error("Erro ao criar cadência de atendimento:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    static async getAll(req: AuthenticatedRequest, res: Response) {
        try {
            const tenantId = req.user?.tenantId;
            if (!tenantId && req.user?.role !== "ADMIN") {
                return res
                    .status(400)
                    .json({ error: "Tenant ID é obrigatório" });
            }

            const { ativo } = req.query;
            let ativoFilter: boolean | undefined;

            if (ativo !== undefined) {
                ativoFilter = ativo === "true";
            }

            const cadencias = await CadenciaAtendimentoService.findAll(
                tenantId,
                ativoFilter,
            );
            res.json(cadencias);
        } catch (error) {
            console.error("Erro ao buscar cadências de atendimento:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    static async getById(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const tenantId = req.user?.tenantId;

            if (!tenantId) {
                return res
                    .status(400)
                    .json({ error: "Tenant ID é obrigatório" });
            }

            const cadencia = await CadenciaAtendimentoService.findById(
                id,
                tenantId,
            );
            res.json(cadencia);
        } catch (error) {
            if (
                error instanceof Error &&
                error.message.includes("não encontrada")
            ) {
                return res.status(404).json({ error: error.message });
            }

            console.error("Erro ao buscar cadência de atendimento:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    static async update(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const tenantId = req.user?.tenantId;

            if (!tenantId) {
                return res
                    .status(400)
                    .json({ error: "Tenant ID é obrigatório" });
            }

            const validatedData = updateCadenciaAtendimentoSchema.parse(
                req.body,
            );

            const cadencia = await CadenciaAtendimentoService.update(
                id,
                tenantId,
                validatedData,
            );
            res.json(cadencia);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: "Dados inválidos",
                    details: error.errors,
                });
            }

            if (
                error instanceof Error &&
                error.message.includes("não encontrada")
            ) {
                return res.status(404).json({ error: error.message });
            }

            console.error("Erro ao atualizar cadência de atendimento:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    static async delete(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const tenantId = req.user?.tenantId;

            if (!tenantId) {
                return res
                    .status(400)
                    .json({ error: "Tenant ID é obrigatório" });
            }

            const result = await CadenciaAtendimentoService.delete(
                id,
                tenantId,
            );
            res.json(result);
        } catch (error) {
            if (
                error instanceof Error &&
                (error.message.includes("não encontrada") ||
                    error.message.includes("leads associados"))
            ) {
                return res.status(400).json({ error: error.message });
            }

            console.error("Erro ao deletar cadência de atendimento:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    // ===== Tentativas =====

    static async createTentativa(req: AuthenticatedRequest, res: Response) {
        try {
            const { cadenciaId } = req.params;
            const tenantId = req.user?.tenantId;

            if (!tenantId) {
                return res
                    .status(400)
                    .json({ error: "Tenant ID é obrigatório" });
            }

            const validatedData = createTentativaAtendimentoSchema.parse(
                req.body,
            );

            const tentativa = await CadenciaAtendimentoService.createTentativa(
                cadenciaId,
                tenantId,
                validatedData as CreateTentativaData,
            );

            res.status(201).json(tentativa);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: "Dados inválidos",
                    details: error.errors,
                });
            }

            if (error instanceof Error) {
                if (error.message.includes("não encontrada")) {
                    return res.status(404).json({ error: error.message });
                }
                if (error.message.includes("Já existe")) {
                    return res.status(400).json({ error: error.message });
                }
            }

            console.error("Erro ao criar tentativa de atendimento:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    static async getTentativas(req: AuthenticatedRequest, res: Response) {
        try {
            const { cadenciaId } = req.params;
            const tenantId = req.user?.tenantId;

            if (!tenantId) {
                return res
                    .status(400)
                    .json({ error: "Tenant ID é obrigatório" });
            }

            const tentativas = await CadenciaAtendimentoService.getTentativas(
                cadenciaId,
                tenantId,
            );
            res.json(tentativas);
        } catch (error) {
            if (
                error instanceof Error &&
                error.message.includes("não encontrada")
            ) {
                return res.status(404).json({ error: error.message });
            }

            console.error("Erro ao buscar tentativas de atendimento:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    static async getTentativaById(req: AuthenticatedRequest, res: Response) {
        try {
            const { cadenciaId, tentativaId } = req.params;
            const tenantId = req.user?.tenantId;

            if (!tenantId) {
                return res
                    .status(400)
                    .json({ error: "Tenant ID é obrigatório" });
            }

            const tentativa = await CadenciaAtendimentoService.getTentativaById(
                tentativaId,
                cadenciaId,
                tenantId,
            );
            res.json(tentativa);
        } catch (error) {
            if (
                error instanceof Error &&
                error.message.includes("não encontrada")
            ) {
                return res.status(404).json({ error: error.message });
            }

            console.error("Erro ao buscar tentativa de atendimento:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    static async updateTentativa(req: AuthenticatedRequest, res: Response) {
        try {
            const { cadenciaId, tentativaId } = req.params;
            const tenantId = req.user?.tenantId;

            if (!tenantId) {
                return res
                    .status(400)
                    .json({ error: "Tenant ID é obrigatório" });
            }

            const validatedData = updateTentativaAtendimentoSchema.parse(
                req.body,
            );

            const tentativa = await CadenciaAtendimentoService.updateTentativa(
                tentativaId,
                cadenciaId,
                tenantId,
                validatedData as UpdateTentativaData,
            );

            res.json(tentativa);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: "Dados inválidos",
                    details: error.errors,
                });
            }

            if (error instanceof Error) {
                if (error.message.includes("não encontrada")) {
                    return res.status(404).json({ error: error.message });
                }
                if (error.message.includes("Já existe")) {
                    return res.status(400).json({ error: error.message });
                }
            }

            console.error("Erro ao atualizar tentativa de atendimento:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    static async deleteTentativa(req: AuthenticatedRequest, res: Response) {
        try {
            const { cadenciaId, tentativaId } = req.params;
            const tenantId = req.user?.tenantId;

            if (!tenantId) {
                return res
                    .status(400)
                    .json({ error: "Tenant ID é obrigatório" });
            }

            const result = await CadenciaAtendimentoService.deleteTentativa(
                tentativaId,
                cadenciaId,
                tenantId,
            );

            res.json(result);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes("não encontrada")) {
                    return res.status(404).json({ error: error.message });
                }
                if (error.message.includes("leads associados")) {
                    return res.status(400).json({ error: error.message });
                }
            }

            console.error("Erro ao deletar tentativa de atendimento:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }
}
