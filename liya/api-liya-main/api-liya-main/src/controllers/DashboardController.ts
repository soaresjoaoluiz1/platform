import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { DashboardService } from '../services/DashboardService';
import logger from '../utils/logger';

export class DashboardController {
  private readonly dashboardService = new DashboardService();

  async getStats(req: AuthenticatedRequest, res: Response) {
    try {
      const { period = '30d', from, to, tenantId } = req.query as any;
      const effectiveTenantId = tenantId && req.user?.role === 'ADMIN' ? tenantId : req.user?.tenantId;
      
      const stats = await this.dashboardService.getStats(
        req.user!.id,
        req.user!.role,
        period as string,
        from as string,
        to as string,
        effectiveTenantId
      );

      res.json(stats);
    } catch (error) {
      logger.error('Get dashboard stats error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}