# Codebase Index
> 2026-05-11 · 3918 files · ~11.8M tokens total
>
> **How to use:** Read this file first. Navigate to the exact file you need,
> then read only that file. Do not read entire directories.

## Source

**(root)/**
- `eslint.config.js`
- `generate-pdf.mjs`
- `serve.cjs`
- `serve.js`

**_scripts/**
- `ask-report-pdf.mjs`
- `sameco-color-to-status.js` — Google Apps Script — cole em Extensões > Apps Script na planilha SAMECO

**_scripts\psd-gen/**
- `generate.js`

**agency-hub/**
- `seed.js`
- `vite.config.ts`

**agency-hub\server/**
- `db.js`
- `index.js`
- `notifications.js` — notify, notifyMany, getDonoUsers, getClientUsers
- `sse.js` — SSE client management — supports account-level and user-level routing · addSSEClient, removeSSEClient, addSSEUserClient, removeSSEUserClient, broadcastSSE, sendToUser

**agency-hub\server\middleware/**
- `auth.js` — authenticate, requireRole, JWT_SECRET

**agency-hub\server\routes/**
- `approvals.js`
- `auth.js`
- `categories.js`
- `clients.js`
- `dashboard.js`
- `departments.js`
- `financial.js`
- `notifications.js`
- `performance.js` — =====================================================================
- `tasks.js`
- `users.js`

**agency-hub\src/**
- `App.tsx` — default:App
- `main.tsx`
- `vite-env.d.ts`

**agency-hub\src\components/**
- `BankSelect.tsx` — Tradicionais · BANCOS, default:BankSelect
- `CoreAccountSelect.tsx` — default:CoreAccountSelect
- `NotificationBell.tsx` — default:NotificationBell
- `Sidebar.tsx` — default:Sidebar
- `TimerCheck.tsx` — default:TimerCheck
- `Toast.tsx` — useToast, ToastProvider

**agency-hub\src\components\performance/**
- `AnalyticsView.tsx` — default:AnalyticsView
- `CampaignTable.tsx` — default:CampaignTable
- `CRMView.tsx`
- `FunnelChart.tsx` — default:FunnelChart
- `GoogleAdsView.tsx` — default:GoogleAdsView
- `IGChart.tsx` — default:IGChart
- `IGMediaGrid.tsx` — default:IGMediaGrid
- `IGMetrics.tsx` — default:IGMetrics
- `InstagramView.tsx` — default:InstagramView
- `KiwifyView.tsx` — default:KiwifyView
- `MetricCards.tsx` — default:MetricCards
- `MetricGroups.tsx` — default:MetricGroups
- `OverviewView.tsx` — default:OverviewView
- `PerformanceArea.tsx` — ===================================================================== · default:PerformanceArea
- `SpendChart.tsx` — default:SpendChart

**agency-hub\src\context/**
- `AuthContext.tsx` — AuthProvider, useAuth, User
- `SSEContext.tsx` — SSEProvider, useSSE

**agency-hub\src\lib/**
- `api.ts` — apiFetch, formatNumber, formatBRL, fetchClients, createClient, fetchClient, generateApprovalToken, revokeApprovalToken +2
- `performanceApi.ts` — ===================================================================== · fetchAccounts, fetchCompare, fetchDailyCompare, getAction, formatBRL, formatNumber, formatPercent, pctChange +2

**agency-hub\src\pages/**
- `Approvals.tsx` — default:Approvals
- `Categories.tsx` — default:Categories
- `ClientDetail.tsx` — default:ClientDetail
- `Clients.tsx` — default:Clients
- `Dashboard.tsx` — default:Dashboard
- `Departments.tsx` — default:Departments
- `Financial.tsx` — default:Financial
- `Gravacoes.tsx` — default:Gravacoes
- `Login.tsx` — default:Login
- `Notifications.tsx` — default:Notifications
- `Onboard.tsx` — default:Onboard
- `Performance.tsx` — default:Performance
- `Pipeline.tsx` — default:Pipeline
- `PublicApprovals.tsx` — default:PublicApprovals
- `Services.tsx` — default:Services
- `Settings.tsx` — default:SettingsPage
- `TaskDetail.tsx` — default:TaskDetail
- `Tasks.tsx` — default:Tasks
- `Team.tsx` — default:Team

**bin/**
- `opensquad.js`

**client-dashboard/**
- `vite.config.ts`

**client-dashboard\server/**
- `index.js`

**client-dashboard\src/**
- `App.tsx` — default:App
- `main.tsx`

**client-dashboard\src\components/**
- `AnalyticsView.tsx` — default:AnalyticsView
- `CampaignTable.tsx` — default:CampaignTable
- `CRMView.tsx`
- `FunnelChart.tsx` — default:FunnelChart
- `GoogleAdsView.tsx` — default:GoogleAdsView
- `IGChart.tsx` — default:IGChart
- `IGMediaGrid.tsx` — default:IGMediaGrid
- `IGMetrics.tsx` — default:IGMetrics
- `InstagramView.tsx` — default:InstagramView
- `KiwifyView.tsx` — default:KiwifyView
- `MetricCards.tsx` — default:MetricCards
- `MetricGroups.tsx` — default:MetricGroups
- `OverviewView.tsx` — default:OverviewView
- `Sidebar.tsx` — default:Sidebar
- `SpendChart.tsx` — default:SpendChart

**client-dashboard\src\context/**
- `AuthContext.tsx` — AuthProvider, useAuth

**client-dashboard\src\lib/**
- `api.ts` — Em embed mode (iframe vindo do /hub) o token vem na URL como ?embed_token=XXX · fetchAccounts, fetchCompare, fetchDailyCompare, getAction, formatBRL, formatNumber, formatPercent, pctChange +2

**client-dashboard\src\pages/**
- `Dashboard.tsx` — default:Dashboard
- `Login.tsx` — default:Login

**crm-dashboard/**
- `seed.js`
- `vite.config.ts`

**crm-dashboard\server/**
- `db.js` — DEFAULT_EVOLUTION_API_URL, DEFAULT_EVOLUTION_API_KEY
- `index.js`
- `scheduler.js` — startScheduler, runPollNow
- `sse.js` — SSE client management — shared between index.js and route files · addSSEClient, removeSSEClient, broadcastSSE

**crm-dashboard\server\middleware/**
- `auth.js` — Verify JWT and attach user to request · authenticate, requireRole, scopeToAccount, JWT_SECRET

**crm-dashboard\server\routes/**
- `accounts.js`
- `admin.js`
- `auth.js`
- `broadcasts.js` — resumeBroadcastIfPaused, recoverPendingBroadcasts
- `cadences.js`
- `dashboard.js`
- `funnels.js`
- `integrations.js`
- `launches.js`
- `leads.js`
- `messages.js`
- `proposals.js` — publicProposalHandler
- `qualifications.js`
- `ready-messages.js`
- `tasks.js`
- `users.js`
- `webhooks.js`

**crm-dashboard\src/**
- `App.tsx` — default:App
- `main.tsx`

**crm-dashboard\src\components/**
- `AccountSelector.tsx` — default:AccountSelector
- `EditTaskModal.tsx` — default:EditTaskModal
- `MessageMedia.tsx` — default:MessageMedia
- `Sidebar.tsx` — default:Sidebar

**crm-dashboard\src\context/**
- `AccountContext.tsx` — AccountProvider, useAccount
- `AuthContext.tsx` — AuthProvider, useAuth, User
- `SSEContext.tsx` — SSEProvider, useSSE, useSSEStatus

**crm-dashboard\src\lib/**
- `api.ts` — apiFetch, formatBRL, formatNumber, pctChange, fetchMessageMedia, login, fetchAccounts, createAccount +2
- `dates.ts` — Parser de timestamps do SQLite que sao gravados em UTC mas sem marcador de timezone. · parseSqlDate, formatTime, formatDate, formatDateTime
- `messageVars.ts` — Single source of truth for message template variables. · applyMessageVars, MESSAGE_VARIABLES, VarContext, VarDoc

**crm-dashboard\src\pages/**
- `BroadcastDetail.tsx` — default:BroadcastDetail
- `Cadences.tsx` — default:Cadences
- `Chat.tsx` — default:Chat
- `Dashboard.tsx` — default:Dashboard
- `Funnels.tsx` — default:Funnels
- `Integrations.tsx` — default:Integrations
- `Launches.tsx` — default:Launches
- `LeadDetail.tsx` — default:LeadDetail
- `Leads.tsx` — default:Leads
- `Login.tsx` — default:Login
- `Messages.tsx` — default:Messages
- `Pipeline.tsx` — default:Pipeline
- `Propostas.tsx` — default:Propostas
- `Qualifications.tsx` — default:Qualifications
- `ReadyMessages.tsx` — default:ReadyMessages
- `Settings.tsx` — default:SettingsPage
- `Tags.tsx` — default:Tags
- `Tasks.tsx` — default:Tasks
- `Team.tsx` — default:Team

**crm-dashboard\src\pages\admin/**
- `ClientDetail.tsx` — default:ClientDetail
- `Clients.tsx` — default:Clients
- `GlobalDashboard.tsx` — default:GlobalDashboard
- `Users.tsx` — default:AdminUsers

**dashboard/**
- `vite.config.ts`

**dashboard\src/**
- `App.tsx` — App
- `main.tsx`
- `vite-env.d.ts`

**dashboard\src\components/**
- `SquadCard.tsx` — SquadCard
- `SquadSelector.tsx` — SquadSelector
- `StatusBadge.tsx` — StatusBadge
- `StatusBar.tsx` — StatusBar

**dashboard\src\hooks/**
- `useSquadSocket.ts` — useSquadSocket

**dashboard\src\lib/**
- `formatTime.ts` — Formats elapsed milliseconds as "MM:SS" or "HH:MM:SS" if over an hour. · formatElapsed
- `normalizeState.ts` — sortAgentsByDesk, findAgent, getWorkingAgent

**dashboard\src\office/**
- `AgentDesk.tsx` — AgentDesk, GRID_OFFSET_X, GRID_OFFSET_Y, CELL_W, CELL_H
- `drawDesk.ts` — Cell is 128px wide × 128px tall. · drawDeskArea, drawWorkstationBack, drawWorkstationFront, drawScreenGlow, drawDeskAccessories
- `drawFurniture.ts` — drawBookshelf, drawPlant, drawClock, drawWhiteboard, drawCoffeeMachine, drawFilingCabinet
- `drawRoom.ts` — Base wood fill · drawFloor
- `HandoffEnvelope.tsx` — HandoffEnvelope
- `OfficeScene.tsx` — OfficeScene
- `palette.ts` — === Office Color Palette (Gather.town-inspired modern office) === · COLORS, TILE, CELL_W, CELL_H, SCENE_SCALE, CHARACTER_VARIANTS, CharacterColors
- `textures.ts` — generateCharacterTextures, getCharacterTextures, CharacterTextures

**dashboard\src\plugin/**
- `squadWatcher.ts` — squadWatcherPlugin

**dashboard\src\store/**
- `useSquadStore.ts` — State · useSquadStore

**dashboard\src\types/**
- `state.ts` — state.json structure — matches Pipeline Runner output · AgentDesk, AgentStatus, Agent, Handoff, SquadStatus, SquadState, SquadInfo, WsMessage

**gestao-clin/**
- `vite.config.ts`

**gestao-clin\server/**
- `db.js`
- `index.js`
- `scheduler.js` — Runs every 5 minutes · startScheduler
- `sse.js` — SSE client management — shared between index.js and route files · addSSEClient, removeSSEClient, broadcastSSE

**gestao-clin\server\middleware/**
- `auth.js` — Verify JWT and attach user to request · authenticate, requireRole, scopeToAccount, JWT_SECRET

**gestao-clin\server\routes/**
- `accounts.js`
- `anamneses.js`
- `appointments.js`
- `auth.js`
- `broadcasts.js`
- `cadences.js`
- `dashboard.js`
- `funnels.js`
- `integrations.js`
- `launches.js`
- `leads.js`
- `messages.js`
- `public-booking.js`
- `qualifications.js`
- `ready-messages.js`
- `tasks.js`
- `users.js`
- `webhooks.js`

**gestao-clin\src/**
- `App.tsx` — default:App
- `main.tsx`

**gestao-clin\src\components/**
- `AccountSelector.tsx` — default:AccountSelector
- `MessageMedia.tsx` — default:MessageMedia
- `Sidebar.tsx` — default:Sidebar

**gestao-clin\src\context/**
- `AccountContext.tsx` — AccountProvider, useAccount
- `AuthContext.tsx` — AuthProvider, useAuth, User
- `SSEContext.tsx` — SSEProvider, useSSE, useSSEStatus

**gestao-clin\src\lib/**
- `api.ts` — apiFetch, formatBRL, formatNumber, pctChange, fetchMessageMedia, login, fetchAccounts, createAccount +2

**gestao-clin\src\pages/**
- `Agenda.tsx` — default:Agenda
- `Anamnese.tsx` — default:AnamnesePage
- `Booking.tsx` — default:Booking
- `BookingLinks.tsx` — default:BookingLinks
- `Cadences.tsx` — default:Cadences
- `Chat.tsx` — default:Chat
- `Dashboard.tsx` — default:Dashboard
- `Funnels.tsx` — default:Funnels
- `Integrations.tsx` — default:Integrations
- `Launches.tsx` — default:Launches
- `LeadDetail.tsx` — default:LeadDetail
- `Leads.tsx` — default:Leads
- `Login.tsx` — default:Login
- `Messages.tsx` — default:Messages
- `MeusHorarios.tsx` — default:MeusHorarios
- `Pipeline.tsx` — default:Pipeline
- `Qualifications.tsx` — default:Qualifications
- `ReadyMessages.tsx` — default:ReadyMessages
- `Settings.tsx` — default:SettingsPage
- `Tasks.tsx` — default:Tasks
- `Team.tsx` — default:Team

**gestao-clin\src\pages\admin/**
- `ClientDetail.tsx` — default:ClientDetail
- `Clients.tsx` — default:Clients
- `GlobalDashboard.tsx` — default:GlobalDashboard
- `Users.tsx` — default:AdminUsers

**liya\api-liya-main\api-liya-main/**
- `index.js` — run `node index.js` in the terminal
- `jest.config.js`

**liya\api-liya-main\api-liya-main\src/**
- `app.ts`
- `server.ts`

**liya\api-liya-main\api-liya-main\src\config/**
- `bootstrap.ts` — ensureDefaultAdmin, ensureDemoData, ensureLegacyData
- `database.ts`
- `minio.ts` — Configuração do cliente MinIO · bucketName, ensureBucketExists

**liya\api-liya-main\api-liya-main\src\controllers/**
- `AuthController.ts` — AuthController
- `CadenciaAtendimentoController.ts` — CadenciaAtendimentoController
- `DashboardController.ts` — DashboardController
- `DisparoController.ts` — DisparoController
- `InstanciaController.ts`
- `LancamentoController.ts` — LancamentoController
- `LeadController.ts` — LeadController
- `MensagemLancamentoController.ts` — MensagemLancamentoController
- `MensagemProntaController.ts` — MensagemProntaController
- `RoletaController.ts` — RoletaController
- `SequenciaQualificacaoController.ts` — SequenciaQualificacaoController
- `StatusController.ts` — StatusController
- `TenantController.ts` — TenantController
- `UserController.ts` — UserController

**liya\api-liya-main\api-liya-main\src\middlewares/**
- `auth.ts` — authenticate, authorize, AuthenticatedRequest
- `errorHandler.ts` — errorHandler
- `upload.ts` — Configuração do Multer para upload em memória · uploadDisparoFiles
- `validation.ts` — validateRequest, validateParams

**liya\api-liya-main\api-liya-main\src\models/**
- `CadenciaAtendimento.ts`
- `Disparo.ts`
- `index.ts` — User, Lead, Disparo, Tenant, Status, MensagemPronta, Instancia, SequenciaQualificacao +2
- `Instancia.ts` — InstanciaStatus
- `Lancamento.ts`
- `Lead.ts`
- `MensagemLancamento.ts`
- `MensagemPronta.ts`
- `Roleta.ts` — RoletaAttributes
- `SequenciaQualificacao.ts`
- `Status.ts`
- `Tenant.ts`
- `TentativaAtendimento.ts` — TipoAcao
- `User.ts`

**liya\api-liya-main\api-liya-main\src\routes/**
- `auth.ts`
- `cadencias-atendimento.ts`
- `dashboard.ts`
- `disparos.ts`
- `index.ts`
- `instancias.ts`
- `lancamentos.ts`
- `leads.ts`
- `mensagens-lancamento.ts`
- `mensagens-prontas.ts`
- `roletas.ts`
- `sequencias-qualificacao.ts`
- `status.ts`
- `tenants.ts`
- `users.ts`

**liya\api-liya-main\api-liya-main\src\services/**
- `CadenciaAtendimentoService.ts` — CadenciaAtendimentoService, CreateTentativaData, UpdateTentativaData
- `DashboardService.ts` — DashboardService
- `DisparoService.ts` — DisparoService
- `InstanciaService.ts` — InstanciaConnectionResult
- `LancamentoService.ts` — LancamentoService
- `LeadService.ts` — LeadService
- `MensagemLancamentoService.ts` — MensagemLancamentoService
- `MensagemProntaService.ts` — MensagemProntaService
- `RoletaService.ts` — RoletaService
- `SequenciaQualificacaoService.ts` — SequenciaQualificacaoService
- `StatusService.ts` — StatusService
- `TenantService.ts` — TenantService
- `UserService.ts` — UserService

**liya\api-liya-main\api-liya-main\src\tests/**
- `setup.ts` — Load test environment variables

**liya\api-liya-main\api-liya-main\src\types/**
- `index.ts` — JWTPayload, DashboardStats, LeadsPorDia, TopCorretor, DisparoFilter, UserRole, LeadSource, StatusTipo +1

**liya\api-liya-main\api-liya-main\src\utils/**
- `jwt.ts` — generateToken, verifyToken
- `logger.ts`

**liya\api-liya-main\api-liya-main\src\validation/**
- `schemas.ts` — loginSchema, createUserSchema, updateUserSchema, createLeadSchema, updateLeadSchema, createDisparoSchema, createTenantSchema, createStatusSchema +2

**liya\front-end-liya-main\front-end-liya-main/**
- `eslint.config.js`
- `postcss.config.js`
- `tailwind.config.js`
- `vite.config.ts` — https://vitejs.dev/config/

**liya\front-end-liya-main\front-end-liya-main\src/**
- `App.tsx`
- `main.tsx`
- `vite-env.d.ts`

**liya\front-end-liya-main\front-end-liya-main\src\components/**
- `CadastroClienteModal.tsx`
- `CadastroImobiliaria.tsx`
- `CadenciaLeadModal.tsx`
- `CadenciasAtendimento.tsx`
- `Configuracoes.tsx`
- `ConfirmationModal.tsx`
- `Dashboard.tsx`
- `DisparoMassaModal.tsx`
- `Disparos.tsx`
- `Header.tsx`
- `Integracoes.tsx`
- `Lancamentos.tsx`
- `LeadCadenciaInfo.tsx`
- `Leads.tsx`
- `Login.tsx`
- `MensagemProntaModal.tsx`
- `MensagensProntas.tsx`
- `Modal.tsx`
- `PrimeiraMensagem.tsx`
- `RoletaConfig.tsx`
- `SequenciasQualificacao.tsx`
- `Sidebar.tsx`
- `StatusLeads.tsx`
- `Vendedores.tsx`
- `WhatsAppConfig.tsx`
- `WhatsAppInstancias.tsx`

**liya\front-end-liya-main\front-end-liya-main\src\contexts/**
- `AuthContext.tsx` — useAuth, AuthProvider
- `ToastContext.tsx` — ToastProvider, ToastType, Toast, ToastContext

**liya\front-end-liya-main\front-end-liya-main\src\hooks/**
- `useAuth.ts` — useAuth
- `useCadencias.ts` — useCadencias
- `useCorretores.ts` — useCorretores
- `useDashboard.ts` — useDashboard
- `useDisparoMassa.ts` — useDisparoMassa
- `useLancamentos.ts` — useLancamentos
- `useLeads.ts` — useLeads
- `useMensagens.ts` — useMensagens
- `useRoletas.ts` — useRoletas
- `useSequencias.ts` — useSequencias
- `useStatus.ts` — useStatus
- `useTenants.ts` — useTenants
- `useToast.ts` — useToast
- `useWhatsApp.ts` — useWhatsApp, useWhatsAppInstances

**liya\front-end-liya-main\front-end-liya-main\src\services/**
- `api.ts` — Detecta se a URL da API foi configurada (para ativar/desativar integrações) · API_BASE_URL, isApiEnabled, setTokenExpiredCallback, api, getErrorMessage, ApiError
- `auth.ts` — authService, LoginResponse
- `cadencias.ts` — cadenciasService
- `dashboard.ts` — dashboardService
- `disparos.ts` — disparosService
- `lancamentos.ts` — lancamentosService
- `leads.ts` — leadsService
- `mappers.ts` — mapUserFromApi, mapUserToApi, mapTentativaFromApi, mapCadenciaFromApi, mapLeadFromApi, mapLeadToApi, mapDisparoFromApi, mapDashboardFromApi +2
- `mensagens.ts` — fetchMensagensProntas, fetchMensagemProntaById, fetchMensagensProntasByStatus, createMensagemPronta, updateMensagemPronta, toggleMensagemProntaActive, deleteMensagemPronta
- `roletas.ts` — Listar todas as roletas do tenant · roletaService
- `sequencias.ts` — sequenciasService
- `status.ts` — statusService, ApiStatus
- `tenants.ts` — tenantsService, TenantDTO, TenantAdminDTO, UpdateTenantWithAdminPayload, TenantConfig
- `users.ts` — usersService, CreateUserInput
- `whatsapp.ts` — whatsappService

**liya\front-end-liya-main\front-end-liya-main\src\types/**
- `index.ts` — User, Status, TentativaAtendimento, CadenciaAtendimento, CreateCadenciaAtendimento, UpdateCadenciaAtendimento, CreateTentativaAtendimento, UpdateTentativaAtendimento +2

**liya\front-end-liya-main\front-end-liya-main\src\utils/**
- `cadencia.ts` — getTipoAcaoMeta, sortTentativas, getTentativaAtual, getProximaTentativa, formatTentativaLabel

**oxi-pedidos/**
- `ecosystem.config.cjs` — PM2 ecosystem — produção VPS Oxiquímica
- `postcss.config.js`
- `tailwind.config.js`
- `vite.config.ts`

**oxi-pedidos\server/**
- `db.js`
- `index.js`
- `seed-prices.js` — Atualiza o `suggested_sale_price` dos produtos existentes baseado em SKU.
- `seed.js` — Seed/importer.

**oxi-pedidos\server\data/**
- `products-catalog.js` — Dataset extraído do catálogo digital `catalogo-oxi-mercado.html`. · getMargin, calcSuggestedSalePrice, PRODUCTS, CATEGORIES, PRICE_TABLES, PAYMENT_TERMS

**oxi-pedidos\server\lib/**
- `email-templates.js` — Templates HTML de email. HTML inline-only (compatível com clientes de email). · adminNewOrderTemplate, customerOrderConfirmedTemplate
- `mailer.js` — Mailer — wrapper sobre nodemailer com graceful degradation. · isMailerConfigured, sendMail

**oxi-pedidos\server\middleware/**
- `auth.js` — signToken, requireAuth, requireAdmin, requireCustomer

**oxi-pedidos\server\routes/**
- `auth.js`
- `catalog.js`
- `orders.js`

**oxi-pedidos\server\routes\admin/**
- `categories.js`
- `customers.js`
- `dashboard.js`
- `orders.js`
- `payment-terms.js`
- `price-tables.js`
- `products.js`
- `upload.js` — UPLOADS_DIR

**oxi-pedidos\src/**
- `App.tsx` — default:App
- `main.tsx`

**oxi-pedidos\src\components\admin/**
- `AdminLayout.tsx` — PageHeader, default:AdminLayout

**oxi-pedidos\src\components\customer/**
- `CartSidebar.tsx` — default:CartSidebar
- `CustomerLayout.tsx` — default:CustomerLayout
- `ProductCard.tsx` — ProductCardData, default:ProductCard

**oxi-pedidos\src\components\ui/**
- `index.tsx` — Button, Input, Select, Textarea, Card, Badge, Modal, EmptyState +2

**oxi-pedidos\src\context/**
- `AuthContext.tsx` — AuthProvider, useAuth, User, Customer
- `CartContext.tsx` — CartProvider, useCart, CartItem

**oxi-pedidos\src\lib/**
- `api.ts` — getToken, setToken, ApiError, api
- `categoryIcons.tsx` — CategoryIcon
- `cn.ts` — cn
- `format.ts` — fmtBRL, fmtNumber, fmtDate, fmtDateTime, fmtRelative, STATUS_LABEL, STATUS_COLOR

**oxi-pedidos\src\pages/**
- `Home.tsx` — default:Home
- `Login.tsx` — default:Login
- `OrderPrint.tsx` — default:OrderPrint

**oxi-pedidos\src\pages\admin/**
- `Categories.tsx` — default:Categories
- `Customers.tsx` — default:Customers
- `Dashboard.tsx` — default:Dashboard
- `OrderDetail.tsx` — default:OrderDetail
- `Orders.tsx` — default:Orders
- `PriceTableEditor.tsx` — default:PriceTableEditor
- `PriceTables.tsx` — default:PriceTables
- `Products.tsx` — default:Products
- `Settings.tsx` — default:Settings

**oxi-pedidos\src\pages\app/**
- `Catalog.tsx` — default:Catalog
- `Checkout.tsx` — default:Checkout
- `MyOrderDetail.tsx` — default:MyOrderDetail
- `MyOrders.tsx` — default:MyOrders

**skills\image-generator\scripts/**
- `generate.py` — load_api_key, generate_image, main

**skills\instagram-publisher\scripts/**
- `publish.js` — Instagram Carousel Publisher · parseArgs, uploadToCatbox, createChildContainer, getContainerStatus, pollUntilFinished, createCarouselContainer, publishMedia, getPermalink

**skills\opensquad-skill-creator\eval-viewer/**
- `generate_review.py` — get_mime_type, find_runs, build_run, embed_file, load_previous_iteration, generate_html, main, ReviewHandler

**skills\opensquad-skill-creator\scripts/**
- `__init__.py`
- `aggregate_benchmark.py` — calculate_stats, load_run_results, aggregate_results, generate_benchmark, generate_markdown, main
- `quick_validate.py` — validate_skill
- `run_eval.py` — find_project_root, run_single_query, run_eval, main
- `utils.py` — Shared utilities for skill-creator scripts. · parse_skill_md

**squads\claude-code-mastery\scripts/**
- `validate-setup.js`

**src/**
- `agents-cli.js` — agentsCli
- `agents.js` — listInstalled, listAvailable, getAgentMeta, installAgent, removeAgent, clearMetaCache, getAgentVersion, getLocalizedDescription
- `i18n.js` — loadLocale, getLocaleCode, t
- `init.js` — init, loadSavedLocale, getTemplateEntries
- `logger.js` — logEvent, readCliLogs
- `prompt.js` — createPrompt
- `runs.js` — listRuns, formatDuration, printRuns
- `skills-cli.js` — skillsCli
- `skills.js` — listInstalled, listAvailable, getSkillMeta, installSkill, removeSkill, clearMetaCache, getSkillVersion, getLocalizedDescription
- `update.js` — update

**templates\dashboard/**
- `vite.config.ts`

**templates\dashboard\src/**
- `App.tsx` — App
- `main.tsx`
- `vite-env.d.ts`

**templates\dashboard\src\components/**
- `SquadCard.tsx` — SquadCard
- `SquadSelector.tsx` — SquadSelector
- `StatusBadge.tsx` — StatusBadge
- `StatusBar.tsx` — StatusBar

**templates\dashboard\src\hooks/**
- `useSquadSocket.ts` — useSquadSocket

**templates\dashboard\src\lib/**
- `formatTime.ts` — Formats elapsed milliseconds as "MM:SS" or "HH:MM:SS" if over an hour. · formatElapsed
- `normalizeState.ts` — sortAgentsByDesk, findAgent, getWorkingAgent

**templates\dashboard\src\office/**
- `AgentDesk.tsx` — AgentDesk, GRID_OFFSET_X, GRID_OFFSET_Y, CELL_W, CELL_H
- `drawDesk.ts` — Cell is 128px wide × 128px tall. · drawDeskArea, drawWorkstationBack, drawWorkstationFront, drawScreenGlow, drawDeskAccessories
- `drawFurniture.ts` — drawBookshelf, drawPlant, drawClock, drawWhiteboard, drawCoffeeMachine, drawFilingCabinet
- `drawRoom.ts` — Base wood fill · drawFloor
- `HandoffEnvelope.tsx` — HandoffEnvelope
- `OfficeScene.tsx` — OfficeScene
- `palette.ts` — === Office Color Palette (Gather.town-inspired modern office) === · COLORS, TILE, CELL_W, CELL_H, SCENE_SCALE, CHARACTER_VARIANTS, CharacterColors
- `textures.ts` — generateCharacterTextures, getCharacterTextures, CharacterTextures

**templates\dashboard\src\plugin/**
- `squadWatcher.ts` — squadWatcherPlugin

**templates\dashboard\src\store/**
- `useSquadStore.ts` — State · useSquadStore

**templates\dashboard\src\types/**
- `state.ts` — state.json structure — matches Pipeline Runner output · AgentDesk, AgentStatus, Agent, Handoff, SquadStatus, SquadState, SquadInfo, WsMessage

**tests/**
- `agents.test.js`
- `i18n.test.js`
- `init.test.js`
- `logger.test.js`
- `runs.test.js`
- `skills.test.js`
- `update.test.js`

**xquads\squads\claude-code-mastery\scripts/**
- `validate-setup.js`

**xquads\squads\design-squad\output\doorgrill-super/**
- `capture-oc.js`
- `capture.js`
- `generate-pngs.js`
- `generate-pngs.mjs`

**xquads\squads\design-squad\output\doorgrill-super\.chrome-tmp-v1-feed.html\Default\Extensions\lmjegmlicamnimmfhcmpkclmigmmcbeh\3.10_0/**
- `background_compiled.js`
- `offscreen_compiled.js`

**xquads\squads\design-squad\output\josi-terapeuta-ds\social/**
- `screenshot.cjs`

## Config
- `_opensquad\config.yaml`
- `.claude\settings.json`
- `.claude\settings.local.json`
- `.mcp.json`
- `.playwright-mcp\page-2026-05-04T15-12-17-812Z.yml`
- `.playwright-mcp\page-2026-05-04T15-12-24-204Z.yml`
- `.playwright-mcp\page-2026-05-04T15-36-31-575Z.yml`
- `.playwright-mcp\page-2026-05-07T17-46-31-367Z.yml`
- `.playwright-mcp\page-2026-05-07T17-46-43-367Z.yml`
- `.playwright-mcp\page-2026-05-07T17-46-48-979Z.yml`
- `.playwright-mcp\page-2026-05-07T17-46-59-901Z.yml`
- `.vscode\mcp.json`
- `.vscode\tasks.json`
- `agency-hub\package.json`
- `agency-hub\tsconfig.json`
- `client-dashboard\package.json`
- `client-dashboard\tsconfig.json`
- `crm-dashboard\package.json`
- `crm-dashboard\tsconfig.json`
- `dashboard\package.json`
- `dashboard\tsconfig.json`
- `gestao-clin\package.json`
- `gestao-clin\tsconfig.json`
- `oxi-pedidos\package.json`
- `oxi-pedidos\tsconfig.json`
- `oxi-pedidos\tsconfig.node.json`
- `package.json`
- `pages-industria.json`
- `skills-lock.json`
- `templates\package.json`

## Docs
- `agency-hub\CLAUDE.md`
- `agency-hub\DEPLOY.md`
- `agency-hub\README.md`
- `CLAUDE.md`
- `client-dashboard\DEPLOY.md`
- `client-dashboard\README.md`
- `CODEBASE_INDEX.md`
- `CONTRIBUTING.md`
- `drive-snap.md`
- `drive-snapshot.md`
- `oxi-pedidos\DEPLOY.md`
- `oxi-pedidos\README.md`
- `oxiquimica-lp\README.md`
- `README.md`
- `skills\README.md`

---
*Index: ~7.4k tokens · Full codebase: ~11.8M tokens · Saves ~100%*
