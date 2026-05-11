import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth";
import { LeadService } from "../services/LeadService";
import logger from "../utils/logger";

export class LeadController {
    private readonly leadService = new LeadService();

    async getLeads(req: AuthenticatedRequest, res: Response) {
        try {
            const {
                page = "1",
                limit = "10",
                viewType = "list",
                ...filters
            } = req.query as any;
            // Multi-tenant: por padrão usa o tenant do token; ADMIN pode sobrescrever via query ?tenantId=...
            const effectiveFilters: any = { ...filters };
            if (req.user?.tenantId) {
                effectiveFilters.tenantId =
                    filters.tenantId && req.user.role === "ADMIN"
                        ? filters.tenantId
                        : req.user.tenantId;
            }

            const leads = await this.leadService.getLeads(
                req.user!.id,
                req.user!.role,
                parseInt(page as string),
                parseInt(limit as string),
                effectiveFilters,
                viewType as "kanban" | "list",
            );

            res.json(leads);
        } catch (error) {
            logger.error("Get leads error:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async getLead(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;

            const lead = await this.leadService.getLeadById(
                id,
                req.user!.id,
                req.user!.role,
            );
            if (!lead) {
                return res.status(404).json({ error: "Lead não encontrado" });
            }

            res.json(lead);
        } catch (error) {
            logger.error("Get lead error:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async createLead(req: AuthenticatedRequest, res: Response) {
        try {
            const leadData = { ...req.body };
            if (req.user?.tenantId && !leadData.tenantId) {
                leadData.tenantId = req.user.tenantId;
            }

            const lead = await this.leadService.createLead(
                leadData,
                req.user!.id,
                req.user!.role,
            );
            const createdLead = await this.leadService.getLeadById(
                lead.dataValues.id,
                req.user!.id,
                req.user!.role,
            );

            res.status(201).json(createdLead);
        } catch (error) {
            logger.error("Create lead error:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async updateLead(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const leadData = req.body;

            const lead = await this.leadService.updateLead(
                id,
                leadData,
                req.user!.id,
                req.user!.role,
            );
            if (!lead) {
                return res.status(404).json({ error: "Lead não encontrado" });
            }

            res.json(lead);
        } catch (error) {
            logger.error("Update lead error:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async deleteLead(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;

            const deleted = await this.leadService.deleteLead(
                id,
                req.user!.id,
                req.user!.role,
            );
            if (!deleted) {
                return res.status(404).json({ error: "Lead não encontrado" });
            }

            res.status(204).send();
        } catch (error) {
            logger.error("Delete lead error:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async assignLead(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const { corretorId } = req.body;

            const lead = await this.leadService.assignLeadToCorretor(
                id,
                corretorId,
                req.user!.id,
                req.user!.role,
            );

            if (!lead) {
                return res
                    .status(404)
                    .json({ error: "Lead ou corretor não encontrado" });
            }

            res.json(lead);
        } catch (error) {
            logger.error("Assign lead error:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async updateUltimoContato(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;

            const lead = await this.leadService.updateUltimoContato(
                id,
                req.user!.id,
                req.user!.role,
            );

            if (!lead) {
                return res.status(404).json({ error: "Lead não encontrado" });
            }

            res.json({
                message: "Último contato atualizado com sucesso",
                ultimoContato: lead.ultimoContato,
            });
        } catch (error) {
            logger.error("Update ultimo contato error:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async exportToExcel(req: AuthenticatedRequest, res: Response) {
        try {
            const { ...filters } = req.query as any;
            const effectiveFilters: any = { ...filters };
            if (req.user?.tenantId) {
                effectiveFilters.tenantId =
                    filters.tenantId && req.user.role === "ADMIN"
                        ? filters.tenantId
                        : req.user.tenantId;
            }

            const buffer = await this.leadService.exportToExcel(
                req.user!.id,
                req.user!.role,
                effectiveFilters,
            );

            const filename = `leads_${new Date().toISOString().split("T")[0]}.xlsx`;

            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            );
            res.setHeader(
                "Content-Disposition",
                `attachment; filename="${filename}"`,
            );
            res.send(buffer);
        } catch (error) {
            logger.error("Export leads to Excel error:", error);
            res.status(500).json({ error: "Erro ao exportar leads" });
        }
    }

    async assignCadencia(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const { cadenciaId } = req.body;

            if (!cadenciaId) {
                return res
                    .status(400)
                    .json({ error: "cadenciaId é obrigatório" });
            }

            const lead = await this.leadService.assignCadenciaToLead(
                id,
                cadenciaId,
                req.user!.id,
                req.user!.role,
            );

            if (!lead) {
                return res
                    .status(404)
                    .json({ error: "Lead ou cadência não encontrados" });
            }

            res.json(lead);
        } catch (error) {
            logger.error("Assign cadencia error:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async alterarTentativa(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const { tentativaId } = req.body;

            if (!tentativaId) {
                return res
                    .status(400)
                    .json({ error: "tentativaId é obrigatório" });
            }

            const lead = await this.leadService.alterarTentativaAtendimento(
                id,
                tentativaId,
                req.user!.id,
                req.user!.role,
            );

            if (!lead) {
                return res
                    .status(404)
                    .json({ error: "Lead ou tentativa não encontrados" });
            }

            res.json(lead);
        } catch (error) {
            logger.error("Alterar tentativa error:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async getLeadComDetalhes(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;

            const lead = await this.leadService.getLeadComDetalhes(
                id,
                req.user!.id,
                req.user!.role,
            );

            if (!lead) {
                return res.status(404).json({ error: "Lead não encontrado" });
            }

            res.json(lead);
        } catch (error) {
            logger.error("Get lead com detalhes error:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }
}
