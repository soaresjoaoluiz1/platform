import { Lead, User, Status } from "../models";
import { UserRole } from "../types";
import { Op } from "sequelize";

export class LeadService {
    async createLead(leadData: any, userId: string, userRole: UserRole) {
        // Remover campo publico do leadData para evitar alteração via API
        delete leadData.publico;

        // Se não foi especificado assignedTo, usar sistema de roleta
        if (!leadData.assignedTo) {
            const assignedCorretor = await this.getNextCorretorFromRoleta(
                leadData.tenantId,
            );
            leadData.assignedTo = assignedCorretor?.id || userId;
        }

        // Se não foi especificado statusId, usar o status padrão do tenant
        if (!leadData.statusId && leadData.tenantId) {
            const defaultStatus = await Status.findOne({
                where: {
                    tenantId: leadData.tenantId,
                    isDefault: true,
                    isActive: true,
                },
            });
            if (defaultStatus) {
                leadData.statusId = defaultStatus.id;
            }
        }

        return await Lead.create(leadData);
    }

    async getLeadById(id: string, userId: string, userRole: UserRole) {
        const where: any = { id };

        // Aplicar filtros baseados no role
        if (userRole === UserRole.CORRETOR) {
            where.assignedTo = userId;
        } else if (userRole === UserRole.IMOBILIARIA) {
            // Buscar corretores da imobiliária
            const corretores = await User.findAll({
                where: { role: UserRole.CORRETOR },
                attributes: ["id"],
            });
            where.assignedTo = { [Op.in]: corretores.map((c) => c.id) };
        }

        return await Lead.findOne({
            where,
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name", "email", "whatsapp"],
                },
                {
                    model: Status,
                    as: "leadStatus",
                    attributes: ["id", "name", "color", "tipo", "ordem"],
                },
            ],
        });
    }

    async updateLead(
        id: string,
        leadData: any,
        userId: string,
        userRole: UserRole,
    ) {
        const lead = await this.getLeadById(id, userId, userRole);
        if (!lead) return null;

        // Remover campo publico do leadData para evitar alteração via API
        delete leadData.publico;

        await lead.update(leadData);
        return await this.getLeadById(id, userId, userRole);
    }

    async deleteLead(id: string, userId: string, userRole: UserRole) {
        const lead = await this.getLeadById(id, userId, userRole);
        if (!lead) return false;

        await lead.destroy();
        return true;
    }

    async getLeads(
        userId: string,
        userRole: UserRole,
        page = 1,
        limit = 10,
        filters: any = {},
        viewType: "kanban" | "list" = "list",
    ) {
        const offset = (page - 1) * limit;
        const isKanban = viewType === "kanban";
        // whereBase: aplica restrições de role e todos os filtros, exceto status (para somatórios por status)
        const whereBase: any = {};

        // Multi-tenant: restringe por tenantId se fornecido nos filtros
        if (filters.tenantId) {
            whereBase.tenantId = filters.tenantId;
        }

        // Aplicar filtros baseados no role
        if (userRole === UserRole.CORRETOR) {
            whereBase.assignedTo = userId;
        } else if (userRole === UserRole.IMOBILIARIA) {
            const corretores = await User.findAll({
                where: { role: UserRole.CORRETOR },
                attributes: ["id"],
            });
            whereBase.assignedTo = { [Op.in]: corretores.map((c) => c.id) };
        }

        // Aplicar filtros adicionais
        if (filters.source) {
            whereBase.source = filters.source;
        }
        if (filters.assignedTo) {
            whereBase.assignedTo = filters.assignedTo;
        }
        if (filters.startDate && filters.endDate) {
            whereBase.createdAt = {
                [Op.between]: [
                    new Date(filters.startDate),
                    new Date(filters.endDate),
                ],
            };
        }

        // where para a listagem (inclui o status se filtrado)
        const where: any = { ...whereBase };
        if (filters.statusId) {
            where.statusId = filters.statusId;
        }

        const { count, rows } = await Lead.findAndCountAll({
            where,
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name", "email", "whatsapp"],
                },
                {
                    model: Status,
                    as: "leadStatus",
                    attributes: ["id", "name", "color", "tipo", "ordem"],
                },
            ],
            ...(isKanban ? {} : { offset, limit }),
            order: [["createdAt", "DESC"]],
        });

        // Buscar todos os status do tenant para contadores dinâmicos
        const tenantStatuses = await Status.findAll({
            where: {
                ...(whereBase.tenantId ? { tenantId: whereBase.tenantId } : {}),
                isActive: true,
            },
            attributes: ["id", "tipo"],
            order: [["createdAt", "ASC"]],
        });

        // Contadores agregados por tipo de status (ignorando paginação e filtro de status)
        const tipoCounters: Record<string, number> = {
            novo: 0,
            contato: 0,
            convertido: 0,
        };

        // Contar leads para cada status e agrupar por tipo
        await Promise.all(
            tenantStatuses.map(async (status) => {
                const count = await Lead.count({
                    where: {
                        ...whereBase,
                        statusId: status.dataValues.id,
                    },
                });
                const tipo = status.dataValues.tipo;
                tipoCounters[tipo] = (tipoCounters[tipo] || 0) + count;
            }),
        );

        return {
            leads: rows,
            total: count,
            pages: Math.ceil(count / limit),
            currentPage: page,
            counters: tipoCounters,
        };
    }

    private async getNextCorretorFromRoleta(tenantId?: string) {
        const corretoresAtivos = await User.findAll({
            where: {
                role: UserRole.CORRETOR,
                isActive: true,
                participateInRoleta: true,
                ...(tenantId ? { tenantId } : {}),
            },
            order: [["createdAt", "ASC"]],
        });

        if (corretoresAtivos.length === 0) return null;

        // Implementar lógica de roleta (pode ser melhorada com contador de leads)
        const randomIndex = Math.floor(Math.random() * corretoresAtivos.length);
        return corretoresAtivos[randomIndex];
    }

    async assignLeadToCorretor(
        leadId: string,
        corretorId: string,
        userId: string,
        userRole: UserRole,
    ) {
        const lead = await this.getLeadById(leadId, userId, userRole);
        if (!lead) return null;

        const corretor = await User.findOne({
            where: { id: corretorId, role: UserRole.CORRETOR, isActive: true },
        });
        if (!corretor) return null;

        await lead.update({ assignedTo: corretorId });
        return await this.getLeadById(leadId, userId, userRole);
    }

    async updateUltimoContato(
        leadId: string,
        userId: string,
        userRole: UserRole,
    ) {
        const lead = await this.getLeadById(leadId, userId, userRole);
        if (!lead) return null;

        await lead.update({ ultimoContato: new Date() });
        return lead;
    }

    async exportToExcel(userId: string, userRole: UserRole, filters: any = {}) {
        const ExcelJS = require("exceljs");

        // Buscar todos os leads sem paginação
        const whereBase: any = {};

        if (filters.tenantId) {
            whereBase.tenantId = filters.tenantId;
        }

        if (userRole === UserRole.CORRETOR) {
            whereBase.assignedTo = userId;
        } else if (userRole === UserRole.IMOBILIARIA) {
            const corretores = await User.findAll({
                where: { role: UserRole.CORRETOR },
                attributes: ["id"],
            });
            whereBase.assignedTo = { [Op.in]: corretores.map((c) => c.id) };
        }

        // Aplicar filtros adicionais
        if (filters.source) {
            whereBase.source = filters.source;
        }
        if (filters.assignedTo) {
            whereBase.assignedTo = filters.assignedTo;
        }
        if (filters.statusId) {
            whereBase.statusId = filters.statusId;
        }
        if (filters.startDate && filters.endDate) {
            whereBase.createdAt = {
                [Op.between]: [
                    new Date(filters.startDate),
                    new Date(filters.endDate),
                ],
            };
        }

        const leads = await Lead.findAll({
            where: whereBase,
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name", "email"],
                },
                {
                    model: Status,
                    as: "leadStatus",
                    attributes: ["id", "name"],
                },
            ],
            order: [["createdAt", "DESC"]],
        });

        // Criar planilha
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Leads");

        // Definir cabeçalhos
        worksheet.columns = [
            { header: "Nome", key: "name", width: 30 },
            { header: "Email", key: "email", width: 30 },
            { header: "Telefone", key: "phone", width: 20 },
            { header: "Status", key: "status", width: 20 },
            { header: "Corretor", key: "corretor", width: 30 },
            { header: "Origem", key: "source", width: 20 },
            { header: "Publico", key: "publico", width: 10 },
        ];

        // Estilizar cabeçalhos
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF4F81BD" },
        };
        worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };

        // Adicionar dados
        leads.forEach((lead: any) => {
            console.log(lead);
            worksheet.addRow({
                name: lead.dataValues.name,
                email: lead.dataValues.email || "",
                phone: lead.dataValues.phone,
                status: lead.leadStatus?.dataValues?.name || "Sem status",
                corretor: lead.user?.name || "Não atribuído",
                source: lead.dataValues.source,
                publico: lead.dataValues.publico || "",
            });
        });

        // Gerar buffer
        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
    }

    async assignCadenciaToLead(
        leadId: string,
        cadenciaId: string,
        userId: string,
        userRole: UserRole,
    ) {
        const lead = await this.getLeadById(leadId, userId, userRole);
        if (!lead) return null;

        // Verificar se a cadência existe
        const { CadenciaAtendimento } = require("../models");
        const cadencia = await CadenciaAtendimento.findOne({
            where: { id: cadenciaId, tenantId: lead.dataValues.tenantId },
        });
        if (!cadencia) return null;

        // Buscar a primeira tentativa da cadência
        const {
            CadenciaAtendimentoService,
        } = require("./CadenciaAtendimentoService");
        const primeiraTentativa =
            await CadenciaAtendimentoService.getTentativaInicial(cadenciaId);

        // Atualizar lead com cadência e primeira tentativa
        await lead.update({
            cadenciaAtendimentoId: cadenciaId,
            tentativaAtendimentoId: primeiraTentativa?.dataValues.id || null,
        });

        return await this.getLeadComDetalhes(leadId, userId, userRole);
    }

    async alterarTentativaAtendimento(
        leadId: string,
        novaTentativaId: string,
        userId: string,
        userRole: UserRole,
    ) {
        const lead = await this.getLeadById(leadId, userId, userRole);
        if (!lead) return null;

        // Verificar se a tentativa existe e pertence à cadência do lead
        const { TentativaAtendimento } = require("../models");
        const tentativa = await TentativaAtendimento.findOne({
            where: {
                id: novaTentativaId,
                cadenciaAtendimentoId: lead.dataValues.cadenciaAtendimentoId,
            },
        });
        if (!tentativa) return null;

        // Atualizar tentativa do lead
        await lead.update({ tentativaAtendimentoId: novaTentativaId });

        return await this.getLeadComDetalhes(leadId, userId, userRole);
    }

    async getLeadComDetalhes(
        leadId: string,
        userId: string,
        userRole: UserRole,
    ) {
        const lead = await Lead.findOne({
            where: { id: leadId },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name", "email", "whatsapp"],
                },
                {
                    model: Status,
                    as: "leadStatus",
                    attributes: ["id", "name", "color", "tipo", "ordem"],
                },
                {
                    model: require("../models").CadenciaAtendimento,
                    as: "cadenciaAtendimento",
                    attributes: ["id", "nome", "descricao"],
                    include: [
                        {
                            model: require("../models").TentativaAtendimento,
                            as: "tentativas",
                            order: [["ordem", "ASC"]],
                        },
                    ],
                },
                {
                    model: require("../models").TentativaAtendimento,
                    as: "tentativaAtual",
                    attributes: [
                        "id",
                        "ordem",
                        "tipoAcao",
                        "descricao",
                        "instrucoes",
                    ],
                },
            ],
        });

        return lead;
    }
}
