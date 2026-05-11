import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface MensagemLancamentoAttributes {
  id: string;
  lancamentoId: string;
  ordem: number;
  pergunta: string;
  resposta: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface MensagemLancamentoCreationAttributes extends Optional<MensagemLancamentoAttributes, 'id' | 'ordem' | 'createdAt' | 'updatedAt'> {}

class MensagemLancamento extends Model<MensagemLancamentoAttributes, MensagemLancamentoCreationAttributes> implements MensagemLancamentoAttributes {
  public id!: string;
  public lancamentoId!: string;
  public ordem!: number;
  public pergunta!: string;
  public resposta!: string;
  public tenantId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MensagemLancamento.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  lancamentoId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'lancamentos',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
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
    allowNull: false,
    validate: {
      notEmpty: true,
    },
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
  modelName: 'MensagemLancamento',
  tableName: 'mensagens_lancamento',
  timestamps: true,
  indexes: [
    {
      fields: ['lancamentoId', 'ordem'],
    },
    {
      fields: ['tenantId'],
    },
  ],
});

export default MensagemLancamento;
