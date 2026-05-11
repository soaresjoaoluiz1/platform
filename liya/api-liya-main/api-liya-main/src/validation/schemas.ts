import { z } from "zod";
import { UserRole, LeadSource, StatusTipo } from "../types";

export const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export const createUserSchema = z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    role: z.nativeEnum(UserRole),
    tenantId: z
        .string()
        .uuid("ID do tenant deve ser um UUID válido")
        .optional(),
    whatsapp: z.string().min(10, "WhatsApp deve ter pelo menos 10 caracteres"),
    segmento: z.string().min(2, "Segmento deve ter pelo menos 2 caracteres"),
    participateInRoleta: z.boolean().optional(),
});

export const updateUserSchema = createUserSchema
    .partial()
    .omit({ password: true });

export const createLeadSchema = z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Email inválido").optional(),
    phone: z.string().min(10, "Telefone deve ter pelo menos 10 caracteres"),
    source: z.nativeEnum(LeadSource),
    instance: z.string().min(1, "Instância é obrigatória").optional(),
    assignedTo: z
        .string()
        .uuid("ID do corretor deve ser um UUID válido")
        .optional(),
    obs: z.string().optional(),
    interesse: z.string().optional(),
});

export const updateLeadSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(10).optional(),
    source: z.nativeEnum(LeadSource).optional(),
    statusId: z.string().uuid().optional(),
    assignedTo: z.string().uuid().optional(),
    interesse: z.string().optional(),
    ultimoContato: z.string().datetime().optional(),
    valorPotencial: z.number().optional(),
    ia_pronto1: z.string().optional(),
    ia_pronto2: z.string().optional(),
    ia_pronto3: z.string().optional(),
    ia_tempo: z.number().optional(),
    ia_bool1: z.boolean().optional(),
    ia_bool2: z.boolean().optional(),
});

export const createDisparoSchema = z
    .object({
        message: z.string().min(1, "Mensagem é obrigatória"),
        scheduledAt: z.string().optional(),
        instance: z.string().min(1, "Instância é obrigatória"),
        filter: z.string().optional().default("{}"),
        status: z.enum(["agendado", "inativo"]).optional().default("agendado"),
        allLeads: z
            .string()
            .transform((val) => val === "true")
            .optional()
            .default("false"),
        tipo: z.enum(["agendado", "follow_up"]).optional().default("agendado"),
        followUpDays: z
            .string()
            .transform((val) => Number.parseInt(val, 10))
            .optional(),
        followUpStatusId: z
            .string()
            .uuid("ID do status deve ser um UUID válido")
            .optional(),
    })
    .transform((data) => {
        // Converter filter de string para objeto se necessário
        if (typeof data.filter === "string") {
            try {
                data.filter = JSON.parse(data.filter);
            } catch {
                throw new Error("Filter deve ser um objeto JSON válido");
            }
        }
        return data;
    })
    .refine((data) => {
        // Se for tipo agendado, scheduledAt é obrigatório
        if (data.tipo === "agendado" && !data.scheduledAt) {
            throw new Error(
                "scheduledAt é obrigatório para disparos do tipo agendado",
            );
        }
        // Se for tipo follow_up, followUpDays e followUpStatusId são obrigatórios
        if (
            data.tipo === "follow_up" &&
            (!data.followUpDays || !data.followUpStatusId)
        ) {
            throw new Error(
                "followUpDays e followUpStatusId são obrigatórios para disparos do tipo follow_up",
            );
        }
        return true;
    });

export const createTenantSchema = z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
});

export const createStatusSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    color: z.string().optional().default("#6B7280"),
    tipo: z.nativeEnum(StatusTipo, {
        errorMap: () => ({
            message: "Tipo deve ser: novo, contato ou convertido",
        }),
    }),
    ordem: z
        .number()
        .int("Ordem deve ser um número inteiro")
        .positive("Ordem deve ser um número positivo"),
    isDefault: z.boolean().optional().default(false),
});

