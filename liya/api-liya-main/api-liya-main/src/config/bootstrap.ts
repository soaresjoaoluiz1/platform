import { User, Lead, Disparo, Tenant, Status } from '../models';
import { UserRole, LeadSource, StatusTipo } from '../types';
import logger from '../utils/logger';
import bcrypt from 'bcryptjs';

/**
 * Cria status padrão para um tenant
 */
async function createDefaultStatuses(tenantId: string) {
  const defaultStatuses = [
    { name: 'Novo', color: '#3B82F6', tipo: StatusTipo.NOVO, ordem: 1, isDefault: true },
    { name: 'Contato', color: '#F59E0B', tipo: StatusTipo.CONTATO, ordem: 2, isDefault: false },
    { name: 'Qualificado', color: '#8B5CF6', tipo: StatusTipo.QUALIFICADO, ordem: 3, isDefault: false },
    { name: 'Proposta', color: '#06B6D4', tipo: StatusTipo.PROPOSTA, ordem: 4, isDefault: false },
    { name: 'Convertido', color: '#10B981', tipo: StatusTipo.CONVERTIDO, ordem: 5, isDefault: false },
    { name: 'Perdido', color: '#EF4444', tipo: StatusTipo.PERDIDO, ordem: 6, isDefault: false },
  ];

  for (const statusData of defaultStatuses) {
    await Status.findOrCreate({
      where: { 
        tenantId,
        name: statusData.name 
      },
      defaults: {
        tenantId,
        ...statusData,
        isActive: true,
        canUpdate: !statusData.isDefault, // Somente status padrão imutável não pode ser atualizado
      },
    });
  }

  logger.info(`Status padrão criados para tenant: ${tenantId}`);
}

/**
 * Garante a existência de um usuário ADMIN padrão.
 */
export async function ensureDefaultAdmin() {
  try {
    const name = process.env.ADMIN_NAME || 'Admin';
    const email = process.env.ADMIN_EMAIL || 'admin@admin.com';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const whatsapp = process.env.ADMIN_WHATSAPP || '00000000000';
    const segmento = process.env.ADMIN_SEGMENT || 'Geral';

    // Se já existe um usuário com este email, não faz nada
    const existingByEmail = await User.findOne({ where: { email } });
    if (existingByEmail) {
      if (existingByEmail.role !== UserRole.ADMIN) {
        logger.warn(
          `Usuário padrão encontrado com email ${email}, mas role é ${existingByEmail.role}. Mantendo role atual.`
        );
      }
      logger.info('Usuário admin padrão já existe (por email).');
      return;
    }

    // Se não há ADMIN algum, cria o padrão
    const existingAdmin = await User.findOne({ where: { role: UserRole.ADMIN } });
    if (existingAdmin) {
      logger.info('Já existe um usuário com role ADMIN. Não será criado admin padrão.');
      return;
    }

    // Criar/garantir um tenant padrão para o ADMIN
    const defaultTenantName = process.env.DEFAULT_TENANT_NAME || 'Tenant Padrão';
    let defaultTenant = await Tenant.findOne({ where: { name: defaultTenantName } });
    if (!defaultTenant) {
      defaultTenant = await Tenant.create({ name: defaultTenantName } as any);
      // Criar status padrão para o tenant
      await createDefaultStatuses(defaultTenant.dataValues.id);
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create(
      {
        name,
        email,
        password: hashed,
        role: UserRole.ADMIN,
        whatsapp,
        segmento,
        tenantId: defaultTenant?.id,
        isActive: true,
        participateInRoleta: false,
      },
      { hooks: false }
    );

    logger.info(`Usuário ADMIN padrão criado: ${user.email}`);
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      logger.warn(
        'Credenciais ADMIN padrão usando valores de fallback (admin@admin.com / admin123). Altere-as via variáveis de ambiente para produção.'
      );
    }
  } catch (error) {
    logger.error('Falha ao garantir usuário ADMIN padrão:', error);
  }
}

/**
 * Popula o banco com dados de demonstração
 */
