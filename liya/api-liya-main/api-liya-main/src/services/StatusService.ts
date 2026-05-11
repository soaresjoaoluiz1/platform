import { Status } from "../models";
import { StatusTipo } from "../types";
import { Op } from "sequelize";

interface CreateStatusData {
    name: string;
    color?: string;
    tipo: StatusTipo;
    ordem: number;
    isDefault?: boolean;
    isActive?: boolean;
    tenantId: string;
}

interface UpdateStatusData {
    name?: string;
    color?: string;
    tipo?: StatusTipo;
    ordem?: number;
    isDefault?: boolean;
    isActive?: boolean;
}

export class StatusService {
    static async create(data: CreateStatusData) {
        // Verifica se já existe um status com a mesma ordem no tenant
        const existingStatus = await Status.findOne({
            where: {
                tenantId: data.tenantId,
                ordem: data.ordem,
                isActive: true,
            },
        });

        if (existingStatus) {
            throw new Error(
                `Já existe um status com a ordem ${data.ordem}: ${existingStatus.dataValues.name}`,
            );
        }

        // Se este status for marcado como padrão, remove o padrão de outros
        if (data.isDefault) {
            await Status.update(
                { isDefault: false },
                { where: { tenantId: data.tenantId, isDefault: true } },
            );
        }

        const statusData = {
            name: data.name,
            color: data.color || "#6B7280",
            tipo: data.tipo,
            ordem: data.ordem,
            canUpdate: true,
            isDefault: data.isDefault || false,
            isActive: data.isActive !== false,
            tenantId: data.tenantId,
        };

        const status = await Status.create(statusData);
        return status;
    }

    static async getByTenant(tenantId?: string) {
        const statuses = await Status.findAll({
            where: {
                ...(tenantId ? { tenantId } : {}),
                isActive: true,
            },
            order: [
                ["createdAt", "ASC"],
                ["name", "ASC"],
            ],
        });
        return statuses;
    }

    static async update(id: string, data: UpdateStatusData, tenantId: string) {
        // Verifica se o status pode ser atualizado
        const status = await Status.findOne({
            where: { id, tenantId },
        });

        if (!status) {
            return null;
        }

        if (!status.dataValues.canUpdate) {
            throw new Error(
                `O status "${status.dataValues.name}" é fixo e não pode ser alterado`,
            );
        }

        // Se a ordem está sendo atualizada, verifica se já existe outro status com essa ordem
        if (data.ordem !== undefined) {
            const existingStatus = await Status.findOne({
                where: {
                    tenantId,
                    ordem: data.ordem,
                    isActive: true,
                    id: { [Op.ne]: id },
                },
            });

            if (existingStatus) {
                throw new Error(
                    `Já existe um status com a ordem ${data.ordem}: ${existingStatus.dataValues.name}`,
                );
            }
        }

        // Se este status for marcado como padrão, remove o padrão de outros
        if (data.isDefault) {
            await Status.update(
                { isDefault: false },
                { where: { tenantId, isDefault: true, id: { [Op.ne]: id } } },
            );
        }

        const [updatedRows] = await Status.update(data, {
            where: { id, tenantId },
        });

        if (updatedRows === 0) {
            return null;
        }

        return await Status.findOne({ where: { id, tenantId } });
    }

    static async delete(id: string, tenantId: string) {
        // Verifica se o status pode ser deletado
        const status = await Status.findOne({
            where: { id, tenantId },
        });

        if (!status) {
            return false;
        }

        if (!status.dataValues.canUpdate) {
            throw new Error(
                `O status "${status.dataValues.name}" é fixo e não pode ser excluído`,
            );
        }

        // Verifica se existem leads usando este status
        const { Lead } = require("../models");
        const leadsCount = await Lead.count({
            where: { statusId: id, tenantId },
        });

        if (leadsCount > 0) {
            // Em vez de deletar, marca como inativo
            const [updatedRows] = await Status.update(
                { isActive: false },
                { where: { id, tenantId } },
            );
            return updatedRows > 0;
        }

        const deletedRows = await Status.destroy({
            where: { id, tenantId },
        });

        return deletedRows > 0;
    }

    static async getDefault(tenantId: string) {
        return await Status.findOne({
            where: {
                tenantId,
                isDefault: true,
                isActive: true,
            },
        });
    }

    static async validateStatusExists(statusId: string, tenantId: string) {
        const status = await Status.findOne({
            where: {
                id: statusId,
                tenantId,
                isActive: true,
            },
        });
        return !!status;
    }
}
