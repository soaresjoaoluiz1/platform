import { Router } from 'express';
import { LancamentoController } from '../controllers/LancamentoController';
import { MensagemLancamentoController } from '../controllers/MensagemLancamentoController';
import { authenticate } from '../middlewares/auth';

const router = Router();

// Aplicar autenticação em todas as rotas
router.use(authenticate);

// Rotas para lançamentos
router.get('/', LancamentoController.getAll);
router.get('/:id', LancamentoController.getById);
router.post('/', LancamentoController.create);
router.put('/:id', LancamentoController.update);
router.delete('/:id', LancamentoController.delete);

// Rotas para mensagens de lançamento (nested routes)
router.get('/:lancamentoId/mensagens', MensagemLancamentoController.getAllByLancamento);
router.post('/:lancamentoId/mensagens', MensagemLancamentoController.create);

export default router;
