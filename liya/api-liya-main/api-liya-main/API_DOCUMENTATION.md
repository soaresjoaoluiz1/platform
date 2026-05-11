# 📚 API Liya - Documentação Completa

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Configuração Inicial](#configuração-inicial)
3. [Fluxo de Integração](#fluxo-de-integração)
4. [Autenticação](#autenticação)
5. [Tenants (Imobiliárias)](#tenants-imobiliárias)
6. [Usuários](#usuários)
7. [Status de Leads](#status-de-leads)
8. [Leads](#leads)
9. [Disparos WhatsApp](#disparos-whatsapp)
10. [Dashboard](#dashboard)
11. [Códigos de Erro](#códigos-de-erro)

---

## 🎯 Visão Geral

**Base URL:** `http://localhost:3000/api`

**Formato de Dados:** JSON (exceto upload de arquivos que usa `multipart/form-data`)

**Autenticação:** JWT Bearer Token

### Roles de Usuários
- **ADMIN**: Acesso total ao sistema
- **IMOBILIARIA**: Gerencia usuários e leads do seu tenant
- **CORRETOR**: Gerencia apenas seus próprios leads

---

## ⚙️ Configuração Inicial

### 1. Configurar Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```env
PORT=3000
NODE_ENV=development
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@lyia.com
ADMIN_PASSWORD=admin123
DB_HOST=localhost
DB_PORT=5432
DB_NAME=liya
DB_USER=postgres
DB_PASS=admin
JWT_SECRET=ABCDE-12345
JWT_EXPIRES_IN=1d
BUCKET_NAME=liya-bucket
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
```

### 2. Iniciar o Servidor

```bash
npm install
npm run dev
```

### 3. Verificar Health Check

```bash
curl http://localhost:3000/api/health
```

**Resposta:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-06T10:00:00.000Z"
}
```

---

## 🔄 Fluxo de Integração

### Fluxo Completo Passo a Passo

```
1. Login como ADMIN
   ↓
2. Criar Tenant (Imobiliária)
   ↓
3. Criar Status Personalizados para o Tenant
   ↓
4. Criar Usuário IMOBILIARIA para o Tenant
   ↓
5. Login como IMOBILIARIA
   ↓
6. Criar Corretores (Usuários CORRETOR)
   ↓
7. Criar Leads
   ↓
8. Atribuir Leads aos Corretores
   ↓
9. Atualizar Status dos Leads
   ↓
10. Criar Disparos WhatsApp
   ↓
11. Processar Disparos
   ↓
12. Visualizar Dashboard
```

---

## 🔐 Autenticação

### 1. Login

```bash
POST /api/auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "admin@lyia.com",
  "password": "admin123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-do-usuario",
    "name": "Admin",
    "email": "admin@lyia.com",
    "role": "ADMIN",
    "tenantId": null,
    "whatsapp": "+5511999999999",
    "segment": "Geral",
    "isActive": true,
    "participateInRoleta": true
  }
}
```

**Exemplo cURL:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@lyia.com",
    "password": "admin123"
  }'
```

### 2. Usar o Token

Em todas as requisições autenticadas, inclua o header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🏢 Tenants (Imobiliárias)

### 1. Criar Tenant

**Permissão:** ADMIN

```bash
POST /api/tenants
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Imobiliária Exemplo LTDA"
}
```

**Response (201 Created):**
```json
{
  "id": "tenant-uuid",
  "name": "Imobiliária Exemplo LTDA",
  "isActive": true,
  "createdAt": "2025-10-06T10:00:00.000Z",
  "updatedAt": "2025-10-06T10:00:00.000Z"
}
```

**Exemplo cURL:**
```bash
curl -X POST http://localhost:3000/api/tenants \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Imobiliária Exemplo LTDA"
  }'
```

### 2. Listar Tenants

**Permissão:** ADMIN

```bash
GET /api/tenants
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "tenants": [
    {
      "id": "tenant-uuid",
      "name": "Imobiliária Exemplo LTDA",
      "isActive": true,
      "createdAt": "2025-10-06T10:00:00.000Z",
      "updatedAt": "2025-10-06T10:00:00.000Z"
    }
  ],
  "total": 1,
  "pages": 1,
  "currentPage": 1
}
```

### 3. Obter Tenant Atual

**Permissão:** Qualquer usuário autenticado

```bash
GET /api/tenants/current
Authorization: Bearer {token}
```

### 4. Obter Tenant por ID

**Permissão:** Qualquer usuário autenticado

```bash
GET /api/tenants/{id}
Authorization: Bearer {token}
```

---

## 📊 Status de Leads

Os status agora possuem um campo **tipo** que define a categoria do status. Os tipos disponíveis são:
- **novo**: Para leads que acabaram de entrar no sistema
- **contato**: Para leads que estão sendo contatados ou em negociação
- **convertido**: Para leads que foram convertidos em clientes

O sistema usa o campo **tipo** para calcular métricas como taxa de conversão, leads convertidos, etc.

### 1. Criar Status

**Permissão:** Qualquer usuário autenticado

```bash
POST /api/status
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Novo Lead",
  "color": "#FF5733",
  "tipo": "novo"
}
```

**Campos do Request:**
- `name` (obrigatório): Nome do status
- `color` (opcional): Cor em hexadecimal (default: #6B7280)
- `tipo` (obrigatório): Tipo do status - deve ser um dos valores: "novo", "contato", "convertido"
- `isDefault` (opcional): Define se é o status padrão (default: false)

**Response (201 Created):**
```json
{
  "id": "status-uuid",
  "name": "Novo Lead",
  "color": "#FF5733",
  "tipo": "novo",
  "isDefault": false,
  "isActive": true,
  "tenantId": "tenant-uuid",
  "createdAt": "2025-10-06T10:00:00.000Z",
  "updatedAt": "2025-10-06T10:00:00.000Z"
}
```

**Exemplo cURL:**
```bash
curl -X POST http://localhost:3000/api/status \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Novo Lead",
    "color": "#FF5733",
    "tipo": "novo"
  }'
```

### 2. Listar Status do Tenant

```bash
GET /api/status
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
[
  {
    "id": "status-uuid-1",
    "name": "Novo Lead",
    "color": "#FF5733",
    "tipo": "novo",
    "isDefault": true,
    "isActive": true,
    "tenantId": "tenant-uuid",
    "createdAt": "2025-10-06T10:00:00.000Z",
    "updatedAt": "2025-10-06T10:00:00.000Z"
  },
  {
    "id": "status-uuid-2",
    "name": "Em Atendimento",
    "color": "#FFC300",
    "tipo": "contato",
    "isDefault": false,
    "isActive": true,
    "tenantId": "tenant-uuid",
    "createdAt": "2025-10-06T10:00:00.000Z",
    "updatedAt": "2025-10-06T10:00:00.000Z"
  },
  {
    "id": "status-uuid-3",
    "name": "Negociação",
    "color": "#2196F3",
    "tipo": "contato",
    "isDefault": false,
    "isActive": true,
    "tenantId": "tenant-uuid",
    "createdAt": "2025-10-06T10:00:00.000Z",
    "updatedAt": "2025-10-06T10:00:00.000Z"
  },
  {
    "id": "status-uuid-4",
    "name": "Convertido",
    "color": "#4CAF50",
    "tipo": "convertido",
    "isDefault": false,
    "isActive": true,
    "tenantId": "tenant-uuid",
    "createdAt": "2025-10-06T10:00:00.000Z",
    "updatedAt": "2025-10-06T10:00:00.000Z"
  }
]
```

### 3. Atualizar Status

```bash
PUT /api/status/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Lead Qualificado",
  "color": "#9C27B0",
  "tipo": "contato"
}
```

**Campos do Request:**
- `name` (opcional): Nome do status
- `color` (opcional): Cor em hexadecimal
- `tipo` (opcional): Tipo do status - deve ser um dos valores: "novo", "contato", "convertido"
- `isDefault` (opcional): Define se é o status padrão
- `isActive` (opcional): Define se o status está ativo

### 4. Deletar Status

```bash
DELETE /api/status/{id}
Authorization: Bearer {token}
```

**Response (204 No Content)**

---

## 👥 Usuários

### 1. Criar Usuário IMOBILIARIA

**Permissão:** ADMIN

```bash
POST /api/users
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "João Silva",
  "email": "joao@imobiliaria.com",
  "password": "senha123",
  "role": "IMOBILIARIA",
  "whatsapp": "+5511988887777",
  "segment": "Imóveis Residenciais",
  "tenantId": "tenant-uuid",
  "participateInRoleta": false
}
```

**Response (201 Created):**
```json
{
  "id": "user-uuid",
  "name": "João Silva",
  "email": "joao@imobiliaria.com",
  "role": "IMOBILIARIA",
  "whatsapp": "+5511988887777",
  "segment": "Imóveis Residenciais",
  "tenantId": "tenant-uuid",
  "isActive": true,
  "participateInRoleta": false,
  "createdAt": "2025-10-06T10:00:00.000Z"
}
```

**Exemplo cURL:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@imobiliaria.com",
    "password": "senha123",
    "role": "IMOBILIARIA",
    "whatsapp": "+5511988887777",
    "segment": "Imóveis Residenciais",
    "tenantId": "tenant-uuid",
    "participateInRoleta": false
  }'
```

### 2. Criar Corretor

**Permissão:** ADMIN ou IMOBILIARIA

```bash
POST /api/users
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Maria Santos",
  "email": "maria@imobiliaria.com",
  "password": "senha123",
  "role": "CORRETOR",
  "whatsapp": "+5511977776666",
  "segment": "Apartamentos",
  "participateInRoleta": true
}
```

**Nota:** O `tenantId` é automaticamente vinculado ao tenant do usuário criador (IMOBILIARIA).

### 3. Listar Usuários

**Permissão:** ADMIN ou IMOBILIARIA

```bash
GET /api/users?page=1&limit=10
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10)
- `role` (opcional): Filtrar por role (ADMIN, IMOBILIARIA, CORRETOR)
- `tenantId` (opcional): Filtrar por tenant (apenas ADMIN)

**Response (200 OK):**
```json
{
  "users": [
    {
      "id": "user-uuid",
      "name": "Maria Santos",
      "email": "maria@imobiliaria.com",
      "role": "CORRETOR",
      "whatsapp": "+5511977776666",
      "segment": "Apartamentos",
      "isActive": true,
      "participateInRoleta": true,
      "tenant": {
        "id": "tenant-uuid",
        "name": "Imobiliária Exemplo LTDA"
      }
    }
  ],
  "total": 1,
  "pages": 1,
  "currentPage": 1
}
```

### 4. Listar Corretores

**Permissão:** Qualquer usuário autenticado

```bash
GET /api/users/corretores
Authorization: Bearer {token}
```

**Retorna apenas corretores do mesmo tenant, com `participateInRoleta = true` e `isActive = true`.**

### 5. Obter Usuário por ID

```bash
GET /api/users/{id}
Authorization: Bearer {token}
```

### 6. Atualizar Usuário

**Permissão:** ADMIN ou IMOBILIARIA

```bash
PUT /api/users/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body (todos os campos são opcionais):**
```json
{
  "name": "Maria Santos Oliveira",
  "email": "maria.oliveira@imobiliaria.com",
  "role": "CORRETOR",
  "whatsapp": "+5511977776666",
  "segment": "Imóveis de Luxo",
  "participateInRoleta": true
}
```

### 7. Ativar/Desativar Usuário

**Permissão:** ADMIN ou IMOBILIARIA

```bash
PATCH /api/users/{id}/toggle-status
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": "user-uuid",
  "isActive": false
}
```

### 8. Ativar/Desativar Participação na Roleta

**Permissão:** ADMIN ou IMOBILIARIA

```bash
PATCH /api/users/{id}/toggle-roleta
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": "user-uuid",
  "participateInRoleta": false
}
```

### 9. Deletar Usuário

**Permissão:** ADMIN ou IMOBILIARIA

```bash
DELETE /api/users/{id}
Authorization: Bearer {token}
```

**Response (204 No Content)**

---

## 📱 Leads

### 1. Criar Lead

**Permissão:** Qualquer usuário autenticado

```bash
POST /api/leads
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Carlos Pereira",
  "email": "carlos@email.com",
  "phone": "+5511966665555",
  "source": "FACEBOOK",
  "instance": "whatsapp-instance-1",
  "interesse": "Apartamento 2 quartos na zona sul",
  "assignedTo": "corretor-uuid"
}
```

**Campos obrigatórios:**
- `name`: Nome do lead
- `email`: Email do lead
- `phone`: Telefone do lead
- `source`: Origem do lead (GOOGLE, FACEBOOK, SITE, LINKEDIN, INDICACAO, OUTRO)

**Campos opcionais:**
- `instance`: Instância do WhatsApp
- `interesse`: Descrição do interesse
- `assignedTo`: UUID do corretor (se não fornecido, usa sistema de roleta)

**Response (201 Created):**
```json
{
  "id": "lead-uuid",
  "name": "Carlos Pereira",
  "email": "carlos@email.com",
  "phone": "+5511966665555",
  "source": "FACEBOOK",
  "instance": "whatsapp-instance-1",
  "interesse": "Apartamento 2 quartos na zona sul",
  "assignedTo": "corretor-uuid",
  "tenantId": "tenant-uuid",
  "statusId": "status-novo-uuid",
  "ultimoContato": null,
  "ia_pronto1": null,
  "ia_pronto2": null,
  "ia_pronto3": null,
  "ia_tempo": null,
  "ia_bool1": false,
  "ia_bool2": false,
  "createdAt": "2025-10-06T10:00:00.000Z",
  "updatedAt": "2025-10-06T10:00:00.000Z",
  "user": {
    "id": "corretor-uuid",
    "name": "Maria Santos",
    "email": "maria@imobiliaria.com"
  },
  "leadStatus": {
    "id": "status-novo-uuid",
    "name": "Novo Lead",
    "color": "#FF5733"
  }
}
```

**Exemplo cURL:**
```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Carlos Pereira",
    "email": "carlos@email.com",
    "phone": "+5511966665555",
    "source": "FACEBOOK",
    "interesse": "Apartamento 2 quartos"
  }'
```

### 2. Listar Leads

**Permissão:** Qualquer usuário autenticado

```bash
GET /api/leads?page=1&limit=10&statusId=status-uuid&assignedTo=corretor-uuid&source=FACEBOOK
Authorization: Bearer {token}
```

**Query Parameters (todos opcionais):**
- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 10)
- `statusId`: Filtrar por status
- `assignedTo`: Filtrar por corretor
- `source`: Filtrar por origem (GOOGLE, FACEBOOK, SITE, etc)
- `search`: Buscar por nome, email ou telefone
- `startDate`: Data inicial (ISO 8601)
- `endDate`: Data final (ISO 8601)

**Nota:** CORRETOR vê apenas seus próprios leads. ADMIN e IMOBILIARIA veem todos do tenant.

**Response (200 OK):**
```json
{
  "leads": [
    {
      "id": "lead-uuid",
      "name": "Carlos Pereira",
      "email": "carlos@email.com",
      "phone": "+5511966665555",
      "source": "FACEBOOK",
      "interesse": "Apartamento 2 quartos",
      "ultimoContato": "2025-10-06T15:30:00.000Z",
      "createdAt": "2025-10-06T10:00:00.000Z",
      "user": {
        "id": "corretor-uuid",
        "name": "Maria Santos"
      },
      "leadStatus": {
        "id": "status-uuid",
        "name": "Em Atendimento",
        "color": "#FFC300",
        "tipo": "contato"
      }
    }
  ],
  "total": 150,
  "pages": 15,
  "currentPage": 1,
  "counters": {
    "novo": 45,
    "contato": 93,
    "convertido": 12
  }
}
```

**Observação sobre counters:**
- Os contadores são agrupados por **tipo de status** (novo, contato, convertido)
- Eles somam todos os leads de cada tipo, independente dos status específicos
- Exemplo: Se você tem 3 status do tipo "contato" ("Em Atendimento", "Negociação", "Qualificado"), o contador "contato" mostrará a soma de leads nesses 3 status

### 3. Obter Lead por ID

```bash
GET /api/leads/{id}
Authorization: Bearer {token}
```

### 4. Atualizar Lead

**Permissão:** Qualquer usuário autenticado (CORRETOR apenas seus leads)

```bash
PUT /api/leads/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body (todos os campos são opcionais):**
```json
{
  "name": "Carlos Pereira Silva",
  "email": "carlos.silva@email.com",
  "phone": "+5511966665555",
  "source": "FACEBOOK",
  "statusId": "status-negociacao-uuid",
  "assignedTo": "outro-corretor-uuid",
  "interesse": "Apartamento 3 quartos com vaga",
  "ultimoContato": "2025-10-06T16:00:00.000Z",
  "ia_pronto1": "Resposta IA 1",
  "ia_pronto2": "Resposta IA 2",
  "ia_pronto3": "Resposta IA 3",
  "ia_tempo": 120,
  "ia_bool1": true,
  "ia_bool2": false
}
```

### 5. Atualizar Último Contato

**Permissão:** Qualquer usuário autenticado

```bash
PATCH /api/leads/{id}/ultimo-contato
Authorization: Bearer {token}
```

**Define `ultimoContato` para a data/hora atual.**

**Response (200 OK):**
```json
{
  "id": "lead-uuid",
  "ultimoContato": "2025-10-06T16:30:00.000Z"
}
```

### 6. Atribuir Lead a Corretor

**Permissão:** ADMIN ou IMOBILIARIA

```bash
PATCH /api/leads/{id}/assign
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "corretorId": "corretor-uuid"
}
```

### 7. Deletar Lead

**Permissão:** ADMIN ou IMOBILIARIA

```bash
DELETE /api/leads/{id}
Authorization: Bearer {token}
```

**Response (204 No Content)**

---

## 📤 Disparos WhatsApp

### 1. Criar Disparo

**Permissão:** Qualquer usuário autenticado

```bash
POST /api/disparos
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Form Data:**
- `message` (obrigatório): Mensagem do disparo
- `scheduledAt` (obrigatório): Data/hora de agendamento (ISO 8601)
- `instance` (obrigatório): Instância do WhatsApp
- `filter` (obrigatório): Filtro JSON string
- `status` (opcional): "agendado" ou "inativo" (padrão: "agendado")
- `image` (opcional): Arquivo de imagem (JPEG, PNG, GIF, WebP) - máx 50MB
- `video` (opcional): Arquivo de vídeo (MP4, MOV, AVI, WebM) - máx 50MB

