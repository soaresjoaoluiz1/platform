import User from "./User";
import Lead from "./Lead";
import Disparo from "./Disparo";
import Tenant from "./Tenant";
import Status from "./Status";
import MensagemPronta from "./MensagemPronta";
import Instancia from "./Instancia";
import SequenciaQualificacao from "./SequenciaQualificacao";
import Lancamento from "./Lancamento";
import MensagemLancamento from "./MensagemLancamento";
import Roleta from "./Roleta";
import CadenciaAtendimento from "./CadenciaAtendimento";
import TentativaAtendimento from "./TentativaAtendimento";

// Definir associações
User.hasMany(Lead, { foreignKey: "assignedTo", as: "leads" });
Lead.belongsTo(User, { foreignKey: "assignedTo", as: "user" });

User.hasMany(Disparo, { foreignKey: "createdBy", as: "disparos" });
Disparo.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

// User e Instancia (1:1)
User.hasOne(Instancia, { foreignKey: "userId", as: "instanciaWhatsApp" });
Instancia.belongsTo(User, { foreignKey: "userId", as: "user" });

// Tenant associations
Tenant.hasMany(User, { foreignKey: "tenantId", as: "users" });
User.belongsTo(Tenant, { foreignKey: "tenantId", as: "tenant" });

Tenant.hasMany(Lead, { foreignKey: "tenantId", as: "leads" });
Lead.belongsTo(Tenant, { foreignKey: "tenantId", as: "tenant" });

Tenant.hasMany(Disparo, { foreignKey: "tenantId", as: "disparos" });
Disparo.belongsTo(Tenant, { foreignKey: "tenantId", as: "tenant" });

Tenant.hasMany(Status, { foreignKey: "tenantId", as: "statuses" });
Status.belongsTo(Tenant, { foreignKey: "tenantId", as: "tenant" });

Tenant.hasMany(MensagemPronta, {
    foreignKey: "tenantId",
    as: "mensagensProntas",
});
MensagemPronta.belongsTo(Tenant, { foreignKey: "tenantId", as: "tenant" });

Lead.belongsTo(Status, { foreignKey: "statusId", as: "leadStatus" });
Status.hasMany(Lead, { foreignKey: "statusId", as: "leads" });

Status.hasMany(MensagemPronta, {
    foreignKey: "statusId",
    as: "mensagensProntas",
});
MensagemPronta.belongsTo(Status, { foreignKey: "statusId", as: "status" });

// Tenant e SequenciaQualificacao
Tenant.hasMany(SequenciaQualificacao, {
    foreignKey: "tenantId",
    as: "sequenciasQualificacao",
});
SequenciaQualificacao.belongsTo(Tenant, {
    foreignKey: "tenantId",
    as: "tenant",
});

// Tenant e Lancamento
Tenant.hasMany(Lancamento, { foreignKey: "tenantId", as: "lancamentos" });
Lancamento.belongsTo(Tenant, { foreignKey: "tenantId", as: "tenant" });

// Lancamento e MensagemLancamento (1:N)
Lancamento.hasMany(MensagemLancamento, {
    foreignKey: "lancamentoId",
    as: "mensagens",
});
MensagemLancamento.belongsTo(Lancamento, {
    foreignKey: "lancamentoId",
    as: "lancamento",
});

// Tenant e MensagemLancamento
Tenant.hasMany(MensagemLancamento, {
    foreignKey: "tenantId",
    as: "mensagensLancamento",
});
MensagemLancamento.belongsTo(Tenant, { foreignKey: "tenantId", as: "tenant" });

// Tenant e Roleta
Tenant.hasMany(Roleta, { foreignKey: "tenantId", as: "roletas" });
Roleta.belongsTo(Tenant, { foreignKey: "tenantId", as: "tenant" });

// Tenant e CadenciaAtendimento
Tenant.hasMany(CadenciaAtendimento, {
    foreignKey: "tenantId",
    as: "cadenciasAtendimento",
});
CadenciaAtendimento.belongsTo(Tenant, {
    foreignKey: "tenantId",
    as: "tenant",
});

// CadenciaAtendimento e TentativaAtendimento (1:N)
CadenciaAtendimento.hasMany(TentativaAtendimento, {
    foreignKey: "cadenciaAtendimentoId",
    as: "tentativas",
});
TentativaAtendimento.belongsTo(CadenciaAtendimento, {
    foreignKey: "cadenciaAtendimentoId",
    as: "cadencia",
});

// Lead e CadenciaAtendimento
Lead.belongsTo(CadenciaAtendimento, {
    foreignKey: "cadenciaAtendimentoId",
    as: "cadenciaAtendimento",
});

// Lead e TentativaAtendimento
Lead.belongsTo(TentativaAtendimento, {
    foreignKey: "tentativaAtendimentoId",
    as: "tentativaAtual",
});

export {
    User,
    Lead,
    Disparo,
    Tenant,
    Status,
    MensagemPronta,
    Instancia,
    SequenciaQualificacao,
    Lancamento,
    MensagemLancamento,
    Roleta,
    CadenciaAtendimento,
    TentativaAtendimento,
};
