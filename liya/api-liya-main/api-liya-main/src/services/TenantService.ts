import { Op, Transaction } from "sequelize";
import sequelize from "../config/database";
import { Tenant, Status, Roleta, User } from "../models";
import { StatusTipo, UserRole } from "../types";

interface TenantUpdateData {
    name?: string;
    isActive?: boolean;
    primeiraMensagem?: string;
}

interface TenantAdminUpdateData {
    name?: string;
    email?: string;
    password?: string;
    whatsapp?: string;
    segmento?: string;
    instance?: string | null;
    isActive?: boolean;
    participateInRoleta?: boolean;
}

interface UpdateTenantWithAdminData {
    tenant?: TenantUpdateData;
    admin?: TenantAdminUpdateData;
}

export class TenantService {
    async listTenants(q?: string) {
        const where: any = {};
        if (q) {
            where.name = { [Op.iLike]: `%${q}%` };
        }

        const { count, rows } = await Tenant.findAndCountAll({
            where,
            include: [this.getTenantAdminInclude()],
            distinct: true,
            order: [["createdAt", "DESC"]],
        });

        return {
            tenants: rows.map((tenant) =>
                this.serializeTenantWithAdmin(tenant),
            ),
            total: count,
        };
    }

    async createTenant(name: string) {
        const [tenant, created] = await Tenant.findOrCreate({
            where: { name },
            defaults: { name, isActive: true },
        });

        // Se o tenant foi criado, criar os status padrões e a roleta inicial
        if (created) {
            await this.createDefaultStatuses(tenant.dataValues.id);
            await this.createDefaultRoleta(tenant.dataValues.id);
        }

        return tenant;
    }

    private async createDefaultStatuses(tenantId: string) {
        // Status "Novo" - sempre o primeiro (ordem 1)
        await Status.create({
            name: "Novo",
            color: "#3B82F6", // Azul
            tipo: StatusTipo.NOVO,
            ordem: 1,
            isDefault: true,
            isActive: true,
            canUpdate: false,
            tenantId,
        });

        // Status "Desqualificado" - sempre o último (ordem 9999)
        await Status.create({
            name: "Desqualificado",
            color: "#EF4444", // Vermelho
            tipo: StatusTipo.PERDIDO,
            ordem: 9999,
            isDefault: false,
            isActive: true,
            canUpdate: false,
            tenantId,
        });
    }

    private async createDefaultRoleta(tenantId: string) {
        // Criar roleta padrão do tipo VENDA com sequência inicial 1
        await Roleta.create({
            tipo: "VENDA",
            sequencia: 1,
            tenantId,
        });
    }

    async getTenantById(id: string, transaction?: Transaction) {
        const tenant = await Tenant.findByPk(id, {
            include: [
                this.getTenantAdminInclude(),
                {
                    model: Status,
                    as: "statuses",
                    where: { isActive: true },
                    required: false,
                    order: [
                        ["createdAt", "ASC"],
                        ["name", "ASC"],
                    ],
                },
            ],
            transaction,
        });

        if (!tenant) {
            return null;
        }

        return this.serializeTenantWithAdmin(tenant);
    }

    async updateTenantStatus(id: string, isActive: boolean) {
        const tenant = await Tenant.findByPk(id);

        if (!tenant) {
            throw new Error("Tenant não encontrado");
        }

        await Tenant.update({ isActive }, { where: { id } });

        return tenant;
    }

    async updateTenantConfig(id: string, data: { primeiraMensagem?: string }) {
        const tenant = await Tenant.findByPk(id);

        if (!tenant) {
            throw new Error("Tenant não encontrado");
        }

        await Tenant.update(data, { where: { id } });

        return await this.getTenantById(id);
    }

    async updateTenantWithAdmin(id: string, data: UpdateTenantWithAdminData) {
        return await sequelize.transaction(async (transaction) => {
            const tenant = await Tenant.findByPk(id, { transaction });

            if (!tenant) {
                throw new Error("Tenant não encontrado");
            }

            const admin = await User.findOne({
                where: {
                    tenantId: id,
                    role: UserRole.IMOBILIARIA,
                },
                order: [["createdAt", "ASC"]],
                transaction,
            });

            if (!admin) {
                throw new Error("Administrador do tenant não encontrado");
            }

            if (data.tenant?.name && data.tenant.name !== tenant.get("name")) {
                const existingTenant = await Tenant.findOne({
                    where: {
                        name: data.tenant.name,
                        id: { [Op.ne]: id },
                    },
                    transaction,
                });

                if (existingTenant) {
                    throw new Error("Já existe um tenant com este nome");
                }
            }

            if (data.admin?.email && data.admin.email !== admin.get("email")) {
                const existingAdmin = await User.findOne({
                    where: {
                        email: data.admin.email,
                        id: { [Op.ne]: admin.get("id") },
                    },
                    transaction,
                });

                if (existingAdmin) {
                    throw new Error("Email já está em uso");
                }
            }

            if (data.tenant && Object.keys(data.tenant).length > 0) {
                tenant.set(data.tenant);
                await tenant.save({ transaction });
            }

            if (data.admin && Object.keys(data.admin).length > 0) {
                admin.set(data.admin);
                await admin.save({ transaction });
            }

            return await this.getTenantById(id, transaction);
        });
    }

    async deleteTenant(id: string) {
        const tenant = await Tenant.findByPk(id);
        if (!tenant) {
            throw new Error("Tenant não encontrado");
        }
        await Tenant.destroy({ where: { id } });
        return tenant;
    }

    private getTenantAdminInclude() {
        return {
            model: User,
            as: "users",
            where: { role: UserRole.IMOBILIARIA },
            required: false,
            attributes: [
                "id",
                "name",
                "email",
                "role",
                "whatsapp",
                "segmento",
                "instance",
                "isActive",
                "participateInRoleta",
                "createdAt",
                "updatedAt",
            ],
        };
    }

    private serializeTenantWithAdmin(tenant: Tenant) {
        const plainTenant = tenant.get({ plain: true }) as any;
        const admin = Array.isArray(plainTenant.users)
            ? plainTenant.users[0] || null
            : null;

        delete plainTenant.users;

        return {
            ...plainTenant,
            admin,
        };
    }
}
