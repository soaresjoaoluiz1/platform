import { Model, DataTypes, Optional } from "sequelize";
import bcrypt from "bcryptjs";
import sequelize from "../config/database";
import { UserRole } from "../types";

interface UserAttributes {
    id: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    whatsapp: string;
    segmento: string;
    instance?: string | null;
    tenantId?: string;
    isActive: boolean;
    participateInRoleta: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface UserCreationAttributes extends Optional<
    UserAttributes,
    "id" | "createdAt" | "updatedAt"
> {}

class User
    extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes
{
    declare id: string;
    declare name: string;
    declare email: string;
    declare password: string;
    declare role: UserRole;
    declare whatsapp: string;
    declare segmento: string;
    declare tenantId?: string;
    declare instance?: string | null;
    declare isActive: boolean;
    declare participateInRoleta: boolean;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

    public async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.dataValues.password);
    }

    public async hashPassword(): Promise<void> {
        this.password = await bcrypt.hash(this.dataValues.password, 12);
    }
}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [2, 100],
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [6, 100],
            },
        },
        role: {
            type: DataTypes.ENUM(...Object.values(UserRole)),
            allowNull: false,
            defaultValue: UserRole.CORRETOR,
        },
        whatsapp: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        segmento: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        instance: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        tenantId: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        participateInRoleta: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
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
        modelName: "User",
        tableName: "users",
        hooks: {
            beforeCreate: async (user: User) => {
                await user.hashPassword();
            },
            beforeUpdate: async (user: User) => {
                if (user.changed("password")) {
                    await user.hashPassword();
                }
            },
        },
    },
);

export default User;
