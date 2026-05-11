import {
    Model,
    DataTypes,
    Optional,
    HasManyGetAssociationsMixin,
} from "sequelize";
import sequelize from "../config/database";
import TentativaAtendimento from "./TentativaAtendimento";

interface CadenciaAtendimentoAttributes {
    id: string;
    nome: string;
    descricao?: string;
    tenantId: string;
    ativo: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface CadenciaAtendimentoCreationAttributes extends Optional<
    CadenciaAtendimentoAttributes,
    "id" | "ativo" | "createdAt" | "updatedAt"
> {}

class CadenciaAtendimento
    extends Model<
        CadenciaAtendimentoAttributes,
        CadenciaAtendimentoCreationAttributes
    >
    implements CadenciaAtendimentoAttributes
{
    public id!: string;
    public nome!: string;
    public descricao?: string;
    public tenantId!: string;
    public ativo!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getTentativas!: HasManyGetAssociationsMixin<TentativaAtendimento>;
}

CadenciaAtendimento.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        nome: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [2, 255],
            },
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: true,
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
        ativo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
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
        modelName: "CadenciaAtendimento",
        tableName: "cadencias_atendimento",
        timestamps: true,
        indexes: [
            {
                fields: ["tenantId"],
            },
            {
                fields: ["tenantId", "ativo"],
            },
        ],
    },
);

export default CadenciaAtendimento;
