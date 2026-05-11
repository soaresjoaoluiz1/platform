import {
    Model,
    DataTypes,
    Optional,
    BelongsToGetAssociationMixin,
} from "sequelize";
import sequelize from "../config/database";
import { LeadSource } from "../types";
import User from "./User";

interface LeadAttributes {
    id: string;
    name: string;
    email?: string;
    phone: string;
    source: LeadSource;
    assignedTo: string;
    tenantId?: string;
    instance?: string;
    obs?: string;
    statusId?: string;
    interesse?: string;
    ultimoContato?: Date;
    valorPotencial?: number;
    publico?: string;
    followup?: string;
    ia_pronto1?: string;
    ia_pronto2?: string;
    ia_pronto3?: string;
    ia_tempo?: number;
    ia_bool1?: boolean;
    ia_bool2?: boolean;
    cadenciaAtendimentoId?: string;
    tentativaAtendimentoId?: string;
    createdAt: Date;
    updatedAt: Date;
}

interface LeadCreationAttributes extends Optional<
    LeadAttributes,
    "id" | "createdAt" | "updatedAt"
> {}

class Lead
    extends Model<LeadAttributes, LeadCreationAttributes>
    implements LeadAttributes
{
    public id!: string;
    public name!: string;
    public email?: string;
    public phone!: string;
    public source!: LeadSource;
    public assignedTo!: string;
    public obs?: string;
    public tenantId?: string;
    public instance?: string;
    public statusId?: string;
    public interesse?: string;
    public ultimoContato?: Date;
    public valorPotencial?: number;
    public publico?: string;
    public followup?: string;
    public ia_pronto1?: string;
    public ia_pronto2?: string;
    public ia_pronto3?: string;
    public ia_tempo?: number;
    public ia_bool1?: boolean;
    public ia_bool2?: boolean;
    public cadenciaAtendimentoId?: string;
    public tentativaAtendimentoId?: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getUser!: BelongsToGetAssociationMixin<User>;
}

Lead.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [2, 100],
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isEmail: true,
            },
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        source: {
            type: DataTypes.ENUM(...Object.values(LeadSource)),
            allowNull: false,
        },
        assignedTo: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: User,
                key: "id",
            },
        },
        tenantId: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        obs: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        instance: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                notEmpty: false,
            },
        },
        statusId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: "status",
                key: "id",
            },
        },
        interesse: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        ultimoContato: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        publico: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        followup: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        ia_pronto1: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        ia_pronto2: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        ia_pronto3: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        ia_tempo: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        ia_bool1: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        ia_bool2: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        valorPotencial: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        cadenciaAtendimentoId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: "cadencias_atendimento",
                key: "id",
            },
            onDelete: "SET NULL",
            onUpdate: "CASCADE",
        },
        tentativaAtendimentoId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: "tentativas_atendimento",
                key: "id",
            },
            onDelete: "SET NULL",
            onUpdate: "CASCADE",
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        modelName: "Lead",
        tableName: "leads",
    },
);

export default Lead;