export const updateStatusSchema = z.object({
    name: z.string().min(1).optional(),
    color: z.string().optional(),
    tipo: z
        .nativeEnum(StatusTipo, {
            errorMap: () => ({
                message: "Tipo deve ser: novo, contato ou convertido",
            }),
        })
        .optional(),
    ordem: z
        .number()
        .int("Ordem deve ser um número inteiro")
        .positive("Ordem deve ser um número positivo")
        .optional(),
    isDefault: z.boolean().optional(),
    isActive: z.boolean().optional(),
});

export const updateTenantStatusSchema = z.object({
    isActive: z.boolean(),
});

export const updateTenantConfigSchema = z.object({
    primeiraMensagem: z
        .string()
        .max(5000, "Primeira mensagem deve ter no máximo 5000 caracteres")
        .optional(),
});

export const updateTenantWithAdminSchema = z
    .object({
        tenant: z
            .object({
                name: z
                    .string()
                    .min(2, "Nome do tenant deve ter pelo menos 2 caracteres")
                    .optional(),
                isActive: z.boolean().optional(),
                primeiraMensagem: z
                    .string()
                    .max(
                        5000,
                        "Primeira mensagem deve ter no máximo 5000 caracteres",
                    )
                    .optional(),
            })
            .optional(),
        admin: z
            .object({
                name: z
                    .string()
                    .min(
                        2,
                        "Nome do administrador deve ter pelo menos 2 caracteres",
                    )
                    .optional(),
                email: z
                    .string()
                    .email("Email do administrador inválido")
                    .optional(),
                password: z
                    .string()
                    .min(
                        6,
                        "Senha do administrador deve ter pelo menos 6 caracteres",
                    )
                    .optional(),
                whatsapp: z
                    .string()
                    .min(
                        10,
                        "WhatsApp do administrador deve ter pelo menos 10 caracteres",
                    )
                    .optional(),
                segmento: z
                    .string()
                    .min(
                        2,
                        "Segmento do administrador deve ter pelo menos 2 caracteres",
                    )
                    .optional(),
                instance: z.string().optional().nullable(),
                isActive: z.boolean().optional(),
                participateInRoleta: z.boolean().optional(),
            })
            .optional(),
    })
    .refine((data) => Boolean(data.tenant || data.admin), {
        message: "Informe dados do tenant e/ou do administrador para atualizar",
    });

export const getCorretoresSchema = z.object({
    tenantId: z
        .string()
        .uuid("ID do tenant deve ser um UUID válido")
        .optional(),
});

export const deleteTenantSchema = z.object({
    id: z.string().uuid("ID do tenant deve ser um UUID válido"),
});

export const createMensagemProntaSchema = z.object({
    titulo: z
        .string()
        .min(1, "Título é obrigatório")
        .max(255, "Título deve ter no máximo 255 caracteres"),
    conteudo: z.string().min(1, "Conteúdo é obrigatório"),
    statusId: z
        .string()
        .uuid("ID do status deve ser um UUID válido")
        .optional()
        .nullable(),
    isActive: z
        .string()
        .transform((val) => val === "true")
        .optional()
        .default("true"),
});

export const updateMensagemProntaSchema = z.object({
    titulo: z
        .string()
        .min(1, "Título não pode ser vazio")
        .max(255, "Título deve ter no máximo 255 caracteres")
        .optional(),
    conteudo: z.string().min(1, "Conteúdo não pode ser vazio").optional(),
    statusId: z
        .string()
        .uuid("ID do status deve ser um UUID válido")
        .optional()
        .nullable(),
    isActive: z
        .string()
        .transform((val) => val === "true")
        .optional(),
});

export const getMensagensProntasSchema = z.object({
    statusId: z
        .string()
        .uuid("ID do status deve ser um UUID válido")
        .optional(),
    search: z.string().optional(),
    isActive: z
        .enum(["true", "false"])
        .transform((val) => val === "true")
        .optional(),
});

// Schemas para Instâncias
export const conectarInstanciaSchema = z.object({
    // Não precisa de body, usa o userId do token
});

export const atualizarQRCodeSchema = z.object({
    // Não precisa de body, usa o userId do token
});

