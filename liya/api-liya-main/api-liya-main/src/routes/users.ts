import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticate, authorize } from '../middlewares/auth';
import { validateParams, validateRequest } from '../middlewares/validation';
import { createUserSchema, getCorretoresSchema, updateUserSchema } from '../validation/schemas';
import { UserRole } from '../types';

const router = Router();
const userController = new UserController();

// Aplicar autenticação a todas as rotas
router.use(authenticate);

// Rotas para corretores
router.get('/corretores',authorize([UserRole.ADMIN, UserRole.IMOBILIARIA]), validateParams(getCorretoresSchema), userController.getCorretores.bind(userController));

// Rotas que requerem permissão de ADMIN ou IMOBILIARIA
router.get('/', authorize([UserRole.ADMIN, UserRole.IMOBILIARIA]), userController.getUsers.bind(userController));
router.get('/:id', authorize([UserRole.ADMIN, UserRole.IMOBILIARIA]), userController.getUser.bind(userController));
router.post('/', authorize([UserRole.ADMIN, UserRole.IMOBILIARIA]), validateRequest(createUserSchema), userController.createUser.bind(userController));
router.put('/:id', authorize([UserRole.ADMIN, UserRole.IMOBILIARIA]), validateRequest(updateUserSchema), userController.updateUser.bind(userController));
router.delete('/:id', authorize([UserRole.ADMIN, UserRole.IMOBILIARIA]), userController.deleteUser.bind(userController));
router.patch('/:id/toggle-status', authorize([UserRole.ADMIN, UserRole.IMOBILIARIA]), userController.toggleStatus.bind(userController));
router.patch('/:id/toggle-roleta', authorize([UserRole.ADMIN, UserRole.IMOBILIARIA]), userController.toggleRoleta.bind(userController));

export default router;