**Exemplo usando cURL:**
```bash
curl -X POST http://localhost:3000/api/disparos \
  -H "Authorization: Bearer SEU_TOKEN" \
  -F "message=Olá! Temos novos imóveis disponíveis" \
  -F "scheduledAt=2025-10-07T10:00:00Z" \
  -F "instance=whatsapp-instance-1" \
  -F 'filter={"statusId":["status-uuid-1","status-uuid-2"],"source":["FACEBOOK","GOOGLE"]}' \
  -F "status=agendado" \
  -F "image=@/caminho/para/imagem.jpg"
```

**Estrutura do Filter:**
```json
{
  "statusId": ["status-uuid-1", "status-uuid-2"],
  "source": ["FACEBOOK", "GOOGLE", "SITE"],
  "startDate": "2025-10-01T00:00:00Z",
  "endDate": "2025-10-06T23:59:59Z"
}
```

**Response (201 Created):**
```json
{
  "id": "disparo-uuid",
  "message": "Olá! Temos novos imóveis disponíveis",
  "scheduledAt": "2025-10-07T10:00:00.000Z",
  "instance": "whatsapp-instance-1",
  "filter": {
    "statusId": ["status-uuid-1", "status-uuid-2"],
    "source": ["FACEBOOK", "GOOGLE"]
  },
  "status": "agendado",
  "imageKey": "disparos/images/uuid-da-imagem.jpg",
  "videoKey": null,
  "imageUrl": "https://minio-url/presigned-url-for-image",
  "videoUrl": null,
  "tenantId": "tenant-uuid",
  "createdBy": "user-uuid",
  "createdAt": "2025-10-06T10:00:00.000Z",
  "creator": {
    "id": "user-uuid",
    "name": "Maria Santos",
    "email": "maria@imobiliaria.com"
  }
}
```

