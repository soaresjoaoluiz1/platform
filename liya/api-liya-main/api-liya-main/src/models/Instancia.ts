import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

export enum InstanciaStatus {
  CONECTADA = 'conectada',
  DESCONECTADA = 'desconectada',
  CONECTANDO = 'conectando',
  ERRO = 'erro'
}

interface InstanciaAttributes {
  id: string;
  userId: string;
  instanceName: string;
  status: InstanciaStatus;
  qrCode?: string;
  lastConnection?: Date;
  apiKey: string;
  baseUrl: string;
  integration: string;
  createdAt: Date;
  updatedAt: Date;
}

interface InstanciaCreationAttributes extends Optional<InstanciaAttributes, 'id' | 'createdAt' | 'updatedAt' | 'qrCode' | 'lastConnection'> {}

class Instancia extends Model<InstanciaAttributes, InstanciaCreationAttributes> implements InstanciaAttributes {
  declare id: string;
  declare userId: string;
  declare instanceName: string;
  declare status: InstanciaStatus;
  declare qrCode?: string;
  declare lastConnection?: Date;
  declare apiKey: string;
  declare baseUrl: string;
  declare integration: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Instancia.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    instanceName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    status: {
      type: DataTypes.ENUM(...Object.values(InstanciaStatus)),
      allowNull: false,
      defaultValue: InstanciaStatus.DESCONECTADA,
    },
    qrCode: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    lastConnection: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    apiKey: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    baseUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    integration: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'WHATSAPP-BAILEYS',
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
    modelName: 'Instancia',
    tableName: 'instancias',
    indexes: [
      {
        unique: true,
        fields: ['userId'],
      },
    ],
  }
);

export default Instancia;
