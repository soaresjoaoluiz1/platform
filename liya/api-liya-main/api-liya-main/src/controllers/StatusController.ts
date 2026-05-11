import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth";
import { z } from "zod";
import { StatusService } from "../services/StatusService";
import { createStatusSchema, updateStatusSchema } from "../validation/schemas";

export class StatusController {
    static async create(req: AuthenticatedRequest, res: Response) {
        try {
            const { tenantId } = req.user!;
            if (!tenantId) {
                return res
                    .status(400)
                    .json({ error: "Tenant ID é obrigatório" });
            }

            const validatedData = createStatusSchema.parse(req.body);

            const status = await StatusService.create({
                ...validatedData,
                tenantId,
            });

            res.status(201).json(status);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: "Dados inválidos",
                    details: error.errors,
                });
            }

            if (
                error instanceof Error &&
                error.message.includes("Já existe um status com a ordem")
            ) {
                return res.status(409).json({ message: error.message });
            }

            console.error("Erro ao criar status:", error);
            res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    static async getByTenant(req: AuthenticatedRequest, res: Response) {
        try {
            const { tenantId } = req.user!;

            const statuses = await StatusService.getByTenant(tenantId);
            res.json(statuses);
        } catch (error) {
            console.error("Erro ao buscar statuses:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    static async update(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const { tenantId } = req.user!;

            if (!tenantId) {
                return res
                    .status(400)
                    .json({ error: "Tenant ID é obrigatório" });
            }

            const validatedData = updateStatusSchema.parse(req.body);

            const status = await StatusService.update(
                id,
                validatedData,
                tenantId,
            );

            if (!status) {
                return res.status(404).json({ error: "Status não encontrado" });
            }

            res.json(status);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: "Dados inválidos",
                    details: error.errors,
                });
            }

            if (
                error instanceof Error &&
                error.message.includes("Já existe um status com a ordem")
            ) {
                return res.status(409).json({ error: error.message });
            }

            if (
                error instanceof Error &&
                error.message.includes("é fixo e não pode ser alterado")
            ) {
                return res.status(403).json({ message: error.message });
            }

            console.error("Erro ao atualizar status:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    static async delete(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const { tenantId } = req.user!;

            if (!tenantId) {
                return res
                    .status(400)
                    .json({ error: "Tenant ID é obrigatório" });
            }

            const success = await StatusService.delete(id, tenantId);

            if (!success) {
                return res.status(404).json({
                    error: "Status não encontrado ou não pode ser deletado",
                });
            }

            res.status(204).send();
        } catch (error) {
            if (
                error instanceof Error &&
                error.message.includes("é fixo e não pode ser excluído")
            ) {
                return res.status(403).json({ error: error.message });
            }

            console.error("Erro ao deletar status:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }
}