### 2. Listar Disparos

**Permissão:** Qualquer usuário autenticado

```bash
GET /api/disparos?page=1&limit=10
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (opcional): Número da página
- `limit` (opcional): Itens por página
- `tenantId` (opcional): Filtrar por tenant (apenas ADMIN)

**Nota:** CORRETOR vê apenas seus próprios disparos.

### 3. Obter Disparo por ID

```bash
GET /api/disparos/{id}
Authorization: Bearer {token}
```

**Response inclui URLs pré-assinadas válidas por 7 dias.**

### 4. Atualizar Disparo

**Permissão:** Qualquer usuário autenticado (CORRETOR apenas seus disparos)

```bash
PUT /api/disparos/{id}
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Form Data (mesmos campos do POST, todos opcionais):**

**Se enviar novos arquivos, os anteriores são automaticamente deletados.**

### 5. Deletar Disparo

**Permissão:** Qualquer usuário autenticado (CORRETOR apenas seus disparos)

```bash
DELETE /api/disparos/{id}
Authorization: Bearer {token}
```

**Deleta também os arquivos associados no MinIO.**

**Response (204 No Content)**

### 6. Processar Disparo

**Permissão:** Qualquer usuário autenticado

```bash
POST /api/disparos/{id}/process
Authorization: Bearer {token}
```

