import {
    Model,
    DataTypes,
    Optional,
    BelongsToGetAssociationMixin,
} from "sequelize";
import sequelize from "../config/database";
import CadenciaAtendimento from "./CadenciaAtendimento";

export enum TipoAcao {
    MENSAGEM = "mensagem",
    LIGACAO = "ligacao",
    EMAIL = "email",
    REUNIAO = "reuniao",
    WHATSAPP = "whatsapp",
    VISITA = "visita",
}

interface TentativaAtendimentoAttributes {
    id: string;
    cadenciaAtendimentoId: string;
    ordem: number;
    tipoAcao: TipoAcao;
    descricao: string;
    instrucoes?: string;
    createdAt: Date;
    updatedAt: Date;
}

interface TentativaAtendimentoCreationAttributes extends Optional<
    TentativaAtendimentoAttributes,
    "id" | "createdAt" | "updatedAt"
> {}

class TentativaAtendimento
    extends Model<
        TentativaAtendimentoAttributes,
        TentativaAtendimentoCreationAttributes
    >
    implements TentativaAtendimentoAttributes
{
    public id!: string;
    public cadenciaAtendimentoId!: string;
    public ordem!: number;
    public tipoAcao!: TipoAcao;
    public descricao!: string;
    public instrucoes?: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getCadenciaAtendimento!: BelongsToGetAssociationMixin<CadenciaAtendimento>;
}

TentativaAtendimento.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        cadenciaAtendimentoId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "cadencias_atendimento",
                key: "id",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
        ordem: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
            },
        },
        tipoAcao: {
            type: DataTypes.ENUM(...Object.values(TipoAcao)),
            allowNull: false,
        },
        descricao: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [2, 255],
            },
        },
        instrucoes: {
            type: DataTypes.TEXT,
            allowNull: true,
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
        modelName: "TentativaAtendimento",
        tableName: "tentativas_atendimento",
        timestamps: true,
        indexes: [
            {
                fields: ["cadenciaAtendimentoId"],
            },
            {
                fields: ["cadenciaAtendimentoId", "ordem"],
                unique: true,
            },
        ],
    },
);

export default TentativaAtendimento;
