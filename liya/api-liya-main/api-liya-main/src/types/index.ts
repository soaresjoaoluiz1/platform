export enum UserRole {
  ADMIN = 'ADMIN',
  IMOBILIARIA = 'IMOBILIARIA',
  CORRETOR = 'CORRETOR'
}

export enum LeadSource {
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
  SITE = 'SITE',
  LINKEDIN = 'LINKEDIN',
  INDICACAO = 'INDICACAO',
  OUTRO = 'OUTRO'
}

export enum StatusTipo {
  NOVO = 'novo',
  CONTATO = 'contato',
  CONVERTIDO = 'convertido',
  QUALIFICADO = 'qualificado',
  PROPOSTA = 'proposta',
  PERDIDO = 'perdido'
}

export interface JWTPayload {
  userId: string;
  role: UserRole;
  tenantId?: string;
  tenantName?: string;
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
        tenantId?: string;
      };
    }
  }
}

export interface DashboardStats {
  totalLeads: number;
  leadsConvertidos: number;
  leadsQualificados: number;
  corretoresAtivos: number;
  taxaConversao: number;
}

export interface LeadsPorDia {
  date: string;
  count: number;
}

export interface TopCorretor {
  id: string;
  name: string;
  totalLeads: number;
  convertidos: number;
  taxaConversao: number;
}

export enum DisparoTipo {
  AGENDADO = 'agendado',
  FOLLOW_UP = 'follow_up'
}

export interface DisparoFilter {
  statusId: string[];
  source: string[];
  interesse?: string[];
  startDate?: string;
  endDate?: string;
  status?: 'agendado' | 'inativo';
}