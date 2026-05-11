import { User } from '../models';
import { UserRole } from '../types';

export class UserService {
  async createUser(userData: any) {
    return await User.create(userData);
  }

  async getUserById(id: string) {
    return await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
  }

  async getUserByEmail(email: string) {
    return await User.findOne({ where: { email } });
  }

  async updateUser(id: string, userData: any) {
    const [affectedRows] = await User.update(userData, {
      where: { id },
      returning: true,
    });
    
    if (affectedRows === 0) {
      return null;
    }

    return await this.getUserById(id);
  }

  async deleteUser(id: string) {
    return await User.destroy({ where: { id } });
  }

  async getUsers(role?: UserRole, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const where = role ? { role } : {};

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });

    return {
      users: rows,
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: page,
    };
  }

  async getCorretoresAtivos(tenantId?: string) {
    return await User.findAll({
      where: {
        role: UserRole.CORRETOR,
        isActive: true,
        ...(tenantId ? { tenantId } : {}),
      },
      attributes: { exclude: ['password'] },
    });
  }

  async getCorretores(tenantId?: string) {
    return await User.findAll({
      where: {
        role: UserRole.CORRETOR,
        ...(tenantId ? { tenantId } : {}),
      },
      attributes: { exclude: ['password'] },
    });
  }

  async toggleUserStatus(id: string) {
    const user = await User.findByPk(id);
    if (!user) return null;

    user.set('isActive', !user.get('isActive'));
    await user.save();

    return await this.getUserById(id);
  }

  async toggleRoleta(id: string) {
    const user = await User.findByPk(id);
    if (!user) return null;

    user.set('participateInRoleta', !user.get('participateInRoleta'));
    await user.save();

    return await this.getUserById(id);
  }
}