**Busca leads que atendem aos filtros e simula envio de WhatsApp.**

**Response (200 OK):**
```json
{
  "disparoId": "disparo-uuid",
  "totalLeads": 15,
  "results": [
    {
      "leadId": "lead-uuid-1",
      "success": true
    },
    {
      "leadId": "lead-uuid-2",
      "success": true
    },
    {
      "leadId": "lead-uuid-3",
      "success": false,
      "error": "Falha no envio do WhatsApp"
    }
  ]
}
```

---

## 📊 Dashboard

O dashboard fornece estatísticas e métricas sobre leads e corretores. A métrica de **leadsConvertidos** e **taxaConversão** é calculada com base nos status que possuem o campo `tipo` igual a `"convertido"`.

### 1. Obter Estatísticas

**Permissão:** Qualquer usuário autenticado

```bash
GET /api/dashboard/stats
Authorization: Bearer {token}
```

**Parâmetros de Query (opcionais):**
- `period`: Período das estatísticas (default: 30d)
- `from`: Data inicial no formato ISO 8601
- `to`: Data final no formato ISO 8601

**Response (200 OK):**
```json
{
  "totalLeads": 150,
  "leadsConvertidos": 25,
  "corretoresAtivos": 10,
  "taxaConversao": 16.67
}
```

