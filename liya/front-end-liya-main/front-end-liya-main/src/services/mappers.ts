import type {
    User,
    Lead,
    DisparoMassa,
    DashboardStats,
    StatusTipo,
    CadenciaAtendimento,
    TentativaAtendimento,
} from "../types";

export interface ApiTentativaAtendimento {
    id: string;
    cadenciaAtendimentoId: string;
    ordem: number;
    tipoAcao: TentativaAtendimento["tipoAcao"];
    descricao: string;
    instrucoes?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ApiCadenciaAtendimento {
    id: string;
    nome: string;
    descricao?: string;
    tenantId: string;
    ativo: boolean;
    tentativas?: ApiTentativaAtendimento[];
    createdAt?: string;
    updatedAt?: string;
}

// Tipos esperados da API conforme README
export interface ApiUser {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "IMOBILIARIA" | "CORRETOR";
    whatsapp?: string;
    segmento?: string;
    instance?: string;
    isActive: boolean;
    participateInRoleta: boolean;
    tenantId?: string;
    tenantName?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ApiLead {
    id: string;
    name: string;
    email?: string;
    phone: string;
    // valores comuns: 'GOOGLE' | 'FACEBOOK' | 'SITE' | 'INDICACAO' | 'OUTRO'
    source: string;
    assignedTo?: string; // user id
    instance?: string;
    valorPotencial: number;
    statusId: string; // ID do status personalizado
    publico?: string;
    leadStatus?: {
        id: string;
        name: string;
        ordem: number;
        color: string;
        tipo: StatusTipo;
        tenantId: string;
    };
    obs?: string;
    interesse?: string;
    ultimoContato?: string; // ISO date
    tenantId?: string;
    cadenciaAtendimentoId?: string;
    tentativaAtendimentoId?: string;
    cadenciaAtendimento?: ApiCadenciaAtendimento;
    tentativaAtual?: ApiTentativaAtendimento;
    createdAt?: string;
    updatedAt?: string;
}

export interface ApiDisparo {
    id: string;
    message: string;
    imageKey?: string;
    videoKey?: string;
    imageUrl?: string; // URL pré-assinada
    videoUrl?: string; // URL pré-assinada
    scheduledAt?: string; // ISO date - Opcional para tipo follow_up
    instance: string;
    filter?: {
        statusId?: string[];
        source?: string[];
    };
    status?: "agendado" | "enviado" | "cancelado" | "inativo";
    allLeads?: boolean;
    tipo?: "agendado" | "follow_up";
    followUpDays?: number;
    followUpStatusId?: string;
    createdAt?: string;
    updatedAt?: string;
}

// Formato retornado por /api/dashboard/stats (conforme serviço backend fornecido)
export interface ApiDashboardStats {
    stats: {
        totalLeads: number;
        leadsConvertidos: number;
        leadsQualificados: number;
        corretoresAtivos: number;
        taxaConversao: number;
        leadsPorStatus?: { status: string; count: number; color: string }[];
    };
    leadsPorDia: { date: string; count: number }[];
    top5Corretores: {
        id: string;
        name: string;
        totalLeads: number;
        convertidos: number;
        taxaConversao: number;
    }[];
    leadsRecentes: Array<ApiLead & { user?: { id: string; name: string } }>;
    leadsPorStatus?: { status: string; count: number; color: string }[];
}

// Mapeadores
export const mapUserFromApi = (u: ApiUser): User => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    whatsapp: u.whatsapp,
    segmento: u.segmento,
    instance: u.instance,
    isActive: Boolean(u.isActive),
    participateInRoleta: Boolean(u.participateInRoleta),
    tenantId: u.tenantId,
    tenantName: u.tenantName,
});

export const mapUserToApi = (u: Partial<User>): Partial<ApiUser> => ({
    id: u.id!,
    name: u.name!,
    email: u.email!,
    role: u.role!,
    whatsapp: u.whatsapp,
    segmento: u.segmento,
    instance: u.instance,
    isActive: u.isActive ?? true,
    participateInRoleta: u.participateInRoleta ?? false,
    tenantId: u.tenantId,
});

export const mapTentativaFromApi = (
    tentativa: ApiTentativaAtendimento,
): TentativaAtendimento => ({
    id: tentativa.id,
    cadenciaAtendimentoId: tentativa.cadenciaAtendimentoId,
    ordem: tentativa.ordem,
    tipoAcao: tentativa.tipoAcao,
    descricao: tentativa.descricao,
    instrucoes: tentativa.instrucoes,
    createdAt: tentativa.createdAt ? new Date(tentativa.createdAt) : undefined,
    updatedAt: tentativa.updatedAt ? new Date(tentativa.updatedAt) : undefined,
});

