# 🚀 Guia Rápido de Testes - API Liya

## 📋 Pré-requisitos

- Servidor rodando em `http://localhost:3000`
- MinIO configurado (opcional, apenas para disparos com arquivos)
- PostgreSQL configurado

## 🔧 Ferramentas

### 1. cURL (Linha de Comando)
### 2. Postman (GUI)
### 3. HTTPie (Linha de Comando Amigável)
### 4. JavaScript/Fetch (Código)

---

## 🎯 Cenário 1: Setup Completo de uma Imobiliária

### Passo 1: Login como ADMIN

**cURL:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@lyia.com",
    "password": "admin123"
  }'
```

**HTTPie:**
```bash
http POST localhost:3000/api/auth/login \
  email=admin@lyia.com \
  password=admin123
```

**JavaScript:**
```javascript
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@lyia.com',
    password: 'admin123'
  })
});
const { token } = await response.json();
console.log('Token:', token);
```

**Salve o token retornado!**

---

### Passo 2: Criar Tenant

**cURL:**
```bash
curl -X POST http://localhost:3000/api/tenants \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Imobiliária Premium LTDA"
  }'
```

**HTTPie:**
```bash
http POST localhost:3000/api/tenants \
  Authorization:"Bearer SEU_TOKEN_AQUI" \
  name="Imobiliária Premium LTDA"
```

**JavaScript:**
```javascript
const token = 'SEU_TOKEN_AQUI';
const response = await fetch('http://localhost:3000/api/tenants', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Imobiliária Premium LTDA'
  })
});
const tenant = await response.json();
console.log('Tenant ID:', tenant.id);
```

**Salve o tenantId retornado!**

---

### Passo 3: Criar Status Personalizados

**Status "Novo Lead":**
```bash
curl -X POST http://localhost:3000/api/status \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Novo Lead",
    "color": "#FF5733",
    "order": 1
  }'
```

**Status "Em Contato":**
```bash
curl -X POST http://localhost:3000/api/status \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Em Contato",
    "color": "#FFC300",
    "order": 2
  }'
```

**Status "Visitou Imóvel":**
```bash
curl -X POST http://localhost:3000/api/status \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Visitou Imóvel",
    "color": "#2196F3",
    "order": 3
  }'
```

**Status "Negociação":**
```bash
curl -X POST http://localhost:3000/api/status \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Negociação",
    "color": "#9C27B0",
    "order": 4
  }'
```

**Status "Convertido":**
```bash
curl -X POST http://localhost:3000/api/status \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Convertido",
    "color": "#4CAF50",
    "order": 5
  }'
```

**Status "Perdido":**
```bash
curl -X POST http://localhost:3000/api/status \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Perdido",
    "color": "#F44336",
    "order": 6
  }'
```

---

### Passo 4: Criar Usuário IMOBILIARIA

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gerente João Silva",
    "email": "gerente@premium.com",
    "password": "gerente123",
    "role": "IMOBILIARIA",
    "whatsapp": "+5511988887777",
    "segment": "Imóveis Residenciais",
    "tenantId": "TENANT_ID_AQUI",
    "participateInRoleta": false
  }'
```

---

### Passo 5: Login como IMOBILIARIA

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "gerente@premium.com",
    "password": "gerente123"
  }'
```

**Use este novo token para os próximos passos!**

---

### Passo 6: Criar Corretores

**Corretor 1:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Authorization: Bearer TOKEN_IMOBILIARIA" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Santos",
    "email": "maria@premium.com",
    "password": "maria123",
    "role": "CORRETOR",
    "whatsapp": "+5511977776666",
    "segment": "Apartamentos",
    "participateInRoleta": true
  }'
```

**Corretor 2:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Authorization: Bearer TOKEN_IMOBILIARIA" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pedro Costa",
    "email": "pedro@premium.com",
    "password": "pedro123",
    "role": "CORRETOR",
    "whatsapp": "+5511966665555",
    "segment": "Casas e Terrenos",
    "participateInRoleta": true
  }'
