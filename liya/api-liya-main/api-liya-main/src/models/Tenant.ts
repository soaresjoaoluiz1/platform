import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

interface TenantAttributes {
    id: string;
    name: string;
    isActive: boolean;
    primeiraMensagem?: string;
    createdAt: Date;
    updatedAt: Date;
}

interface TenantCreationAttributes extends Optional<
    TenantAttributes,
    "id" | "createdAt" | "updatedAt"
> {}

class Tenant
    extends Model<TenantAttributes, TenantCreationAttributes>
    implements TenantAttributes
{
    public id!: string;
    public name!: string;
    public isActive!: boolean;
    public primeiraMensagem?: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Tenant.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
            },
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        primeiraMensagem: {
            type: DataTypes.TEXT,
            allowNull: true,
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
        modelName: "Tenant",
        tableName: "tenants",
    },
);

export default Tenant;
