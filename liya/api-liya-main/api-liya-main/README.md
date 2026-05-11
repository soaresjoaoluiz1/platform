# Sistema de Gestão de Leads - API RESTful

Uma API robusta e escalável para gerenciamento de leads imobiliários com autenticação baseada em roles, dashboard com métricas e sistema de disparos em massa via WhatsApp.

## 🚀 Funcionalidades

### 🔐 Autenticação e Autorização
- JWT com roles: ADMIN, IMOBILIARIA, CORRETOR
- Middleware de autorização por tipo de usuário
- Rotas protegidas e segregadas por permissão

### 👥 Gestão de Usuários
- CRUD completo de usuários (corretores e imobiliárias)
- Ativação/inativação de usuários
- Controle de participação na roleta de leads

### 📊 Gestão de Leads
- CRUD completo com filtros avançados
- Sistema de atribuição automática (roleta)
- **Status personalizáveis por tenant** com cores e ordenação
- Origem do lead rastreável
- Campos preparados para integração com IA

### 🏢 Sistema Multi-Tenant
- Isolamento completo de dados por tenant
- Status de leads customizáveis por imobiliária
- Configurações independentes por tenant
- Dashboard e métricas específicas por tenant

### 📈 Dashboard e Métricas
- Indicadores em tempo real (total leads, conversões, taxa)
- Leads por dia (gráficos)
- Top 5 corretores
- Filtros por período (7d, 14d, 30d, 90d, customizado)

### 📱 Disparos em Massa
- Agendamento de mensagens WhatsApp
- Filtros por status e tipo de lead
- Upload de mídia (imagens/vídeos)
- Processamento assíncrono

## 🛠️ Stack Tecnológica

- **Linguagem**: TypeScript
- **Framework**: Express.js
- **ORM**: Sequelize
- **Banco**: PostgreSQL
- **Autenticação**: JWT
- **Validação**: Zod
- **Upload**: Multer
- **Logs**: Winston
- **Testes**: Jest

## 📁 Estrutura do Projeto

```
src/
├── config/          # Configurações (database, bootstrap, etc)
├── controllers/     # Controllers da aplicação
├── middlewares/     # Middlewares (auth, validation, etc)
├── models/          # Modelos do Sequelize (User, Lead, Status, etc)
├── routes/          # Definição das rotas
├── services/        # Lógica de negócio
├── types/           # Tipos TypeScript
├── utils/           # Utilitários (jwt, logger)
├── validation/      # Schemas de validação
├── tests/           # Testes unitários
└── server.ts        # Entrada da aplicação
```

## 🚀 Instalação e Execução

1. **Instalar dependências**:
```bash
npm install
```

2. **Configurar variáveis de ambiente**:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

> Usuário ADMIN padrão: na primeira execução, será criado automaticamente se não existir.
> Configure via variáveis:
> - ADMIN_NAME
> - ADMIN_EMAIL
> - ADMIN_PASSWORD
> - ADMIN_WHATSAPP
> - ADMIN_SEGMENT

3. **Configurar banco PostgreSQL** e executar migrations

4. **Executar em desenvolvimento**:
```bash
npm run dev
```

