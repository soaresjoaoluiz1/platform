import { Router, Request, Response } from "express";
import { CadenciaAtendimentoController } from "../controllers/CadenciaAtendimentoController";
import { authenticate } from "../middlewares/auth";

const router = Router();

// Middleware de autenticação
router.use(authenticate);

// ===== Cadências =====

// Criar cadência
router.post("/", CadenciaAtendimentoController.create);

// Listar todas as cadências do tenant
router.get("/", CadenciaAtendimentoController.getAll);

// Obter cadência por ID
router.get("/:id", CadenciaAtendimentoController.getById);

// Atualizar cadência
router.put("/:id", CadenciaAtendimentoController.update);

// Deletar cadência
router.delete("/:id", CadenciaAtendimentoController.delete);

// ===== Tentativas de Atendimento =====

// Criar tentativa
router.post(
    "/:cadenciaId/tentativas",
    CadenciaAtendimentoController.createTentativa,
);

// Listar tentativas de uma cadência
router.get(
    "/:cadenciaId/tentativas",
    CadenciaAtendimentoController.getTentativas,
);

// Obter tentativa por ID
router.get(
    "/:cadenciaId/tentativas/:tentativaId",
    CadenciaAtendimentoController.getTentativaById,
);

// Atualizar tentativa
router.put(
    "/:cadenciaId/tentativas/:tentativaId",
    CadenciaAtendimentoController.updateTentativa,
);

// Deletar tentativa
router.delete(
    "/:cadenciaId/tentativas/:tentativaId",
    CadenciaAtendimentoController.deleteTentativa,
);

export default router;
