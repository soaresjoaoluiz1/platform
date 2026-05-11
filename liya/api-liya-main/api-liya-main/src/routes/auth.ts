import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validateRequest } from '../middlewares/validation';
import { loginSchema, createUserSchema } from '../validation/schemas';

const router = Router();
const authController = new AuthController();

router.post('/login', validateRequest(loginSchema), authController.login.bind(authController));
router.post('/register', validateRequest(createUserSchema), authController.register.bind(authController));

export default router;