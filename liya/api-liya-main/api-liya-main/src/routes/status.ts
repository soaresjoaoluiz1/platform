import { Router } from 'express';
import { StatusController } from '../controllers/StatusController';
import { authenticate } from '../middlewares/auth';

const router = Router();

// Aplicar autenticação em todas as rotas
router.use(authenticate);

// Rotas para status
router.get('/', StatusController.getByTenant);
router.post('/', StatusController.create);
router.put('/:id', StatusController.update);
router.delete('/:id', StatusController.delete);

export default router;