**Observação:** O campo `leadsConvertidos` conta todos os leads que possuem um status com `tipo: "convertido"`, independente do nome do status.

### 2. Leads por Dia

```bash
GET /api/dashboard/leads-por-dia?days=30
Authorization: Bearer {token}
```

**Query Parameters:**
- `days` (opcional): Número de dias (padrão: 30)

**Response (200 OK):**
```json
[
  {
    "date": "2025-10-06",
    "count": 5
  },
  {
    "date": "2025-10-05",
    "count": 8
  },
  {
    "date": "2025-10-04",
    "count": 3
  }
]
```

### 3. Top Corretores

```bash
GET /api/dashboard/top-corretores?limit=10
Authorization: Bearer {token}
```

**Query Parameters:**
- `limit` (opcional): Número de corretores (padrão: 10)

**Response (200 OK):**
```json
[
  {
    "id": "corretor-uuid-1",
    "name": "Maria Santos",
    "totalLeads": 45,
    "convertidos": 12,
    "taxaConversao": 26.67
  },
  {
    "id": "corretor-uuid-2",
    "name": "João Silva",
    "totalLeads": 38,
    "convertidos": 8,
    "taxaConversao": 21.05
  }
]
```

---

## 🔄 Fluxo Completo Exemplo

### Cenário: Criação completa de uma imobiliária com leads

