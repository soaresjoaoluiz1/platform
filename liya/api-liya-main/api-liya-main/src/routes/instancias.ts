import { Router } from 'express';
import InstanciaController from '../controllers/InstanciaController';
import { authenticate } from '../middlewares/auth';

const router = Router();

/**
 * @route   POST /api/instancias/conectar
 * @desc    Conecta ou cria uma instância do WhatsApp para o usuário autenticado
 * @access  Private (requer autenticação)
 */
router.post('/conectar', authenticate, InstanciaController.conectar);

/**
 * @route   GET /api/instancias/minhas
 * @desc    Obtém informações da instância do usuário autenticado
 * @access  Private (requer autenticação)
 */
router.get('/minhas', authenticate, InstanciaController.obterMinhaInstancia);

/**
 * @route   GET /api/instancias/status
 * @desc    Verifica o status de conexão da instância em tempo real
 * @access  Private (requer autenticação)
 */
router.get('/status', authenticate, InstanciaController.verificarStatus);

/**
 * @route   POST /api/instancias/desconectar
 * @desc    Desconecta e faz logout da instância do usuário
 * @access  Private (requer autenticação)
 */
router.post('/desconectar', authenticate, InstanciaController.desconectar);

/**
 * @route   POST /api/instancias/qrcode
 * @desc    Atualiza o QR Code quando ele expira
 * @access  Private (requer autenticação)
 */
router.post('/qrcode', authenticate, InstanciaController.atualizarQRCode);

export default router;
