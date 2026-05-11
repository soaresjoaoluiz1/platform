import { Model, DataTypes, Optional, BelongsToGetAssociationMixin } from 'sequelize';
import sequelize from '../config/database';
import { DisparoFilter, DisparoTipo } from '../types';
import User from './User';

interface DisparoAttributes {
  id: string;
  message: string;
  imageKey?: string;
  videoKey?: string;
  scheduledAt?: Date;
  instance: string;
  createdBy: string;
  tenantId?: string;
  filter: DisparoFilter;
  status: 'agendado' | 'inativo';
  allLeads: boolean;
  tipo: DisparoTipo;
  followUpDays?: number;
  followUpStatusId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DisparoCreationAttributes extends Optional<DisparoAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Disparo extends Model<DisparoAttributes, DisparoCreationAttributes> implements DisparoAttributes {
  public id!: string;
  public message!: string;
  public imageKey?: string;
  public videoKey?: string;
  public scheduledAt?: Date;
  public instance!: string;
  public createdBy!: string;
  public tenantId?: string;
  public filter!: DisparoFilter;
  public status!: 'agendado' | 'inativo';
  public allLeads!: boolean;
  public tipo!: DisparoTipo;
  public followUpDays?: number;
  public followUpStatusId?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getUser!: BelongsToGetAssociationMixin<User>;
}

Disparo.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    imageKey: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    videoKey: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    scheduledAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    instance: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    tenantId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    filter: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('agendado', 'inativo'),
      allowNull: false,
      defaultValue: 'agendado',
    },
    allLeads: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    tipo: {
      type: DataTypes.ENUM('agendado', 'follow_up'),
      allowNull: false,
      defaultValue: 'agendado',
    },
    followUpDays: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
      },
    },
    followUpStatusId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'status',
        key: 'id',
      },
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
    modelName: 'Disparo',
    tableName: 'disparos',
  }
);

export default Disparo;