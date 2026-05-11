export interface User {
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
}

export enum StatusTipo {
    NOVO = "novo",
    CONTATO = "contato",
    CONVERTIDO = "convertido",
    QUALIFICADO = "qualificado",
    PROPOSTA = "proposta",
    PERDIDO = "perdido",
}

export interface Status {
    id: string;
    name: string;
    color: string;
    tipo: StatusTipo;
    ordem: number;
    isDefault: boolean;
    isActive: boolean;
    tenantId: string;
    canUpdate?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export enum TipoAcao {
    MENSAGEM = "mensagem",
    LIGACAO = "ligacao",
    EMAIL = "email",
    REUNIAO = "reuniao",
    WHATSAPP = "whatsapp",
    VISITA = "visita",
}

export interface TentativaAtendimento {
    id: string;
    cadenciaAtendimentoId: string;
    ordem: number;
    tipoAcao: TipoAcao;
    descricao: string;
    instrucoes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CadenciaAtendimento {
    id: string;
    nome: string;
    descricao?: string;
    tenantId: string;
    ativo: boolean;
    tentativas?: TentativaAtendimento[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateCadenciaAtendimento {
    nome: string;
    descricao?: string;
}

export interface UpdateCadenciaAtendimento {
    nome?: string;
    descricao?: string;
    ativo?: boolean;
}

export interface CreateTentativaAtendimento {
    ordem: number;
    tipoAcao: TipoAcao;
    descricao: string;
    instrucoes?: string;
}

export interface UpdateTentativaAtendimento {
    ordem?: number;
    tipoAcao?: TipoAcao;
    descricao?: string;
    instrucoes?: string;
}

export interface Lead {
    id: string;
    nome: string;
    email?: string;
    telefone: string;
    corretorId: string;
    corretor: string;
    origem: string;
    statusId: string;
    leadStatus?: Status;
    valorPotencial: number;
    dataContato: Date;
    obs?: string;
    interesse?: string;
    ultimoContato?: Date;
    tenantId?: string;
    publico?: string;
    cadenciaAtendimentoId?: string;
    tentativaAtendimentoId?: string;
    cadenciaAtendimento?: CadenciaAtendimento;
    tentativaAtual?: TentativaAtendimento;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface DisparoMassa {
    id: string;
    texto: string;
    imagem?: string;
    video?: string;
    instancia: string;
    filtroStatus: string[];
    dataAgendamento?: Date; // Opcional para tipo follow_up
    status: "agendado" | "enviado" | "cancelado" | "inativo";
    totalEnvios: number;
    allLeads?: boolean;
    tipo: "agendado" | "follow_up";
    followUpDays?: number; // Obrigatório para tipo follow_up
    followUpStatusId?: string; // Obrigatório para tipo follow_up
}

export interface DashboardStats {
    totalLeads: number;
    leadsConvertidos: number;
    leadsQualificados: number;
    corretoresAtivos: number;
    taxaConversao: number;
    leadsPorDia: { data: string; quantidade: number }[];
    leadsPorStatus?: {
        status: string;
        count: number;
        color: string;
        ordem?: number;
    }[];
    topCorretores: {
        id: string;
        nome: string;
        leads: number;
        convertidos: number;
    }[];
    leadsRecentes: Lead[];
}

export interface FilterPeriod {
    label: string;
    value: string;
    days?: number;
}

export interface Tenant {
    id: string;
    name: string;
    isActive: boolean;
}

export interface MensagemPronta {
    id: string;
    titulo: string;
    conteudo: string;
    imageUrl?: string;
    videoUrl?: string;
    statusId?: string | null;
    isActive: boolean;
    tenantId: string;
    createdAt: string;
    updatedAt: string;
    status?: {
        id: string;
        name: string;
        color: string;
        tipo: StatusTipo;
    };
}

export interface CreateMensagemPronta {
    titulo: string;
    conteudo: string;
    imagem?: File;
    video?: File;
    statusId?: string;
    isActive?: boolean;
}

export interface UpdateMensagemPronta {
    titulo?: string;
    conteudo?: string;
    imagem?: File | null;
    video?: File | null;
    statusId?: string | null;
    isActive?: boolean;
}

export interface MensagemProntaFilters {
    statusId?: string;
    search?: string;
    isActive?: boolean;
}

export interface WhatsAppInstance {
    id: string;
    instanceName: string;
    status: "conectando" | "conectada" | "desconectada" | "erro";
    qrCode?: string | null;
    lastConnection?: string | null;
    createdAt: string;
    userId?: string;
    userName?: string;
}

export interface WhatsAppConnectionResponse {
    status: "conectando" | "conectada";
    qrCode?: string;
    message: string;
    instanceName: string;
}

export interface WhatsAppStatusResponse {
    instanceName: string;
    status: "conectada" | "desconectada" | "conectando";
    state?: string;
    lastConnection?: string;
}

export interface SequenciaQualificacao {
    id: string;
    ordem: number;
    pergunta: string;
    resposta?: string;
    tenantId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateSequenciaQualificacao {
    pergunta: string;
    resposta?: string;
}

export interface UpdateSequenciaQualificacao {
    pergunta?: string;
    resposta?: string;
    ordem?: number;
}

export interface MensagemLancamento {
    id: string;
    lancamentoId: string;
    ordem: number;
    pergunta: string;
    resposta: string;
    tenantId: string;
    createdAt: string;
    updatedAt: string;
}

export interface Lancamento {
    id: string;
    titulo: string;
    identificacaoAnuncio: string;
    tenantId: string;
    createdAt: string;
    updatedAt: string;
    mensagens?: MensagemLancamento[];
}

export interface CreateLancamento {
    titulo: string;
    identificacaoAnuncio: string;
}

export interface UpdateLancamento {
    titulo?: string;
    identificacaoAnuncio?: string;
}

export interface CreateMensagemLancamento {
    pergunta: string;
    resposta: string;
}

export interface UpdateMensagemLancamento {
    pergunta?: string;
    resposta?: string;
    ordem?: number;
}

export interface Roleta {
    id: string;
    tipo: string;
    sequencia: number;
    tenantId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateRoleta {
    tipo: string;
    sequencia?: number;
}

export interface UpdateRoleta {
    tipo?: string;
    sequencia?: number;
}