```

**Corretor 3:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Authorization: Bearer TOKEN_IMOBILIARIA" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ana Paula",
    "email": "ana@premium.com",
    "password": "ana123",
    "role": "CORRETOR",
    "whatsapp": "+5511955554444",
    "segment": "Imóveis Comerciais",
    "participateInRoleta": true
  }'
```

---

### Passo 7: Criar Leads (com distribuição automática)

**Lead 1 - Facebook:**
```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Authorization: Bearer TOKEN_IMOBILIARIA" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Carlos Pereira",
    "email": "carlos@email.com",
    "phone": "+5511944443333",
    "source": "FACEBOOK",
    "interesse": "Apartamento 2 quartos, zona sul"
  }'
```

**Lead 2 - Google:**
```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Authorization: Bearer TOKEN_IMOBILIARIA" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juliana Oliveira",
    "email": "juliana@email.com",
    "phone": "+5511933332222",
    "source": "GOOGLE",
    "interesse": "Casa 3 quartos com jardim"
  }'
```

**Lead 3 - Site:**
```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Authorization: Bearer TOKEN_IMOBILIARIA" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Roberto Lima",
    "email": "roberto@email.com",
    "phone": "+5511922221111",
    "source": "SITE",
    "interesse": "Apartamento cobertura"
  }'
```

**Lead 4 - Indicação com corretor específico:**
```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Authorization: Bearer TOKEN_IMOBILIARIA" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Fernanda Souza",
    "email": "fernanda@email.com",
    "phone": "+5511911110000",
    "source": "INDICACAO",
    "interesse": "Sala comercial no centro",
    "assignedTo": "CORRETOR_UUID_MARIA"
  }'
```

---

### Passo 8: Consultar Leads

**Listar todos os leads:**
```bash
curl -X GET "http://localhost:3000/api/leads?page=1&limit=10" \
  -H "Authorization: Bearer TOKEN_IMOBILIARIA"
```

**Filtrar por status:**
```bash
curl -X GET "http://localhost:3000/api/leads?statusId=STATUS_NOVO_UUID" \
  -H "Authorization: Bearer TOKEN_IMOBILIARIA"
```

**Filtrar por corretor:**
```bash
curl -X GET "http://localhost:3000/api/leads?assignedTo=CORRETOR_UUID_MARIA" \
  -H "Authorization: Bearer TOKEN_IMOBILIARIA"
```

**Buscar por nome/email/telefone:**
```bash
curl -X GET "http://localhost:3000/api/leads?search=Carlos" \
  -H "Authorization: Bearer TOKEN_IMOBILIARIA"
```

**Filtrar por data:**
```bash
curl -X GET "http://localhost:3000/api/leads?startDate=2025-10-01T00:00:00Z&endDate=2025-10-06T23:59:59Z" \
  -H "Authorization: Bearer TOKEN_IMOBILIARIA"
```

---

### Passo 9: Atualizar Status do Lead

**Mover para "Em Contato":**
```bash
curl -X PUT http://localhost:3000/api/leads/LEAD_UUID \
  -H "Authorization: Bearer TOKEN_IMOBILIARIA" \
  -H "Content-Type: application/json" \
  -d '{
    "statusId": "STATUS_EM_CONTATO_UUID"
  }'
```

**Registrar último contato:**
```bash
curl -X PATCH http://localhost:3000/api/leads/LEAD_UUID/ultimo-contato \
  -H "Authorization: Bearer TOKEN_IMOBILIARIA"
```

---

### Passo 10: Criar Disparo em Massa

**Disparo apenas com texto:**
```bash
curl -X POST http://localhost:3000/api/disparos \
  -H "Authorization: Bearer TOKEN_IMOBILIARIA" \
  -F "message=🏠 Olá! Temos novos imóveis disponíveis na zona sul. Entre em contato!" \
  -F "scheduledAt=2025-10-07T10:00:00Z" \
  -F "instance=whatsapp-instance-1" \
  -F 'filter={"statusId":["STATUS_NOVO_UUID","STATUS_EM_CONTATO_UUID"],"source":["FACEBOOK","GOOGLE"]}'
```

