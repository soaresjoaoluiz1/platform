import { Router } from 'express';
import { DisparoController } from '../controllers/DisparoController';
import { authenticate } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validation';
import { createDisparoSchema } from '../validation/schemas';
import { uploadDisparoFiles } from '../middlewares/upload';

const router = Router();
const disparoController = new DisparoController();

// Aplicar autenticação a todas as rotas
router.use(authenticate);

router.get('/', disparoController.getDisparos.bind(disparoController));
router.get('/:id', disparoController.getDisparo.bind(disparoController));
router.post('/', uploadDisparoFiles, validateRequest(createDisparoSchema), disparoController.createDisparo.bind(disparoController));
router.put('/:id', uploadDisparoFiles, validateRequest(createDisparoSchema), disparoController.updateDisparo.bind(disparoController));
router.delete('/:id', disparoController.deleteDisparo.bind(disparoController));
router.post('/:id/process', disparoController.processDisparo.bind(disparoController));

export default router;