5. **Build para produção**:
```bash
npm run build
npm start
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Build para produção
- `npm start` - Executa versão compilada
- `npm test` - Executa testes unitários
- `npm run db:migrate` - Executa migrations
- `npm run db:seed` - Executa seeds

## 📝 API Endpoints

### Autenticação
```
POST /api/auth/login
POST /api/auth/register
```

### Usuários
```
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
PATCH  /api/users/:id/toggle-status
PATCH  /api/users/:id/toggle-roleta
GET    /api/users/corretores
```

### Leads
```
GET    /api/leads
GET    /api/leads/:id
POST   /api/leads
PUT    /api/leads/:id
DELETE /api/leads/:id
PATCH  /api/leads/:id/assign
PATCH  /api/leads/:id/ultimo-contato
```

### Status Personalizados
```
GET    /api/status
GET    /api/status/:id
POST   /api/status
PUT    /api/status/:id
DELETE /api/status/:id
```

### Tenants (Imobiliárias)
```
GET    /api/tenants
GET    /api/tenants/:id
GET    /api/tenants/current
POST   /api/tenants
```

### Disparos
```
GET    /api/disparos
GET    /api/disparos/:id
POST   /api/disparos
PUT    /api/disparos/:id
DELETE /api/disparos/:id
POST   /api/disparos/:id/process
```

### Dashboard
```
GET /api/dashboard/stats?period=30d&from=2024-01-01&to=2024-01-31
```

### Tenants (Imobiliárias)

#### Listagem e Busca (somente ADMIN)
```
GET  /api/tenants?page=1&limit=20&q=alpha
POST /api/tenants
```

Body para criação:
```json
{ "name": "Imobiliária Alpha" }
```

Resposta da listagem:
```json
{
  "tenants": [ 
    { 
      "id": "uuid", 
      "name": "Imobiliária Alpha", 
      "createdAt": "...",
      "status": [
        {
          "id": "status-uuid",
          "name": "Novo",
          "color": "#3B82F6",
          "isDefault": true,
          "isActive": true
        }
      ]
    } 
  ],
  "total": 1,
  "pages": 1,
  "currentPage": 1
}
```

#### Consulta Individual
```
GET /api/tenants/:id
GET /api/tenants/current  # Retorna dados do tenant do usuário logado
```

Resposta:
```json
{
  "tenant": {
    "id": "uuid",
    "name": "Imobiliária Alpha",
    "createdAt": "...",
    "status": [
      {
        "id": "status-uuid",
        "name": "Novo",
        "color": "#3B82F6", 
        "isDefault": true,
        "isActive": true
      }
    ]
  }
}
```

### Status Personalizados

Cada tenant possui seus próprios status de leads com cores e ordenação customizáveis.

#### Listar Status do Tenant
```
GET /api/status
```

Resposta:
```json
{
  "status": [
    {
      "id": "uuid",
      "name": "Novo",
      "color": "#3B82F6",
      "isDefault": true,
      "isActive": true,
      "tenantId": "tenant-uuid",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

#### Criar Status
```
POST /api/status
```

Body:
```json
{
  "name": "Prospect",
  "color": "#10B981",
}
```

#### Atualizar Status
```
PUT /api/status/:id
```

Body:
```json
{
  "name": "Prospect Qualificado",
  "color": "#059669",
  "isActive": true
}
```

#### Excluir Status
```
DELETE /api/status/:id
```

> **Nota**: Status marcados como `isDefault: true` não podem ser excluídos. Status com leads associados serão desativados (`isActive: false`) ao invés de excluídos.

#### Uso no Fluxo Multi‑tenant
- Usuários comuns acessam dados apenas do `tenantId` do token
- ADMIN pode consultar tenants e, ao consumir outras rotas (Leads, Disparos, Dashboard), enviar `tenantId` por query/body para operar em outro tenant
- Cada tenant possui status de leads independentes e customizáveis
- Status padrão são criados automaticamente: Novo, Contato, Qualificado, Proposta, Convertido, Perdido

## 🔒 Níveis de Acesso

### ADMIN
- Acesso total ao sistema
- Visualiza todos os leads e usuários
- Gerencia corretores e imobiliárias

### IMOBILIARIA
- Visualiza seus corretores e leads deles
- Gerencia corretores da sua imobiliária
- Acesso a relatórios consolidados

### CORRETOR
- Visualiza apenas seus próprios leads
- Acesso limitado ao dashboard
- Pode criar disparos para seus leads

## 🔌 Integração com Front‑end

Esta seção orienta como consumir a API a partir de um app web/mobile.

### Base URL e CORS
- Base URL: defina conforme seu deploy (ex.: http://localhost:3000)
- Todas as rotas estão sob o prefixo `/api`
- CORS: configure `FRONTEND_URL` no .env para o domínio do seu front. No dev, `*` é aceito por padrão.

### Autenticação
- Endpoints: `POST /api/auth/login` e `POST /api/auth/register`
- Envie JSON com `email` e `password`
- A resposta inclui `token` JWT com payload: `{ userId, role, tenantId }`
- Use o header `Authorization: Bearer <token>` em todas as rotas privadas

Exemplo (TypeScript, fetch):

```ts
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function login(email: string, password: string) {
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Falha no login');
  return res.json(); // { token, user: { id, name, role, tenantId, ... } }
}

export async function fetchLeads(token: string, params: Record<string, string | number> = {}) {
  const qs = new URLSearchParams(params as Record<string, string>).toString();
  const url = `${baseUrl}/leads${qs ? `?${qs}` : ''}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Falha ao carregar leads');
  return res.json();
}

// ADMIN pode usar tenantId para operar em outro tenant
export async function fetchLeadsAdmin(token: string, tenantId: string) {
  return fetchLeads(token, { tenantId, page: 1, limit: 10 });
}
```

### Paginação e Filtros (Leads)
- Query params suportados:
  - `page` (padrão 1) e `limit` (padrão 10)
  - `statusId` (UUID do status), `source`, `assignedTo`, `startDate`, `endDate`
  - Multi‑tenant: `tenantId` (somente para ADMIN como override; caso contrário usa o `tenantId` do token)
- Resposta de `GET /api/leads`:
```json
{
  "leads": [ 
    {
      "id": "uuid",
      "name": "João Silva",
      "email": "joao@email.com",
      "phone": "(11) 99999-9999",
      "interesse": "Apartamento 2 quartos na zona sul",
      "ultimoContato": "2024-01-15T14:30:00Z",
      "statusId": "status-uuid",
      "leadStatus": {
        "id": "status-uuid",
        "name": "Contato",
        "color": "#F59E0B",
      },
      "...": "outros campos"
    }
  ],
  "total": 123,
  "pages": 13,
  "currentPage": 1,
  "counters": {
    "novo": 50,
    "contato": 40,
    "convertidos": 10
  }
}
```

### Campos Específicos de Lead
- **interesse**: Campo de texto livre para descrever o que motivou o lead a entrar em contato com a imobiliária
- **ultimoContato**: Timestamp (ISO 8601) do último contato/mensagem enviada para o cliente
- Ambos são opcionais na criação e podem ser atualizados via `PUT /api/leads/:id`

### Disparos
- Listagem: `GET /api/disparos?page=1&limit=10`
- Detalhe: `GET /api/disparos/:id`
- Criação: `POST /api/disparos`
  - Campos mínimos: `message`, `scheduledAt` (ISO), `instance`, `filter: { statusId }`
  - Campos opcionais: `imageUrl`, `videoUrl`
  - Multi‑tenant: `tenantId` é atribuído a partir do token automaticamente; ADMIN pode informar `tenantId` no corpo para sobrescrever

### Dashboard
- `GET /api/dashboard/stats?period=30d&from=YYYY-MM-DD&to=YYYY-MM-DD`
- Period pode ser: `7d`, `14d`, `30d`, `90d`, `all` ou `custom` (exige `from` e `to`)
- Multi‑tenant: ADMIN pode sobrescrever com `tenantId` por query; demais papéis usam o `tenantId` do token

### Erros e Tratamento
- Erros seguem o formato: `{ "error": "mensagem" }`
- Possíveis status: `400` (validação), `401` (não autenticado), `403` (sem permissão), `404` (não encontrado), `429` (rate limit), `500` (erro interno)
- Datas são esperadas e retornadas em ISO 8601

### Boas práticas no Front‑end
- Armazene o token de forma segura (preferir memória/HTTP‑only cookie quando aplicável)
- Centralize o cliente HTTP para anexar `Authorization` e tratar renovação/expiração
- Utilize `AbortController` para cancelar requisições em transições de tela

## 🧪 Testes

Execute os testes com:
```bash
npm test
npm run test:watch  # Modo watch
```

## 📊 Modelos de Dados

### User
```typescript
{
  id: string (UUID)
  name: string
  email: string (unique)
  password: string (hashed)
  role: "ADMIN" | "IMOBILIARIA" | "CORRETOR"
  whatsapp: string
  segment: string
  isActive: boolean
  participateInRoleta: boolean
  tenantId: string (UUID)
  createdAt: Date
  updatedAt: Date
}
```

### Lead
```typescript
{
  id: string (UUID)
  name: string
  email: string
  phone: string
  source: "GOOGLE" | "FACEBOOK" | "SITE" | "INDICACAO" | "OUTRO"
  assignedTo: string (User.id)
  instance: string
  statusId: string (Status.id)  // Referência ao status customizado do tenant
  tenantId: string (UUID)
  interesse?: string  // Campo livre para descrever interesse do lead
  ultimoContato?: Date  // Data e hora do último contato/mensagem enviada
  
  // Campos para IA (preparado para futuras integrações)
  ia_pronto1?: string
  ia_pronto2?: string
  ia_pronto3?: string
  ia_tempo?: number
  ia_bool1?: boolean
  ia_bool2?: boolean
  
  createdAt: Date
  updatedAt: Date
  
  // Associação com status
  leadStatus: {
    id: string
    name: string
    color: string
  }
}
```

### Status
```typescript
{
  id: string (UUID)
  name: string
  color: string  // Código hexadecimal (ex: "#3B82F6")
  isDefault: boolean  // Status padrão do sistema (não pode ser excluído)
  isActive: boolean  // Status ativo/inativo
  tenantId: string (UUID)
  createdAt: Date
  updatedAt: Date
}
```

### Tenant
```typescript
{
  id: string (UUID)
  name: string
  createdAt: Date
  updatedAt: Date
  
  // Associações
  status: Status[]  // Status personalizados do tenant
  users: User[]     // Usuários do tenant
  leads: Lead[]     // Leads do tenant
}
```

### Disparo
```typescript
{
  id: string (UUID)
  message: string
  imageUrl?: string
  videoUrl?: string
  scheduledAt: Date
  instance: string
  createdBy: string (User.id)
  tenantId: string (UUID)
  filter: {
    statusId: string  // UUID do status personalizado
    tipo: string
  }
  createdAt: Date
  updatedAt: Date
}
```

## ✨ Funcionalidades Adicionais

### 🎨 Status Personalizados por Tenant
- Cada imobiliária pode criar seus próprios status de leads
- Cores personalizáveis para cada status
- Ordenação customizável dos status
- Status padrão criados automaticamente: Novo, Contato, Qualificado, Proposta, Convertido, Perdido
- Proteção contra exclusão de status com leads associados

### � Sistema de Bootstrap Inteligente
- Criação automática de dados iniciais ao inicializar o sistema
- Status padrão para todos os tenants (novos e existentes)
- Dados de demonstração para desenvolvimento e testes
- Validação de integridade dos dados antes da criação

### 🔄 Migrações Automáticas
- Sistema de sincronização automática do banco de dados
- Preservação de dados existentes durante atualizações
- Relacionamentos complexos entre modelos gerenciados automaticamente

## 🔒 Segurança
- Helmet.js para headers de segurança
- Validação rigorosa com Zod
- Senhas criptografadas com bcryptjs
- JWT com expiração configurável
## 🔒 Segurança

- Rate limiting (10000 requests/15min por IP)
- Isolamento total de dados por tenant (multi-tenancy seguro)
- Validação de permissões por endpoint e tenant
- Status personalizados protegidos contra exclusão inadequada
- Helmet.js para headers de segurança
- Validação rigorosa com Zod
- Senhas criptografadas com bcryptjs
- JWT com expiração configurável
- CORS configurável por ambiente

## 📈 Performance

- Conexão pooling com PostgreSQL
- Índices otimizados nas consultas com foreign keys
- Paginação em todas as listagens
- Consultas otimizadas com relacionamentos (includes)
- Logs estruturados com Winston
- Graceful shutdown para deploy seguro
- Bootstrap inteligente que evita duplicação de dados

## 🔄 Deploy

O sistema está preparado para deploy em ambientes como:
- Heroku
- AWS (EC2, ECS, Lambda)
- Google Cloud Platform
- DigitalOcean

Certifique-se de configurar as variáveis de ambiente adequadamente para cada ambiente.

## 🆕 Changelog v2.0

### ✨ Principais Mudanças
- **Sistema de Status Personalizados**: Cada tenant agora pode criar e gerenciar seus próprios status de leads
- **Arquitetura Multi-Tenant Aprimorada**: Isolamento completo de dados com melhor performance
- **API de Status**: Novos endpoints para CRUD de status personalizados
- **Bootstrap Inteligente**: Sistema automatizado de criação de dados iniciais
- **Validação Dinâmica**: Validação condicional baseada nos status do tenant

### 🔧 Mudanças Técnicas
- Novo modelo `Status` com relacionamentos complexos
- Migração de enum fixo para sistema dinâmico de status
- Atualização de todos os serviços para suportar status personalizados
- Melhoria na performance das consultas com relacionamentos
- Sistema de bootstrap que preserva dados existentes

### 📋 Migration Guide (v1.x → v2.0)
1. **Backup do banco de dados** antes da atualização
2. **Execute `npm run dev`** - o sistema fará a migração automática
3. **Status padrão** serão criados automaticamente para todos os tenants existentes
4. **Leads existentes** serão migrados para usar o novo sistema de status
5. **APIs antigas** continuam funcionando com compatibilidade automática