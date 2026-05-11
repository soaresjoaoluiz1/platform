import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";
import Tenant from "./Tenant";

export interface RoletaAttributes {
    id: string;
    sequencia: number;
    tipo: string;
    tenantId: string;
    createdAt: Date;
    updatedAt: Date;
}

interface RoletaCreationAttributes extends Optional<
    RoletaAttributes,
    "id" | "createdAt" | "updatedAt"
> {}

class Roleta
    extends Model<RoletaAttributes, RoletaCreationAttributes>
    implements RoletaAttributes
{
    declare id: string;
    declare sequencia: number;
    declare tipo: string;
    declare tenantId: string;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

Roleta.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        sequencia: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            validate: {
                min: {
                    args: [1],
                    msg: "A sequência deve ser no mínimo 1",
                },
            },
        },
        tipo: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "O tipo não pode ser vazio",
                },
            },
        },
        tenantId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Tenant,
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
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
        tableName: "roletas",
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ["tenantId", "tipo"],
                name: "unique_tenant_tipo",
            },
            {
                fields: ["tenantId"],
                name: "idx_roletas_tenant",
            },
            {
                fields: ["tipo"],
                name: "idx_roletas_tipo",
            },
        ],
    },
);

export default Roleta;
