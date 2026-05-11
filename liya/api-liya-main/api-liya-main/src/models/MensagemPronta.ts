import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface MensagemProntaAttributes {
  id: string;
  titulo: string;
  conteudo: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
  statusId?: string | null;
  isActive: boolean;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface MensagemProntaCreationAttributes extends Optional<MensagemProntaAttributes, 'id' | 'statusId' | 'isActive' | 'createdAt' | 'updatedAt'> {}

class MensagemPronta extends Model<MensagemProntaAttributes, MensagemProntaCreationAttributes> implements MensagemProntaAttributes {
  public id!: string;
  public titulo!: string;
  public conteudo!: string;
  public imageUrl!: string | null;
  public videoUrl!: string | null;
  public statusId!: string | null;
  public isActive!: boolean;
  public tenantId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MensagemPronta.init({
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
  conteudo: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  statusId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'status',
      key: 'id',
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
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
  modelName: 'MensagemPronta',
  tableName: 'mensagens_prontas',
  timestamps: true,
  indexes: [
    {
      fields: ['tenantId'],
    },
    {
      fields: ['tenantId', 'statusId'],
    },
    {
      fields: ['tenantId', 'titulo'],
    },
  ],
});

export default MensagemPronta;