export async function ensureDemoData() {
  const shouldSeed = process.env.SEED_DEMO === 'true' || process.env.NODE_ENV === 'development';
  if (!shouldSeed) {
    logger.info('Seed de demo desabilitado. Defina SEED_DEMO=true ou use NODE_ENV=development.');
    return;
  }

  try {
    const tenantNames = [
      process.env.SEED_TENANT_A || 'Tenant Demo A',
      process.env.SEED_TENANT_B || 'Tenant Demo B',
    ];
    const tenants = await ensureTenants(tenantNames);

    for (let i = 0; i < tenants.length; i++) {
      const tenant = tenants[i];
      const tSlug = `t${i + 1}`;
      logger.info(`Iniciando seed do tenant: ${tenant.dataValues.name}`);

      const { imobiliaria, corretores } = await createDemoUsersForTenant(tenant, tSlug);
      if (corretores.length > 0) {
        await createDemoLeadsForTenant(tenant, corretores, tSlug);
      }
      await createDemoDisparosForTenant(tenant, imobiliaria.dataValues, tSlug);
      logger.info(`Seed concluído para tenant: ${tenant.dataValues.name}`);
    }

    logger.info('Seed de dados de demonstração multi-tenant concluído.');
  } catch (error) {
    logger.error('Falha ao executar seed de demonstração:', error);
  }
}

async function ensureTenants(names: string[]) {
  const tenants: Tenant[] = [] as any;
  for (const name of names) {
    let tenant = await Tenant.findOne({ where: { name } });
    if (!tenant) {
      tenant = await Tenant.create({ name } as any);
      logger.info(`Tenant criado: ${name}`);
    }
    
    // Sempre garantir que o tenant tenha status padrão
    const existingStatuses = await Status.findAll({
      where: { tenantId: tenant.dataValues.id, isActive: true }
    });
    
    if (existingStatuses.length === 0) {
      await createDefaultStatuses(tenant.dataValues.id);
      logger.info(`Status padrão criados para tenant: ${name}`);
    }
    
    tenants.push(tenant);
  }
  return tenants;
}

async function createDemoUsersForTenant(tenant: Tenant, tSlug: string) {
  const usersToCreate = [
    {
      name: `Imobiliária ${tenant.dataValues.name}`,
      email: `imobiliaria.${tSlug}@demo.com`,
      role: UserRole.IMOBILIARIA,
      whatsapp: '5583999000001',
      segmento: 'Imóveis Residenciais',
      password: 'demo1234',
    },
    {
      name: `Ana Corretora ${tSlug.toUpperCase()}`,
      email: `corretor1.${tSlug}@demo.com`,
      role: UserRole.CORRETOR,
      whatsapp: '5583999000002',
      segmento: 'Apartamentos',
      password: 'demo1234',
    },
    {
      name: `Carlos Corretor ${tSlug.toUpperCase()}`,
      email: `corretor2.${tSlug}@demo.com`,
      role: UserRole.CORRETOR,
      whatsapp: '5583999000003',
      segmento: 'Casas e Terrenos',
      password: 'demo1234',
    },
    {
      name: `Maria Corretora ${tSlug.toUpperCase()}`,
      email: `corretor3.${tSlug}@demo.com`,
      role: UserRole.CORRETOR,
      whatsapp: '5583999000004',
      segmento: 'Imóveis Comerciais',
      password: 'demo1234',
    },
  ];

  const createdUsers = {
    imobiliaria: null as any,
    corretores: [] as any[],
  };

  for (const userData of usersToCreate) {
    let user = await User.findOne({ where: { email: userData.email } });
    
    if (!user) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      user = await User.create({
        ...userData,
        password: hashedPassword,
        tenantId: tenant.dataValues.id,
        isActive: true,
        participateInRoleta: userData.role === UserRole.CORRETOR,
      } as any);
      
      logger.info(`Usuário demo criado (${tenant.dataValues.name}): ${user.email}`);
    }

    if (userData.role === UserRole.IMOBILIARIA) {
      createdUsers.imobiliaria = user;
    } else {
      createdUsers.corretores.push(user);
    }
  }

  return createdUsers;
}

