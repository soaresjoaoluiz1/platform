import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface LancamentoAttributes {
  id: string;
  titulo: string;
  identificacaoAnuncio: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface LancamentoCreationAttributes extends Optional<LancamentoAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Lancamento extends Model<LancamentoAttributes, LancamentoCreationAttributes> implements LancamentoAttributes {
  public id!: string;
  public titulo!: string;
  public identificacaoAnuncio!: string;
  public tenantId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Lancamento.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255],
    },
  },
  identificacaoAnuncio: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255],
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
  modelName: 'Lancamento',
  tableName: 'lancamentos',
  timestamps: true,
  indexes: [
    {
      fields: ['tenantId'],
    },
  ],
});

export default Lancamento;