// Schemas para Sequência de Qualificação
export const createSequenciaQualificacaoSchema = z.object({
    pergunta: z.string().min(1, "Pergunta é obrigatória"),
    resposta: z.string().optional().nullable(),
});

export const updateSequenciaQualificacaoSchema = z.object({
    pergunta: z.string().min(1, "Pergunta é obrigatória").optional(),
    resposta: z.string().optional().nullable(),
    ordem: z
        .number()
        .int("Ordem deve ser um número inteiro")
        .positive("Ordem deve ser positiva")
        .optional(),
});

// Schemas para Lançamentos
export const createLancamentoSchema = z.object({
    titulo: z
        .string()
        .min(1, "Título é obrigatório")
        .max(255, "Título deve ter no máximo 255 caracteres"),
    identificacaoAnuncio: z
        .string()
        .min(1, "Identificação do anúncio é obrigatória")
        .max(255, "Identificação deve ter no máximo 255 caracteres"),
});

export const updateLancamentoSchema = z.object({
    titulo: z
        .string()
        .min(1, "Título não pode ser vazio")
        .max(255, "Título deve ter no máximo 255 caracteres")
        .optional(),
    identificacaoAnuncio: z
        .string()
        .min(1, "Identificação não pode ser vazia")
        .max(255, "Identificação deve ter no máximo 255 caracteres")
        .optional(),
});

// Schemas para Mensagens de Lançamento
export const createMensagemLancamentoSchema = z.object({
    pergunta: z.string().min(1, "Pergunta é obrigatória"),
    resposta: z.string().min(1, "Resposta é obrigatória"),
});

export const updateMensagemLancamentoSchema = z.object({
    pergunta: z.string().min(1, "Pergunta não pode ser vazia").optional(),
    resposta: z.string().min(1, "Resposta não pode ser vazia").optional(),
    ordem: z
        .number()
        .int("Ordem deve ser um número inteiro")
        .positive("Ordem deve ser positiva")
        .optional(),
});

// Schemas para Roletas
export const createRoletaSchema = z.object({
    tipo: z
        .string()
        .min(1, "Tipo é obrigatório")
        .max(50, "Tipo deve ter no máximo 50 caracteres"),
    sequencia: z
        .number()
        .int("Sequência deve ser um número inteiro")
        .positive("Sequência deve ser positiva")
        .optional()
        .default(1),
});

export const updateRoletaSchema = z.object({
    tipo: z
        .string()
        .min(1, "Tipo não pode ser vazio")
        .max(50, "Tipo deve ter no máximo 50 caracteres")
        .optional(),
    sequencia: z
        .number()
        .int("Sequência deve ser um número inteiro")
        .positive("Sequência deve ser positiva")
        .optional(),
});

export const updateSequenciaSchema = z.object({
    sequencia: z
        .number()
        .int("Sequência deve ser um número inteiro")
        .positive("Sequência deve ser positiva"),
});

export const createCadenciaAtendimentoSchema = z.object({
    nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(255),
    descricao: z.string().optional(),
});

export const updateCadenciaAtendimentoSchema = z.object({
    nome: z.string().min(2).max(255).optional(),
    descricao: z.string().optional(),
    ativo: z.boolean().optional(),
});

export const createTentativaAtendimentoSchema = z.object({
    ordem: z
        .number()
        .int("Ordem deve ser um inteiro")
        .positive("Ordem deve ser positiva"),
    tipoAcao: z.enum([
        "mensagem",
        "ligacao",
        "email",
        "reuniao",
        "whatsapp",
        "visita",
    ]),
    descricao: z
        .string()
        .min(2, "Descrição deve ter mínimo 2 caracteres")
        .max(255),
    instrucoes: z.string().optional(),
});

export const updateTentativaAtendimentoSchema = z.object({
    ordem: z.number().int().positive().optional(),
    tipoAcao: z
        .enum(["mensagem", "ligacao", "email", "reuniao", "whatsapp", "visita"])
        .optional(),
    descricao: z.string().min(2).max(255).optional(),
    instrucoes: z.string().optional(),
});
