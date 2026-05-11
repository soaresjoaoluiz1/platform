import { Router } from 'express';
import { SequenciaQualificacaoController } from '../controllers/SequenciaQualificacaoController';
import { authenticate } from '../middlewares/auth';

const router = Router();

// Aplicar autenticação em todas as rotas
router.use(authenticate);

// Rotas para sequências de qualificação
router.get('/', SequenciaQualificacaoController.getAll);
router.get('/:id', SequenciaQualificacaoController.getById);
router.post('/', SequenciaQualificacaoController.create);
router.put('/:id', SequenciaQualificacaoController.update);
router.delete('/:id', SequenciaQualificacaoController.delete);

export default router;