```bash
# 1. Login como ADMIN
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lyia.com","password":"admin123"}' \
  | jq -r '.token')

# 2. Criar Tenant
TENANT_ID=$(curl -s -X POST http://localhost:3000/api/tenants \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Imobiliária XYZ"}' \
  | jq -r '.id')

# 3. Criar Status "Novo Lead"
STATUS_NOVO=$(curl -s -X POST http://localhost:3000/api/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Novo Lead","color":"#FF5733","tipo":"novo"}' \
  | jq -r '.id')

# 4. Criar Status "Convertido"
STATUS_CONVERTIDO=$(curl -s -X POST http://localhost:3000/api/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Convertido","color":"#4CAF50","tipo":"convertido"}' \
  | jq -r '.id')

# 5. Criar Usuário IMOBILIARIA
IMOB_ID=$(curl -s -X POST http://localhost:3000/api/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Gerente\",\"email\":\"gerente@xyz.com\",\"password\":\"senha123\",\"role\":\"IMOBILIARIA\",\"whatsapp\":\"+5511988887777\",\"segment\":\"Imóveis Residenciais\",\"tenantId\":\"$TENANT_ID\"}" \
  | jq -r '.id')

# 6. Login como IMOBILIARIA
IMOB_TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"gerente@xyz.com","password":"senha123"}' \
  | jq -r '.token')

# 7. Criar Corretor
CORRETOR_ID=$(curl -s -X POST http://localhost:3000/api/users \
  -H "Authorization: Bearer $IMOB_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Corretor Maria","email":"maria@xyz.com","password":"senha123","role":"CORRETOR","whatsapp":"+5511977776666","segment":"Apartamentos","participateInRoleta":true}' \
  | jq -r '.id')

# 8. Criar Lead
LEAD_ID=$(curl -s -X POST http://localhost:3000/api/leads \
  -H "Authorization: Bearer $IMOB_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Cliente Teste\",\"email\":\"cliente@email.com\",\"phone\":\"+5511966665555\",\"source\":\"FACEBOOK\",\"assignedTo\":\"$CORRETOR_ID\"}" \
  | jq -r '.id')

# 9. Atualizar Status do Lead
curl -X PUT http://localhost:3000/api/leads/$LEAD_ID \
  -H "Authorization: Bearer $IMOB_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"statusId\":\"$STATUS_CONVERTIDO\"}"

# 10. Criar Disparo
curl -X POST http://localhost:3000/api/disparos \
  -H "Authorization: Bearer $IMOB_TOKEN" \
  -F "message=Olá! Temos novidades para você" \
  -F "scheduledAt=2025-10-07T10:00:00Z" \
  -F "instance=whatsapp-1" \
  -F "filter={\"statusId\":[\"$STATUS_NOVO\"],\"source\":[\"FACEBOOK\"]}"

# 11. Ver Dashboard
curl -X GET http://localhost:3000/api/dashboard/stats \
  -H "Authorization: Bearer $IMOB_TOKEN"
```