**Disparo com imagem:**
```bash
curl -X POST http://localhost:3000/api/disparos \
  -H "Authorization: Bearer TOKEN_IMOBILIARIA" \
  -F "message=Confira este lançamento exclusivo!" \
  -F "scheduledAt=2025-10-07T14:00:00Z" \
  -F "instance=whatsapp-instance-1" \
  -F 'filter={"statusId":["STATUS_EM_CONTATO_UUID"]}' \
  -F "image=@/caminho/para/foto-imovel.jpg"
```

**Disparo com vídeo:**
```bash
curl -X POST http://localhost:3000/api/disparos \
  -H "Authorization: Bearer TOKEN_IMOBILIARIA" \
  -F "message=Tour virtual do nosso novo empreendimento" \
  -F "scheduledAt=2025-10-07T16:00:00Z" \
  -F "instance=whatsapp-instance-1" \
  -F 'filter={"statusId":["STATUS_VISITOU_IMOVEL_UUID"]}' \
  -F "video=@/caminho/para/tour-virtual.mp4"
```

---

### Passo 11: Processar Disparo

```bash
curl -X POST http://localhost:3000/api/disparos/DISPARO_UUID/process \
  -H "Authorization: Bearer TOKEN_IMOBILIARIA"
```

---

### Passo 12: Visualizar Dashboard

**Estatísticas gerais:**
```bash
curl -X GET http://localhost:3000/api/dashboard/stats \
  -H "Authorization: Bearer TOKEN_IMOBILIARIA"
```

**Leads por dia (últimos 30 dias):**
```bash
curl -X GET "http://localhost:3000/api/dashboard/leads-por-dia?days=30" \
  -H "Authorization: Bearer TOKEN_IMOBILIARIA"
```

**Top 5 corretores:**
```bash
curl -X GET "http://localhost:3000/api/dashboard/top-corretores?limit=5" \
  -H "Authorization: Bearer TOKEN_IMOBILIARIA"
```

---

## 🎯 Cenário 2: Corretor Gerenciando Seus Leads

### Login como Corretor

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@premium.com",
    "password": "maria123"
  }'
```

### Ver Apenas Seus Leads

```bash
curl -X GET http://localhost:3000/api/leads \
  -H "Authorization: Bearer TOKEN_CORRETOR"
```

### Atualizar Lead

```bash
curl -X PUT http://localhost:3000/api/leads/LEAD_UUID \
  -H "Authorization: Bearer TOKEN_CORRETOR" \
  -H "Content-Type: application/json" \
  -d '{
    "statusId": "STATUS_NEGOCIACAO_UUID",
    "interesse": "Interessado no apartamento do 5º andar"
  }'
```

### Registrar Contato

```bash
curl -X PATCH http://localhost:3000/api/leads/LEAD_UUID/ultimo-contato \
  -H "Authorization: Bearer TOKEN_CORRETOR"
```

### Criar Disparo Personalizado

```bash
curl -X POST http://localhost:3000/api/disparos \
  -H "Authorization: Bearer TOKEN_CORRETOR" \
  -F "message=Olá! Consegui a aprovação para visita no imóvel que você pediu" \
  -F "scheduledAt=2025-10-07T09:00:00Z" \
  -F "instance=whatsapp-instance-1" \
  -F 'filter={"statusId":["STATUS_EM_CONTATO_UUID"]}'
```

---

## 🎯 Cenário 3: Gestão de Usuários

### Listar Todos os Usuários

```bash
curl -X GET "http://localhost:3000/api/users?page=1&limit=20" \
  -H "Authorization: Bearer TOKEN_IMOBILIARIA"
```

### Filtrar Apenas Corretores

```bash
curl -X GET "http://localhost:3000/api/users?role=CORRETOR" \
  -H "Authorization: Bearer TOKEN_IMOBILIARIA"