export const mapCadenciaFromApi = (
    cadencia: ApiCadenciaAtendimento,
): CadenciaAtendimento => ({
    id: cadencia.id,
    nome: cadencia.nome,
    descricao: cadencia.descricao,
    tenantId: cadencia.tenantId,
    ativo: cadencia.ativo,
    tentativas: (cadencia.tentativas || [])
        .map(mapTentativaFromApi)
        .sort((a, b) => a.ordem - b.ordem),
    createdAt: cadencia.createdAt ? new Date(cadencia.createdAt) : undefined,
    updatedAt: cadencia.updatedAt ? new Date(cadencia.updatedAt) : undefined,
});

export const mapLeadFromApi = (
    l: ApiLead | (ApiLead & { user?: { id: string; name: string } }),
): Lead => {
    const withUser = l as ApiLead & { user?: { id: string; name: string } };
    return {
        id: l.id,
        nome: l.name,
        email: l.email,
        telefone: l.phone,
        origem: l.source,
        statusId: l.statusId,
        publico: l.publico,
        leadStatus: l.leadStatus
            ? {
                  id: l.leadStatus.id,
                  name: l.leadStatus.name,
                  ordem: l.leadStatus.ordem,
                  color: l.leadStatus.color,
                  tipo: l.leadStatus.tipo,
                  tenantId: l.leadStatus.tenantId,
                  isDefault: false,
                  isActive: true,
              }
            : undefined,
        corretorId: l.assignedTo || "",
        corretor: withUser.user?.name || "",
        valorPotencial: Number.parseFloat(String(l.valorPotencial || 0)) * 100,
        dataContato: l.createdAt ? new Date(l.createdAt) : new Date(),
        obs: l.obs,
        interesse: l.interesse,
        ultimoContato: l.ultimoContato ? new Date(l.ultimoContato) : undefined,
        tenantId: (l as ApiLead).tenantId,
        cadenciaAtendimentoId: l.cadenciaAtendimentoId,
        tentativaAtendimentoId: l.tentativaAtendimentoId,
        cadenciaAtendimento: l.cadenciaAtendimento
            ? mapCadenciaFromApi(l.cadenciaAtendimento)
            : undefined,
        tentativaAtual: l.tentativaAtual
            ? mapTentativaFromApi(l.tentativaAtual)
            : undefined,
        createdAt: l.createdAt ? new Date(l.createdAt) : new Date(),
        updatedAt: l.updatedAt ? new Date(l.updatedAt) : new Date(),
    };
};

export const mapLeadToApi = (l: Partial<Lead>): Partial<ApiLead> => {
    return {
        id: l.id!,
        name: l.nome!,
        email: l.email?.length ? l.email : undefined,
        phone: l.telefone!,
        source: l.origem as ApiLead["source"],
        assignedTo: l.corretorId?.length ? l.corretorId : undefined,
        valorPotencial: l.valorPotencial,
        statusId: l.statusId,
        interesse: l.interesse,
        ultimoContato: l.ultimoContato?.toISOString(),
        tenantId: l.tenantId,
        obs: l.obs,
    };
};

export const mapDisparoFromApi = (d: ApiDisparo): DisparoMassa => ({
    id: d.id,
    texto: d.message,
    imagem: d.imageUrl || d.imageKey, // Prioriza URL pré-assinada
    video: d.videoUrl || d.videoKey, // Prioriza URL pré-assinada
    instancia: d.instance,
    filtroStatus: d.filter?.statusId || [],
    dataAgendamento: d.scheduledAt ? new Date(d.scheduledAt) : undefined,
    status: (d.status as DisparoMassa["status"]) || "agendado",
    totalEnvios: 0, // Campo será removido ou calculado pelo backend
    allLeads: d.allLeads || false,
    tipo: d.tipo || "agendado",
    followUpDays: d.followUpDays,
    followUpStatusId: d.followUpStatusId,
});

export const mapDashboardFromApi = (s: ApiDashboardStats): DashboardStats => ({
    totalLeads: s.stats.totalLeads,
    leadsConvertidos: s.stats.leadsConvertidos,
    leadsQualificados: s.stats.leadsQualificados,
    taxaConversao: s.stats.taxaConversao,
    corretoresAtivos: s.stats.corretoresAtivos,
    leadsPorStatus: s.stats.leadsPorStatus || s.leadsPorStatus,
    leadsPorDia: (s.leadsPorDia || []).map((i) => ({
        data: i.date,
        quantidade: i.count,
    })),
    topCorretores: (s.top5Corretores || []).map((c) => ({
        id: c.id,
        nome: c.name,
        leads: c.totalLeads,
        convertidos: c.convertidos ?? 0,
    })),
    leadsRecentes: (s.leadsRecentes || []).map(mapLeadFromApi),
});
