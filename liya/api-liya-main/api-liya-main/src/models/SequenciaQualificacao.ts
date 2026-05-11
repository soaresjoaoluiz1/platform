import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface SequenciaQualificacaoAttributes {
  id: string;
  ordem: number;
  pergunta: string;
  resposta: string | null;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SequenciaQualificacaoCreationAttributes extends Optional<SequenciaQualificacaoAttributes, 'id' | 'ordem' | 'resposta' | 'createdAt' | 'updatedAt'> {}

class SequenciaQualificacao extends Model<SequenciaQualificacaoAttributes, SequenciaQualificacaoCreationAttributes> implements SequenciaQualificacaoAttributes {
  public id!: string;
  public ordem!: number;
  public pergunta!: string;
  public resposta!: string | null;
  public tenantId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SequenciaQualificacao.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  ordem: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  pergunta: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  resposta: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tenantId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'tenants',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'SequenciaQualificacao',
  tableName: 'sequencias_qualificacao',
  timestamps: true,
  indexes: [
    {
      fields: ['tenantId', 'ordem'],
    },
    {
      fields: ['tenantId'],
    },
  ],
});

export default SequenciaQualificacao;
