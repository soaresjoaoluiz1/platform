import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { DisparoService } from '../services/DisparoService';
import logger from '../utils/logger';

export class DisparoController {
  private readonly disparoService = new DisparoService();

  async getDisparos(req: AuthenticatedRequest, res: Response) {
    try {
      const { page = '1', limit = '10', tenantId, statusId } = req.query as any;
      const effectiveTenantId = tenantId && req.user?.role === 'ADMIN' ? tenantId : req.user?.tenantId;

      // Construir filtros a partir dos query params
      const filters: { statusId?: string[], source?: string[], interesse?: string[] } = {};
      if (statusId) {
        filters.statusId = Array.isArray(statusId) ? statusId : [statusId];
      }

      const disparos = await this.disparoService.getDisparos(
        req.user!.id,
        req.user!.role,
        parseInt(page as string),
        parseInt(limit as string),
        effectiveTenantId,
        Object.keys(filters).length > 0 ? filters : undefined
      );

      res.json(disparos);
    } catch (error) {
      logger.error('Get disparos error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getDisparo(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      
  const disparo = await this.disparoService.getDisparoById(id, req.user!.id, req.user!.role, req.user?.tenantId);
      if (!disparo) {
        return res.status(404).json({ error: 'Disparo não encontrado' });
      }

      res.json(disparo);
    } catch (error) {
      logger.error('Get disparo error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async createDisparo(req: AuthenticatedRequest, res: Response) {
    try {
      const disparoData = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

      const disparo = await this.disparoService.createDisparo(
        disparoData, 
        req.user!.id, 
        req.user!.role,
        req.user?.tenantId,
        files
      );
      
      const createdDisparo = await this.disparoService.getDisparoById(
        disparo.dataValues.id, 
        req.user!.id, 
        req.user!.role,
        req.user?.tenantId
      );
      
      res.status(201).json(createdDisparo);
    } catch (error) {
      logger.error('Create disparo error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async updateDisparo(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const disparoData = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

      const disparo = await this.disparoService.updateDisparo(
        id, 
        disparoData, 
        req.user!.id, 
        req.user!.role,
        req.user?.tenantId,
        files
      );
      
      if (!disparo) {
        return res.status(404).json({ error: 'Disparo não encontrado' });
      }

      res.json(disparo);
    } catch (error) {
      logger.error('Update disparo error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async deleteDisparo(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      const deleted = await this.disparoService.deleteDisparo(id, req.user!.id, req.user!.role, req.user?.tenantId);
      if (!deleted) {
        return res.status(404).json({ error: 'Disparo não encontrado' });
      }

      res.status(204).send();
    } catch (error) {
      logger.error('Delete disparo error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async processDisparo(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      const result = await this.disparoService.processDisparo(id);
      if (!result) {
        return res.status(404).json({ error: 'Disparo não encontrado' });
      }

      res.json(result);
    } catch (error) {
      logger.error('Process disparo error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}