async function createDemoLeadsForTenant(
  tenant: Tenant,
  corretores: Array<{ id: string }>,
  tSlug: string
) {
  const sources = [
    LeadSource.GOOGLE,
    LeadSource.FACEBOOK,
    LeadSource.SITE,
    LeadSource.INDICACAO,
    LeadSource.OUTRO,
  ];

  // Buscar status do tenant
  const tenantStatuses = await Status.findAll({
    where: { tenantId: tenant.dataValues.id, isActive: true },
    order: [['createdAt', 'ASC']],
  });

  const interessesExemplos = [
    'Apartamento 2 quartos na zona sul para comprar',
    'Casa com quintal para família com crianças',
    'Imóvel comercial no centro da cidade',
    'Apartamento para investimento e locação',
    'Casa de praia para fins de semana',
    'Terreno para construir casa própria',
    'Cobertura com vista para o mar',
    'Apartamento próximo ao metrô',
    'Casa em condomínio fechado',
    'Loft no centro histórico',
    'Apartamento studio para solteiro',
    'Casa com piscina e churrasqueira',
  ];

  const totalLeads = 12;
  for (let i = 1; i <= totalLeads; i++) {
    const email = `lead${i}.${tSlug}@demo.com`;
    const existingLead = await Lead.findOne({ where: { email } });
    if (existingLead) continue;

    const assignedTo = corretores[(i - 1) % corretores.length]?.id;
    const source = sources[(i - 1) % sources.length];
    const statusIndex = (i - 1) % tenantStatuses.length;
    const status = tenantStatuses[statusIndex];
    const interesse = interessesExemplos[(i - 1) % interessesExemplos.length];
    
    // Definir últimoContato baseado no nome do status
    let ultimoContato: Date | undefined;
    const statusName = status.dataValues.name.toLowerCase();
    if (statusName.includes('contato') || statusName.includes('qualificado') || statusName.includes('proposta')) {
      ultimoContato = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000); // Últimos 7 dias
    } else if (statusName.includes('convertido') || statusName.includes('perdido')) {
      ultimoContato = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Últimos 30 dias
    }

    await Lead.create({
      name: `Lead ${tenant.dataValues.name} ${i}`,
      email,
      phone: `5583999${(10000 + i).toString().slice(-4)}`,
      source,
      assignedTo,
      instance: `demo-instance-${tSlug}`,
      statusId: status.dataValues.id,
      interesse,
      ultimoContato,
      tenantId: tenant.dataValues.id,
      ia_pronto1: i % 3 === 0 ? 'Mensagem gerada pela IA 1' : undefined,
      ia_pronto2: i % 4 === 0 ? 'Mensagem gerada pela IA 2' : undefined,
      ia_pronto3: i % 5 === 0 ? 'Mensagem gerada pela IA 3' : undefined,
      ia_tempo: i % 2 === 0 ? 42 : undefined,
      ia_bool1: i % 2 === 0,
      ia_bool2: i % 3 === 0,
    } as any);
  }
  
  logger.info(`Leads de demonstração verificados/criados para tenant: ${tenant.dataValues.name}`);
}

async function createDemoDisparosForTenant(
  tenant: Tenant,
  creator: { id: string },
  tSlug: string
) {
  const demoMessages = [
    `[DEMO][${tSlug.toUpperCase()}] Campanha Boas-vindas`,
    `[DEMO][${tSlug.toUpperCase()}] Reengajamento Leads Frios`,
  ];

  for (const message of demoMessages) {
    const existingDisparo = await Disparo.findOne({ where: { message } });
    if (existingDisparo) continue;

    await Disparo.create({
      message,
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Amanhã
      instance: `demo-instance-${tSlug}`,
      tenantId: tenant.dataValues.id,
      createdBy: creator.id,
      filter: JSON.stringify({
        source: [],
        statusId: [],
        startDate: '',
        endDate: '',
      }),
    } as any);
  }
  
  logger.info(`Disparos de demonstração verificados/criados para tenant: ${tenant.dataValues.name}`);
}

export async function ensureLegacyData() {
  // Esta função pode ser removida se não precisar de compatibilidade
  logger.info('Função legada não implementada para o novo sistema de status personalizados.');
}
