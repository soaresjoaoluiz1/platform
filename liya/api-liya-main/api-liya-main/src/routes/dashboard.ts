import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { authenticate } from '../middlewares/auth';

const router = Router();
const dashboardController = new DashboardController();

// Aplicar autenticação a todas as rotas
router.use(authenticate);

router.get('/stats', dashboardController.getStats.bind(dashboardController));

export default router;