import { Router } from "express";
import { LeadController } from "../controllers/LeadController";
import { authenticate, authorize } from "../middlewares/auth";
import { validateRequest } from "../middlewares/validation";
import { createLeadSchema, updateLeadSchema } from "../validation/schemas";
import { UserRole } from "../types";
import { z } from "zod";

const router = Router();
const leadController = new LeadController();

// Aplicar autenticação a todas as rotas
router.use(authenticate);

const assignLeadSchema = z.object({
    corretorId: z.string().uuid("ID do corretor deve ser um UUID válido"),
});

const assignCadenciaSchema = z.object({
    cadenciaId: z.string().uuid("ID da cadência deve ser um UUID válido"),
});

const alterarTentativaSchema = z.object({
    tentativaId: z.string().uuid("ID da tentativa deve ser um UUID válido"),
});

router.get("/", leadController.getLeads.bind(leadController));
router.get("/:id", leadController.getLead.bind(leadController));
router.post(
    "/",
    validateRequest(createLeadSchema),
    leadController.createLead.bind(leadController),
);
router.put(
    "/:id",
    validateRequest(updateLeadSchema),
    leadController.updateLead.bind(leadController),
);
router.delete(
    "/:id",
    authorize([UserRole.ADMIN, UserRole.IMOBILIARIA]),
    leadController.deleteLead.bind(leadController),
);
router.patch(
    "/:id/assign",
    authorize([UserRole.ADMIN, UserRole.IMOBILIARIA]),
    validateRequest(assignLeadSchema),
    leadController.assignLead.bind(leadController),
);
router.patch(
    "/:id/ultimo-contato",
    leadController.updateUltimoContato.bind(leadController),
);
router.get("/export/excel", leadController.exportToExcel.bind(leadController));
router.patch(
    "/:id/cadencia",
    validateRequest(assignCadenciaSchema),
    leadController.assignCadencia.bind(leadController),
);
router.patch(
    "/:id/tentativa",
    validateRequest(alterarTentativaSchema),
    leadController.alterarTentativa.bind(leadController),
);
router.get(
    "/:id/detalhes",
    leadController.getLeadComDetalhes.bind(leadController),
);

export default router;
