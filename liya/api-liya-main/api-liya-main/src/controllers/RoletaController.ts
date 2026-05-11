import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth";
import { RoletaService } from "../services/RoletaService";
import {
    createRoletaSchema,
    updateRoletaSchema,
    updateSequenciaSchema,
} from "../validation/schemas";
import logger from "../utils/logger";

export class RoletaController {
    private roletaService = new RoletaService();

    /**
     * Lista todas as roletas do tenant
     * Acesso: ADMIN ou IMOBILIARIA
     */
    async getRoletas(req: AuthenticatedRequest, res: Response) {
        try {
            const { tenantId, role } = req.user!;

            // Validar permissão
            if (role !== "ADMIN" && role !== "IMOBILIARIA") {
                return res.status(403).json({ error: "Acesso negado" });
            }

            if (!tenantId) {
                return res
                    .status(400)
                    .json({ error: "Tenant não identificado" });
            }

            const roletas = await this.roletaService.listRoletas(tenantId);
            res.json(roletas);
        } catch (error) {
            logger.error("Get roletas error:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    /**
     * Busca uma roleta específica por ID
     * Acesso: ADMIN ou IMOBILIARIA
     */
    async getRoletaById(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const { tenantId, role } = req.user!;

            // Validar permissão
            if (role !== "ADMIN" && role !== "IMOBILIARIA") {
                return res.status(403).json({ error: "Acesso negado" });
            }

            if (!tenantId) {
                return res
                    .status(400)
                    .json({ error: "Tenant não identificado" });
            }

            const roleta = await this.roletaService.getRoletaById(id, tenantId);

            if (!roleta) {
                return res.status(404).json({ error: "Roleta não encontrada" });
            }

            res.json(roleta);
        } catch (error) {
            logger.error("Get roleta by id error:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    /**
     * Cria uma nova roleta
     * Acesso: ADMIN ou IMOBILIARIA
     */
    async createRoleta(req: AuthenticatedRequest, res: Response) {
        try {
            const { tenantId, role } = req.user!;

            // Validar permissão
            if (role !== "ADMIN" && role !== "IMOBILIARIA") {
                return res.status(403).json({ error: "Acesso negado" });
            }

            if (!tenantId) {
                return res
                    .status(400)
                    .json({ error: "Tenant não identificado" });
            }

            const parsed = createRoletaSchema.safeParse(req.body);
            if (!parsed.success) {
                const messages = parsed.error.errors
                    .map((e: { message: string }) => e.message)
                    .join(", ");
                return res.status(400).json({ error: messages });
            }

            const { tipo, sequencia } = parsed.data;

            const roleta = await this.roletaService.createRoleta(
                tipo,
                tenantId,
                sequencia,
            );
            res.status(201).json(roleta);
        } catch (error: any) {
            logger.error("Create roleta error:", error);
            if (error.message) {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    /**
     * Atualiza uma roleta existente
     * Acesso: ADMIN ou IMOBILIARIA
     */
    async updateRoleta(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const { tenantId, role } = req.user!;

            // Validar permissão
            if (role !== "ADMIN" && role !== "IMOBILIARIA") {
                return res.status(403).json({ error: "Acesso negado" });
            }

            if (!tenantId) {
                return res
                    .status(400)
                    .json({ error: "Tenant não identificado" });
            }

            const parsed = updateRoletaSchema.safeParse(req.body);
            if (!parsed.success) {
                const messages = parsed.error.errors
                    .map((e: { message: string }) => e.message)
                    .join(", ");
                return res.status(400).json({ error: messages });
            }

            const roleta = await this.roletaService.updateRoleta(
                id,
                tenantId,
                parsed.data,
            );
            res.json(roleta);
        } catch (error: any) {
            logger.error("Update roleta error:", error);
            if (error.message) {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    /**
     * Atualiza apenas a sequência da roleta
     * Acesso: ADMIN ou IMOBILIARIA
     */
    async updateSequencia(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const { tenantId, role } = req.user!;

            // Validar permissão
            if (role !== "ADMIN" && role !== "IMOBILIARIA") {
                return res.status(403).json({ error: "Acesso negado" });
            }

            if (!tenantId) {
                return res
                    .status(400)
                    .json({ error: "Tenant não identificado" });
            }

            const parsed = updateSequenciaSchema.safeParse(req.body);
            if (!parsed.success) {
                const messages = parsed.error.errors
                    .map((e: { message: string }) => e.message)
                    .join(", ");
                return res.status(400).json({ error: messages });
            }

            const { sequencia } = parsed.data;

            const roleta = await this.roletaService.updateSequencia(
                id,
                tenantId,
                sequencia,
            );
            res.json(roleta);
        } catch (error: any) {
            logger.error("Update sequencia error:", error);
            if (error.message) {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    /**
     * Deleta uma roleta
     * Não permite deletar roletas do tipo VENDA
     * Acesso: ADMIN ou IMOBILIARIA
     */
    async deleteRoleta(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const { tenantId, role } = req.user!;

            // Validar permissão
            if (role !== "ADMIN" && role !== "IMOBILIARIA") {
                return res.status(403).json({ error: "Acesso negado" });
            }

            if (!tenantId) {
                return res
                    .status(400)
                    .json({ error: "Tenant não identificado" });
            }

            await this.roletaService.deleteRoleta(id, tenantId);
            res.status(204).send();
        } catch (error: any) {
            logger.error("Delete roleta error:", error);
            if (error.message) {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    /**
     * Obtém o próximo vendedor na fila da roleta
     * Acesso: Qualquer usuário autenticado do tenant
     */
    async getProximoVendedor(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const { tenantId } = req.user!;

            if (!tenantId) {
                return res
                    .status(400)
                    .json({ error: "Tenant não identificado" });
            }

            const resultado = await this.roletaService.getProximoVendedor(
                id,
                tenantId,
            );
            res.json(resultado);
        } catch (error: any) {
            logger.error("Get próximo vendedor error:", error);
            if (error.message) {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    /**
     * Incrementa a sequência da roleta (para uso na automação)
     * Acesso: Qualquer usuário autenticado do tenant
     */
    async incrementSequencia(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const { tenantId } = req.user!;

            if (!tenantId) {
                return res
                    .status(400)
                    .json({ error: "Tenant não identificado" });
            }

            const roleta = await this.roletaService.incrementSequencia(
                id,
                tenantId,
            );
            res.json(roleta);
        } catch (error: any) {
            logger.error("Increment sequencia error:", error);
            if (error.message) {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }
}
