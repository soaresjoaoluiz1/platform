import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth";
import { UserRole } from "../types";
import { TenantController } from "../controllers/TenantController";

const router = Router();
const controller = new TenantController();

// Rotas apenas para ADMIN
router.get("/", authenticate, authorize([UserRole.ADMIN]), (req, res) =>
    controller.getTenants(req, res),
);
router.post("/", authenticate, authorize([UserRole.ADMIN]), (req, res) =>
    controller.createTenant(req, res),
);
router.put(
    "/:id/status",
    authenticate,
    authorize([UserRole.ADMIN]),
    (req, res) => controller.updateStatus(req, res),
);
router.delete("/:id", authenticate, authorize([UserRole.ADMIN]), (req, res) =>
    controller.deleteTenant(req, res),
);
router.put(
    "/:id",
    authenticate,
    authorize([UserRole.ADMIN, UserRole.IMOBILIARIA]),
    (req, res) => controller.updateTenantWithAdmin(req, res),
);
// Rotas para usuários autenticados
router.get("/current", authenticate, (req, res) =>
    controller.getCurrent(req, res),
);
router.get("/:id/config", authenticate, (req, res) =>
    controller.getConfig(req, res),
);
router.get("/:id", authenticate, (req, res) => controller.getById(req, res));
router.put("/:id/config", authenticate, (req, res) =>
    controller.updateConfig(req, res),
);

export default router;
