import { Router } from 'express';
import { MensagemLancamentoController } from '../controllers/MensagemLancamentoController';
import { authenticate } from '../middlewares/auth';

const router = Router();

// Aplicar autenticação em todas as rotas
router.use(authenticate);

// Rotas individuais para mensagens de lançamento
router.get('/:id', MensagemLancamentoController.getById);
router.put('/:id', MensagemLancamentoController.update);
router.delete('/:id', MensagemLancamentoController.delete);

export default router;
