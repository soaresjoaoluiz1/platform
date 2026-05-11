import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";
import { StatusTipo } from "../types";

interface StatusAttributes {
    id: string;
    name: string;
    color: string;
    tipo: StatusTipo;
    ordem: number;
    isDefault: boolean;
    isActive: boolean;
    canUpdate: boolean;
    tenantId: string;
    createdAt: Date;
    updatedAt: Date;
}

interface StatusCreationAttributes extends Optional<
    StatusAttributes,
    "id" | "createdAt" | "updatedAt"
> {}

class Status
    extends Model<StatusAttributes, StatusCreationAttributes>
    implements StatusAttributes
{
    public id!: string;
    public name!: string;
    public color!: string;
    public tipo!: StatusTipo;
    public ordem!: number;
    public isDefault!: boolean;
    public isActive!: boolean;
    public canUpdate!: boolean;
    public tenantId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Status.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        color: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "#6B7280",
        },
        tipo: {
            type: DataTypes.ENUM(...Object.values(StatusTipo)),
            allowNull: false,
            defaultValue: StatusTipo.NOVO,
        },
        ordem: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        isDefault: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        canUpdate: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
        tenantId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "tenants",
                key: "id",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Status",
        tableName: "status",
        timestamps: true,
        indexes: [
            {
                fields: ["tenantId"],
            },
            {
                fields: ["tenantId", "name"],
                unique: true,
            },
            {
                fields: ["tenantId", "ordem"],
                unique: false,
            },
        ],
    },
);

export default Status;
