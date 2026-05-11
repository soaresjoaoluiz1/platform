import { Router } from 'express';
import { MensagemProntaController } from '../controllers/MensagemProntaController';
import { authenticate } from '../middlewares/auth';
import { uploadDisparoFiles } from '../middlewares/upload';

const router = Router();

// Aplicar autenticação em todas as rotas
router.use(authenticate);

// Rotas para mensagens prontas
router.get('/', MensagemProntaController.getByTenant);
router.get('/:id', MensagemProntaController.getById);
router.get('/status/:statusId', MensagemProntaController.getByStatus);
router.post('/', uploadDisparoFiles, MensagemProntaController.create);
router.put('/:id', uploadDisparoFiles, MensagemProntaController.update);
router.patch('/:id/toggle-active', MensagemProntaController.toggleActive);
router.delete('/:id', MensagemProntaController.delete);

export default router;