---

## ❌ Códigos de Erro

### Códigos HTTP

- **200 OK**: Requisição bem-sucedida
- **201 Created**: Recurso criado com sucesso
- **204 No Content**: Recurso deletado com sucesso
- **400 Bad Request**: Dados inválidos
- **401 Unauthorized**: Token inválido ou ausente
- **403 Forbidden**: Sem permissão para acessar
- **404 Not Found**: Recurso não encontrado
- **500 Internal Server Error**: Erro no servidor

### Exemplos de Respostas de Erro

**400 Bad Request:**
```json
{
  "error": "Email inválido"
}
```

**401 Unauthorized:**
```json
{
  "error": "Token inválido ou expirado"
}
```

**403 Forbidden:**
```json
{
  "error": "Sem permissão para acessar este recurso"
}
```

**404 Not Found:**
```json
{
  "error": "Lead não encontrado"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Erro interno do servidor"
}
```

---

## 📝 Notas Importantes

### Sistema de Roleta

Quando um lead é criado sem `assignedTo`, o sistema:
1. Busca corretores do mesmo tenant
2. Filtra por `participateInRoleta = true` e `isActive = true`
3. Distribui em round-robin (alternando entre corretores)

### URLs Pré-assinadas

- URLs de arquivos (imagens/vídeos) são válidas por **7 dias**
- Após 7 dias, é necessário fazer nova requisição GET para obter nova URL
- Arquivos são armazenados permanentemente no MinIO

### Permissões

- **ADMIN**: Acesso total, pode gerenciar múltiplos tenants
- **IMOBILIARIA**: Gerencia apenas seu tenant
- **CORRETOR**: Acessa apenas seus próprios leads e disparos

### Paginação

- Padrão: 10 itens por página
- Máximo: 100 itens por página
- Use `page` e `limit` para controlar

### Filtros de Data

Use formato ISO 8601:
- `2025-10-06T00:00:00Z`
- `2025-10-06T23:59:59Z`

---

## 🔧 Ferramentas Recomendadas

### Postman/Insomnia

Importe esta collection para testar a API:
- Crie variáveis de ambiente: `baseUrl`, `token`
- Configure os headers de autenticação

### cURL

Todos os exemplos nesta documentação usam cURL.

### HTTPie

Alternativa mais amigável ao cURL:
```bash
http POST localhost:3000/api/auth/login email=admin@lyia.com password=admin123
```

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do servidor
2. Confirme que as variáveis de ambiente estão corretas
3. Teste o health check: `GET /api/health`
4. Verifique se o MinIO está rodando (se usar disparos)

---

**Versão:** 1.0.0
**Última atualização:** 06/10/2025