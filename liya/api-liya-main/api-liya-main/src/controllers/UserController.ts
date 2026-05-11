import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { UserService } from '../services/UserService';
import { UserRole } from '../types';
import logger from '../utils/logger';

export class UserController {
  private userService = new UserService();

  async getUsers(req: AuthenticatedRequest, res: Response) {
    try {
      const { role, page = '1', limit = '10' } = req.query;
      
      const users = await this.userService.getUsers(
        role as UserRole,
        parseInt(page as string),
        parseInt(limit as string)
      );

      res.json(users);
    } catch (error) {
      logger.error('Get users error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getUser(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      
      const user = await this.userService.getUserById(id);
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.json(user);
    } catch (error) {
      logger.error('Get user error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async createUser(req: AuthenticatedRequest, res: Response) {
    try {
      const userData = req.body;

      // Verificar se o email já existe
      const existingUser = await this.userService.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email já está em uso' });
      }

      const user = await this.userService.createUser({...userData, tenantId: req.user?.tenantId || userData.tenantId});
      res.status(201).json(await this.userService.getUserById(user.id));
    } catch (error) {
      logger.error('Create user error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async updateUser(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const userData = req.body;

      // Verificar se é uma atualização de email e se já existe
      if (userData.email) {
        const existingUser = await this.userService.getUserByEmail(userData.email);
        if (existingUser && existingUser.id !== id) {
          return res.status(400).json({ error: 'Email já está em uso' });
        }
      }

      const user = await this.userService.updateUser(id, userData);
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.json(user);
    } catch (error) {
      logger.error('Update user error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async deleteUser(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      const deleted = await this.userService.deleteUser(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.status(204).send();
    } catch (error) {
      logger.error('Delete user error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async toggleStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      const user = await this.userService.toggleUserStatus(id);
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.json(user);
    } catch (error) {
      logger.error('Toggle status error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async toggleRoleta(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      const user = await this.userService.toggleRoleta(id);
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.json(user);
    } catch (error) {
      logger.error('Toggle roleta error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getCorretores(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = req.query.tenantId || req.user?.tenantId;
      const corretores = await this.userService.getCorretores(tenantId as string | undefined);
      res.json(corretores);
    } catch (error) {
      logger.error('Get corretores error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}