```

### Desativar Corretor

```bash
curl -X PATCH http://localhost:3000/api/users/CORRETOR_UUID/toggle-status \
  -H "Authorization: Bearer TOKEN_IMOBILIARIA"
```

### Remover da Roleta

```bash
curl -X PATCH http://localhost:3000/api/users/CORRETOR_UUID/toggle-roleta \
  -H "Authorization: Bearer TOKEN_IMOBILIARIA"
```

### Atualizar Dados do Corretor

```bash
curl -X PUT http://localhost:3000/api/users/CORRETOR_UUID \
  -H "Authorization: Bearer TOKEN_IMOBILIARIA" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Santos Silva",
    "whatsapp": "+5511977776666",
    "segment": "Apartamentos de Alto Padrão"
  }'
```

### Deletar Corretor

```bash
curl -X DELETE http://localhost:3000/api/users/CORRETOR_UUID \
  -H "Authorization: Bearer TOKEN_IMOBILIARIA"
```

---

## 🎯 Cenário 4: Operações em Lote

### Script Bash - Criar Múltiplos Leads

```bash
#!/bin/bash

TOKEN="SEU_TOKEN_AQUI"

# Array de leads
leads=(
  "João Silva:joao@email.com:+5511911112222:FACEBOOK:Apartamento 2 quartos"
  "Maria Costa:maria@email.com:+5511922223333:GOOGLE:Casa com piscina"
  "Pedro Santos:pedro@email.com:+5511933334444:SITE:Sala comercial"
  "Ana Lima:ana@email.com:+5511944445555:LINKEDIN:Cobertura duplex"
  "Carlos Souza:carlos@email.com:+5511955556666:INDICACAO:Terreno para construção"
)

for lead in "${leads[@]}"; do
  IFS=':' read -r name email phone source interesse <<< "$lead"
  
  curl -X POST http://localhost:3000/api/leads \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"$name\",
      \"email\": \"$email\",
      \"phone\": \"$phone\",
      \"source\": \"$source\",
      \"interesse\": \"$interesse\"
    }"
  
  echo "\nLead criado: $name"
  sleep 1
done
```

### Script Node.js - Atualizar Status em Lote

```javascript
const TOKEN = 'SEU_TOKEN_AQUI';
const NEW_STATUS_ID = 'STATUS_UUID_AQUI';

const leadIds = [
  'lead-uuid-1',
  'lead-uuid-2',
  'lead-uuid-3',
  'lead-uuid-4',
  'lead-uuid-5'
];

