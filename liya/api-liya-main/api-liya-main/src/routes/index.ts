import { Router } from "express";
import authRoutes from "./auth";
import userRoutes from "./users";
import leadRoutes from "./leads";
import disparoRoutes from "./disparos";
import dashboardRoutes from "./dashboard";
import tenantRoutes from "./tenants";
import statusRoutes from "./status";
import mensagensProntasRoutes from "./mensagens-prontas";
import instanciasRoutes from "./instancias";
import sequenciasQualificacaoRoutes from "./sequencias-qualificacao";
import lancamentosRoutes from "./lancamentos";
import mensagensLancamentoRoutes from "./mensagens-lancamento";
import roletasRoutes from "./roletas";
import cadenciasAtendimentoRoutes from "./cadencias-atendimento";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/leads", leadRoutes);
router.use("/disparos", disparoRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/tenants", tenantRoutes);
router.use("/status", statusRoutes);
router.use("/mensagens-prontas", mensagensProntasRoutes);
router.use("/instancias", instanciasRoutes);
router.use("/sequencias-qualificacao", sequenciasQualificacaoRoutes);
router.use("/lancamentos", lancamentosRoutes);
router.use("/mensagens-lancamento", mensagensLancamentoRoutes);
router.use("/roletas", roletasRoutes);
router.use("/cadencias-atendimento", cadenciasAtendimentoRoutes);

// Health check
router.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default router;
