import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth";
import { TenantService } from "../services/TenantService";
import {
    createTenantSchema,
    deleteTenantSchema,
    updateTenantStatusSchema,
    updateTenantConfigSchema,
    updateTenantWithAdminSchema,
} from "../validation/schemas";
import logger from "../utils/logger";

export class TenantController {
    private readonly tenantService = new TenantService();

    async getTenants(req: AuthenticatedRequest, res: Response) {
        try {
            const { q } = req.query as any;
            const result = await this.tenantService.listTenants(
                q as string | undefined,
            );
            res.json(result);
        } catch (error) {
            logger.error("Get tenants error:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async createTenant(req: AuthenticatedRequest, res: Response) {
        try {
            const parsed = createTenantSchema.safeParse(req.body);
            if (!parsed.success) {
                const messages = parsed.error.errors
                    .map((e: { message: string }) => e.message)
                    .join(", ");
                return res.status(400).json({ error: messages });
            }

            const tenant = await this.tenantService.createTenant(
                parsed.data.name,
            );
            res.status(201).json(tenant);
        } catch (error) {
            logger.error("Create tenant error:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async getById(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const { tenantId: userTenantId, role } = req.user!;

            // Apenas ADMIN pode buscar qualquer tenant
            // Outros usuários só podem buscar o próprio tenant
            if (role !== "ADMIN" && userTenantId !== id) {
                return res.status(403).json({ error: "Acesso negado" });
            }

            const tenant = await this.tenantService.getTenantById(id);

            if (!tenant) {
                return res.status(404).json({ error: "Tenant não encontrado" });
            }

            res.json(tenant);
        } catch (error) {
            logger.error("Erro ao buscar tenant:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async getCurrent(req: AuthenticatedRequest, res: Response) {
        try {
            const { tenantId } = req.user!;

            if (!tenantId) {
                return res
                    .status(400)
                    .json({ error: "Usuário não possui tenant associado" });
            }

            const tenant = await this.tenantService.getTenantById(tenantId);

            if (!tenant) {
                return res.status(404).json({ error: "Tenant não encontrado" });
            }

            res.json(tenant);
        } catch (error) {
            logger.error("Erro ao buscar tenant atual:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async updateStatus(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const parsed = updateTenantStatusSchema.safeParse(req.body);

            if (!parsed.success) {
                const messages = parsed.error.errors
                    .map((e: { message: string }) => e.message)
                    .join(", ");
                return res.status(400).json({ error: messages });
            }

            const tenant = await this.tenantService.updateTenantStatus(
                id,
                parsed.data.isActive,
            );

            logger.info(
                `Tenant status atualizado: ${id} - isActive: ${parsed.data.isActive}`,
            );

            res.json(tenant);
        } catch (error) {
            logger.error("Erro ao atualizar status do tenant:", error);

            if (
                error instanceof Error &&
                error.message === "Tenant não encontrado"
            ) {
                return res.status(404).json({ error: error.message });
            }

            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async updateConfig(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const { tenantId: userTenantId, role } = req.user!;

            // Apenas ADMIN pode atualizar qualquer tenant
            // Outros usuários só podem atualizar o próprio tenant
            if (role !== "ADMIN" && userTenantId !== id) {
                return res.status(403).json({ error: "Acesso negado" });
            }

            const parsed = updateTenantConfigSchema.safeParse(req.body);

            if (!parsed.success) {
                const messages = parsed.error.errors
                    .map((e: { message: string }) => e.message)
                    .join(", ");
                return res.status(400).json({ error: messages });
            }

            const tenant = await this.tenantService.updateTenantConfig(
                id,
                parsed.data,
            );

            logger.info(`Configurações do tenant atualizadas: ${id}`);

            res.json(tenant);
        } catch (error) {
            logger.error("Erro ao atualizar configurações do tenant:", error);

            if (
                error instanceof Error &&
                error.message === "Tenant não encontrado"
            ) {
                return res.status(404).json({ error: error.message });
            }

            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async updateTenantWithAdmin(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const { tenantId: userTenantId, role } = req.user!;

            if (role !== "ADMIN" && userTenantId !== id) {
                return res.status(403).json({ error: "Acesso negado" });
            }

            const parsed = updateTenantWithAdminSchema.safeParse(req.body);

            if (!parsed.success) {
                const messages = parsed.error.errors
                    .map((e: { message: string }) => e.message)
                    .join(", ");
                return res.status(400).json({ error: messages });
            }

            const tenant = await this.tenantService.updateTenantWithAdmin(
                id,
                parsed.data,
            );

            logger.info(`Tenant e administrador atualizados: ${id}`);

            res.json(tenant);
        } catch (error) {
            logger.error("Erro ao atualizar tenant e administrador:", error);

            if (
                error instanceof Error &&
                (error.message === "Tenant não encontrado" ||
                    error.message === "Administrador do tenant não encontrado")
            ) {
                return res.status(404).json({ error: error.message });
            }

            if (
                error instanceof Error &&
                (error.message === "Já existe um tenant com este nome" ||
                    error.message === "Email já está em uso")
            ) {
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async getConfig(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const { tenantId: userTenantId, role } = req.user!;
            // Apenas ADMIN pode buscar qualquer tenant
            // Outros usuários só podem buscar o próprio tenant
            if (role !== "ADMIN" && userTenantId !== id) {
                return res.status(403).json({ error: "Acesso negado" });
            }
            const tenant = await this.tenantService.getTenantById(id);

            if (!tenant) {
                return res.status(404).json({ error: "Tenant não encontrado" });
            }

            res.json({ primeiraMensagem: tenant.primeiraMensagem });
        } catch (error) {
            logger.error("Erro ao buscar configurações do tenant:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async deleteTenant(req: AuthenticatedRequest, res: Response) {
        try {
            const parsed = deleteTenantSchema.safeParse(req.params);

            if (!parsed.success) {
                const messages = parsed.error.errors
                    .map((e: { message: string }) => e.message)
                    .join(", ");
                return res.status(400).json({ error: messages });
            }
            const tenant = await this.tenantService.deleteTenant(
                parsed.data.id,
            );
            res.json(tenant);
        } catch (error) {
            logger.error("Erro ao deletar tenant:", error);
            if (
                error instanceof Error &&
                error.message === "Tenant não encontrado"
            ) {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }
}