async function updateLeadStatus(leadId) {
  const response = await fetch(`http://localhost:3000/api/leads/${leadId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      statusId: NEW_STATUS_ID
    })
  });
  
  if (response.ok) {
    console.log(`✅ Lead ${leadId} atualizado`);
  } else {
    console.error(`❌ Erro ao atualizar lead ${leadId}`);
  }
}

// Atualizar todos em paralelo
Promise.all(leadIds.map(updateLeadStatus))
  .then(() => console.log('Todos os leads atualizados!'))
  .catch(err => console.error('Erro:', err));
```

### Script Python - Relatório de Leads

```python
import requests
import json

TOKEN = 'SEU_TOKEN_AQUI'
BASE_URL = 'http://localhost:3000/api'

headers = {
    'Authorization': f'Bearer {TOKEN}',
    'Content-Type': 'application/json'
}

# Buscar todos os leads
response = requests.get(f'{BASE_URL}/leads?limit=100', headers=headers)
leads_data = response.json()

# Agrupar por status
status_count = {}
for lead in leads_data['leads']:
    status_name = lead['leadStatus']['name']
    status_count[status_name] = status_count.get(status_name, 0) + 1

# Imprimir relatório
print("=== RELATÓRIO DE LEADS ===")
print(f"Total de leads: {leads_data['total']}")
print("\nPor Status:")
for status, count in status_count.items():
    print(f"  {status}: {count}")

# Agrupar por corretor
corretor_count = {}
for lead in leads_data['leads']:
    corretor_name = lead['user']['name']
    corretor_count[corretor_name] = corretor_count.get(corretor_name, 0) + 1

print("\nPor Corretor:")
for corretor, count in corretor_count.items():
    print(f"  {corretor}: {count}")
```

---

## 🔍 Testes de Validação

### Testar Validação de Email

```bash
# Email inválido - deve retornar erro 400
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "email-invalido",
    "password": "senha123"
  }'
```

### Testar Autenticação

```bash
# Sem token - deve retornar erro 401
curl -X GET http://localhost:3000/api/leads
```

### Testar Permissões

```bash
# Corretor tentando criar tenant - deve retornar erro 403
curl -X POST http://localhost:3000/api/tenants \
  -H "Authorization: Bearer TOKEN_CORRETOR" \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste"}'
```

---

## 🛠️ Dicas e Truques

### Salvar Token em Variável (Bash)

```bash
# Linux/Mac
export TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lyia.com","password":"admin123"}' \
  | jq -r '.token')

# Windows PowerShell
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"admin@lyia.com","password":"admin123"}'
$TOKEN = $response.token
```

### Usar Token Salvo

```bash
# Linux/Mac/Git Bash
curl -X GET http://localhost:3000/api/leads \
  -H "Authorization: Bearer $TOKEN"

# Windows PowerShell
Invoke-RestMethod -Uri "http://localhost:3000/api/leads" `
  -Headers @{ Authorization = "Bearer $TOKEN" }
```

### Formatar JSON na Resposta

```bash
# Com jq
curl -s http://localhost:3000/api/leads \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Com python
curl -s http://localhost:3000/api/leads \
  -H "Authorization: Bearer $TOKEN" | python -m json.tool
```

### Debug de Requisições

```bash
# Ver headers e detalhes
curl -v -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lyia.com","password":"admin123"}'
```

---

## 📦 Collection Postman

### Importar no Postman

1. Crie uma nova collection chamada "API Liya"
2. Crie variável de ambiente `baseUrl` = `http://localhost:3000/api`
3. Crie variável de ambiente `token` (será preenchida após login)

### Script de Pre-request para Login Automático

```javascript
// No Pre-request Script da collection
const login = {
  url: pm.environment.get('baseUrl') + '/auth/login',
  method: 'POST',
  header: { 'Content-Type': 'application/json' },
  body: {
    mode: 'raw',
    raw: JSON.stringify({
      email: 'admin@lyia.com',
      password: 'admin123'
    })
  }
};

pm.sendRequest(login, (err, res) => {
  if (!err) {
    pm.environment.set('token', res.json().token);
  }
});
```

---

## 📝 Checklist de Testes

- [ ] Login como ADMIN
- [ ] Criar tenant
- [ ] Criar status personalizados
- [ ] Criar usuário IMOBILIARIA
- [ ] Login como IMOBILIARIA
- [ ] Criar 3 corretores
- [ ] Listar corretores disponíveis para roleta
- [ ] Criar 5 leads (testar distribuição automática)
- [ ] Consultar leads por filtros diferentes
- [ ] Atualizar status de um lead
- [ ] Atribuir lead manualmente a corretor
- [ ] Registrar último contato
- [ ] Login como CORRETOR
- [ ] Ver apenas leads próprios
- [ ] Atualizar lead próprio
- [ ] Tentar acessar lead de outro corretor (deve falhar)
- [ ] Criar disparo sem arquivo
- [ ] Criar disparo com imagem
- [ ] Criar disparo com vídeo
- [ ] Processar disparo
- [ ] Ver estatísticas do dashboard
- [ ] Ver leads por dia
- [ ] Ver top corretores
- [ ] Desativar corretor
- [ ] Remover corretor da roleta
- [ ] Deletar lead (como IMOBILIARIA)
- [ ] Tentar deletar lead como CORRETOR (deve falhar)

---

**Versão:** 1.0.0
**Última atualização:** 06/10/2025