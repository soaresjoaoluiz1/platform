import { Router } from "express";
import { RoletaController } from "../controllers/RoletaController";
import { authenticate, authorize } from "../middlewares/auth";
import { validateRequest } from "../middlewares/validation";
import {
    createRoletaSchema,
    updateRoletaSchema,
    updateSequenciaSchema,
} from "../validation/schemas";
import { UserRole } from "../types";

const router = Router();
const roletaController = new RoletaController();

// Aplicar autenticação a todas as rotas
router.use(authenticate);

// Rotas que requerem permissão de ADMIN ou IMOBILIARIA
router.get(
    "/",
    authorize([UserRole.ADMIN, UserRole.IMOBILIARIA]),
    roletaController.getRoletas.bind(roletaController),
);

router.get(
    "/:id",
    authorize([UserRole.ADMIN, UserRole.IMOBILIARIA]),
    roletaController.getRoletaById.bind(roletaController),
);

router.post(
    "/",
    authorize([UserRole.ADMIN, UserRole.IMOBILIARIA]),
    validateRequest(createRoletaSchema),
    roletaController.createRoleta.bind(roletaController),
);

router.put(
    "/:id",
    authorize([UserRole.ADMIN, UserRole.IMOBILIARIA]),
    validateRequest(updateRoletaSchema),
    roletaController.updateRoleta.bind(roletaController),
);

router.patch(
    "/:id/sequencia",
    authorize([UserRole.ADMIN, UserRole.IMOBILIARIA]),
    validateRequest(updateSequenciaSchema),
    roletaController.updateSequencia.bind(roletaController),
);

router.delete(
    "/:id",
    authorize([UserRole.ADMIN, UserRole.IMOBILIARIA]),
    roletaController.deleteRoleta.bind(roletaController),
);

// Rotas para automação - acessível por qualquer usuário autenticado do tenant
router.get(
    "/:id/proximo-vendedor",
    roletaController.getProximoVendedor.bind(roletaController),
);

router.post(
    "/:id/incrementar",
    roletaController.incrementSequencia.bind(roletaController),
);

export default router;
