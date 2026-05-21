# Codebase Index
> 2026-05-21 · 5298 files · ~19.8M tokens total
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
- `PerformanceArea.tsx` — ===================================================================== · AvailablePlatforms, default:PerformanceArea
- `SpendChart.tsx` — default:SpendChart

**agency-hub\src\context/**
- `AuthContext.tsx` — AuthProvider, useAuth, User
- `SSEContext.tsx` — SSEProvider, useSSE

**agency-hub\src\lib/**
- `api.ts` — apiFetch, getApprovalFiles, formatNumber, formatBRL, fetchClients, createClient, fetchClient, generateApprovalToken +2
- `drive.ts` — ===================================================================== · isDriveUrl, toDriveEmbedUrl
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
- `PerformanceOverview.tsx` — ===================================================================== · default:PerformanceOverview
- `Pipeline.tsx` — default:Pipeline
- `PublicApprovals.tsx` — default:PublicApprovals
- `Services.tsx` — default:Services
- `Settings.tsx` — default:SettingsPage
- `TaskDetail.tsx` — default:TaskDetail
- `Tasks.tsx` — default:Tasks
- `Team.tsx` — default:Team

**bin/**
- `opensquad.js`

**claude-cookbooks-main\claude-cookbooks-main\.claude\skills\cookbook-audit/**
- `validate_notebook.py` — main, NotebookValidator

**claude-cookbooks-main\claude-cookbooks-main\.github\scripts/**
- `verify_registry.py` — check_github_handle, check_url, verify_authors, verify_registry_authors, verify_paths, verify_schemas, main

**claude-cookbooks-main\claude-cookbooks-main\anthropic_cookbook/**
- `__init__.py`

**claude-cookbooks-main\claude-cookbooks-main\capabilities\classification\evaluation/**
- `prompts.py` — simple_classify, rag_classify, rag_chain_of_thought_classify
- `transform.py` — get_transform
- `vectordb.py` — VectorDB

**claude-cookbooks-main\claude-cookbooks-main\capabilities\contextual-embeddings\contextual-rag-lambda-function/**
- `inference_adapter.py` — InferenceAdapter
- `lambda_function.py` — lambda_handler
- `s3_adapter.py` — S3Adapter

**claude-cookbooks-main\claude-cookbooks-main\capabilities\knowledge_graph\evaluation/**
- `eval_extraction.py` — Precision/recall scoring for knowledge-graph extraction. · load_alias_map, fetch_summary, extract, prf, main, Entity, Relation, ExtractedGraph

**claude-cookbooks-main\claude-cookbooks-main\capabilities\retrieval_augmented_generation\evaluation/**
- `eval_end_to_end.py` — evaluate_end_to_end, get_assert
- `eval_retrieval.py` — calculate_mrr, evaluate_retrieval, get_assert
- `prompts.py` — answer_query_base, retrieve_level_two, answer_query_level_two, answer_query_level_three
- `provider_retrieval.py` — retrieve_base, retrieve_level_two, retrieve_level_three
- `vectordb.py` — VectorDB, SummaryIndexedVectorDB

**claude-cookbooks-main\claude-cookbooks-main\capabilities\summarization\data/**
- `multiple_subleases.py`

**claude-cookbooks-main\claude-cookbooks-main\capabilities\summarization\evaluation/**
- `prompts.py` — basic_summarize, guided_legal_summary, summarize_long_document

**claude-cookbooks-main\claude-cookbooks-main\capabilities\summarization\evaluation\custom_evals/**
- `bleu_eval.py` — nltk_bleu_eval, get_assert
- `llm_eval.py` — llm_eval, get_assert
- `rouge_eval.py` — rouge_eval, get_assert

**claude-cookbooks-main\claude-cookbooks-main\capabilities\text_to_sql\evaluation/**
- `prompts.py` — get_schema_info, generate_prompt, generate_prompt_with_examples, generate_prompt_with_cot, generate_prompt_with_rag
- `vectordb.py` — VectorDB

**claude-cookbooks-main\claude-cookbooks-main\capabilities\text_to_sql\evaluation\tests/**
- `test_above_average_salary.py` — get_assert
- `test_average_salary.py` — get_assert
- `test_budget_allocation.py` — get_assert
- `test_employee_count.py` — get_assert
- `test_employee_details.py` — get_assert
- `test_hierarchical_query.py` — get_assert
- `test_simple_query.py` — get_assert
- `utils.py` — extract_sql, execute_sql

**claude-cookbooks-main\claude-cookbooks-main\claude_agent_sdk\chief_of_staff_agent/**
- `agent.py` — get_activity_text, print_activity, send_query

**claude-cookbooks-main\claude-cookbooks-main\claude_agent_sdk\chief_of_staff_agent\.claude\hooks/**
- `report-tracker.py` — track_report
- `script-usage-logger.py` — log_script_usage

**claude-cookbooks-main\claude-cookbooks-main\claude_agent_sdk\chief_of_staff_agent\scripts/**
- `decision_matrix.py` — create_decision_matrix, generate_analysis, main, OptionScore, Analysis, DecisionMatrix
- `financial_forecast.py` — forecast_financials, calculate_profitability_date, calculate_cash_needed, main
- `hiring_impact.py` — calculate_hiring_impact, main
- `simple_calculation.py` — calculate_metrics
- `talent_scorer.py` — score_candidate, get_recommendation, identify_risks, rank_candidates, main

**claude-cookbooks-main\claude-cookbooks-main\claude_agent_sdk\observability_agent/**
- `agent.py` — get_github_mcp_server, send_query

**claude-cookbooks-main\claude-cookbooks-main\claude_agent_sdk\research_agent/**
- `agent.py` — get_activity_text, send_query

**claude-cookbooks-main\claude-cookbooks-main\claude_agent_sdk\site_reliability_agent/**
- `infra_setup.py` — init_database, update_connection_metrics, lifespan, get_db, health_check, metrics, list_users, list_orders +2
- `sre_mcp_server.py` — query_metrics, list_metrics, get_service_health

**claude-cookbooks-main\claude-cookbooks-main\claude_agent_sdk\site_reliability_agent\examples/**
- `sre_bot_slack.py` — handle_pagerduty_webhook, handle_health, convert_markdown_to_slack, process_investigation, handle_mention, handle_message, start_webhook_server, main

**claude-cookbooks-main\claude-cookbooks-main\claude_agent_sdk\utils/**
- `agent_visualizer.py` — extract_model_from_messages, print_activity, reset_activity_context, print_final_result, visualize_conversation
- `html_renderer.py` — render_content, display_card, display_agent_response, visualize_conversation_html

**claude-cookbooks-main\claude-cookbooks-main\claude_agent_sdk\vulnerability_detection_agent\canary/**
- `canary.c`

**claude-cookbooks-main\claude-cookbooks-main\managed_agents/**
- `utilities.py` — wait_for_idle_status, stream_until_end_turn, make_unfamiliar_repo_zip

**claude-cookbooks-main\claude-cookbooks-main\managed_agents\cma-mcp\src/**
- `cma.ts` — listAgents, getAgent, createSession, sendMessage, interrupt, getSession, listEvents, archiveSession +1
- `server-http.ts` — Streamable HTTP transport — for claude.ai web Connectors (or any remote MCP client).
- `server.ts` — stdio transport — for Claude Desktop / Claude Code.
- `tools.ts` — registerTools

**claude-cookbooks-main\claude-cookbooks-main\managed_agents\example_data\iterate/**
- `calc.py` — add, divide, mean
- `test_calc.py` — test_add, test_divide, test_mean

**claude-cookbooks-main\claude-cookbooks-main\managed_agents\example_data\orchestrate\src/**
- `__init__.py`
- `blog.py` — generate_post_url, generate_author_url
- `url_utils.py` — slugify, normalize_path

**claude-cookbooks-main\claude-cookbooks-main\managed_agents\example_data\orchestrate\tests/**
- `__init__.py`
- `test_urls.py` — test_slugify_basic, test_slugify_unicode, test_slugify_special_chars, test_post_url_unicode, test_author_url_unicode, test_normalize_path

**claude-cookbooks-main\claude-cookbooks-main\managed_agents\linear\setup/**
- `create-agent.ts` — One-time: create the Claude agent + environment. Copy the printed IDs into .env.local.

**claude-cookbooks-main\claude-cookbooks-main\managed_agents\linear\src/**
- `agent.ts` — kickoffAgentSession
- `cma-webhook.ts` — handleCmaWebhook
- `main.ts`
- `oauth.ts` — handleOAuthAuthorize, handleOAuthCallback, getAccessToken

**claude-cookbooks-main\claude-cookbooks-main\patterns\agents/**
- `util.py` — llm_call, extract_xml

**claude-cookbooks-main\claude-cookbooks-main\scripts/**
- `test_notebooks.py` — list_notebooks, run_quick_validation, run_pytest, run_tox, main
- `validate_all_notebooks.py` — main, NotebookValidator
- `validate_authors_sorted.py` — load_authors, is_sorted, sort_authors, show_diff, main
- `validate_notebooks.py` — validate_notebook, main

**claude-cookbooks-main\claude-cookbooks-main\scripts\detect-secrets/**
- `plugins.py` — AnthropicSecretsDetector

**claude-cookbooks-main\claude-cookbooks-main\skills/**
- `file_utils.py` — extract_file_ids, download_file, download_all_files, get_file_info, print_download_summary
- `skill_utils.py` — create_skill, list_custom_skills, get_skill_version, create_skill_version, delete_skill, test_skill, list_skill_versions, validate_skill_directory +1

**claude-cookbooks-main\claude-cookbooks-main\skills\custom_skills\analyzing-financial-statements/**
- `calculate_ratios.py` — calculate_ratios_from_data, generate_summary, FinancialRatioCalculator
- `interpret_ratios.py` — perform_comprehensive_analysis, RatioInterpreter

**claude-cookbooks-main\claude-cookbooks-main\skills\custom_skills\applying-brand-guidelines/**
- `apply_brand.py` — apply_brand_to_document, BrandFormatter
- `validate_brand.py` — load_guidelines_from_json, get_acme_corporation_guidelines, main, BrandGuidelines, ValidationResult, BrandValidator

**claude-cookbooks-main\claude-cookbooks-main\skills\custom_skills\creating-financial-models/**
- `dcf_model.py` — calculate_beta, calculate_fcf_cagr, DCFModel
- `sensitivity_analysis.py` — create_data_table, SensitivityAnalyzer

**claude-cookbooks-main\claude-cookbooks-main\tests/**
- `__init__.py`
- `conftest.py` — Pytest configuration and fixtures for notebook testing. · pytest_addoption, get_project_root, load_registry, get_notebooks_to_test, pytest_generate_tests, project_root, notebook_data, notebook_cells +2

**claude-cookbooks-main\claude-cookbooks-main\tests\notebook_tests/**
- `__init__.py`
- `conftest.py` — Pytest hooks for notebook-specific test reporting. · pytest_runtest_makereport, pytest_terminal_summary, pytest_configure
- `test_notebooks.py` — TestNotebookStructure, TestCellExecution, TestCellOutputs, TestSecurity, TestDependencies, TestNotebookExecution, TestNotebookMetadata, TestModelUsage
- `utils.py` — Core utilities for notebook testing and validation. · load_notebook, parse_notebook_cells, validate_cell_execution_order, validate_all_cells_executed, validate_no_error_outputs, validate_no_empty_cells, validate_no_hardcoded_secrets, validate_uses_env_for_api_key +2

**claude-cookbooks-main\claude-cookbooks-main\third_party\ElevenLabs/**
- `stream_voice_assistant_websocket.py` — Low Latency Voice Assistant with WebSocket Streaming · record_audio, transcribe_audio, stream_claude_and_synthesize_ws, main, AudioQueue

**claude-cookbooks-main\claude-cookbooks-main\tool_use/**
- `__init__.py`
- `memory_tool.py` — MemoryToolHandler

**claude-cookbooks-main\claude-cookbooks-main\tool_use\context_engineering/**
- `research_corpus.py` — Synthetic research documents for the context-management cookbook.

**claude-cookbooks-main\claude-cookbooks-main\tool_use\memory_demo/**
- `__init__.py` — Memory cookbook demo package.
- `code_review_demo.py` — run_session_1, run_session_2, run_session_3, main, CodeReviewAssistant
- `demo_helpers.py` — execute_tool, run_conversation_turn, run_conversation_loop, print_context_management_info

**claude-cookbooks-main\claude-cookbooks-main\tool_use\memory_demo\sample_code/**
- `api_client_v1.py` — main, AsyncAPIClient
- `cache_manager.py` — CacheManager, DataProcessor
- `data_processor_v1.py` — DataProcessor, SharedCache
- `sql_query_builder.py` — UserDatabase, QueryBuilder
- `web_scraper_v1.py` — WebScraper

**claude-cookbooks-main\claude-cookbooks-main\tool_use\tests/**
- `test_memory_tool.py` — TestMemoryToolHandler

**claude-cookbooks-main\claude-cookbooks-main\tool_use\utils/**
- `__init__.py`
- `customer_service_api.py` — determine_priority, process_ticket, main, TicketCategory, TicketPriority, TicketStatus, Ticket, TicketGenerator
- `customer_service_tools.py` — initialize_ticket_queue, get_next_ticket, classify_ticket, search_knowledge_base, set_priority, route_to_team, draft_response, add_note +2
- `team_expense_api.py` — get_team_members, get_expenses, get_custom_budget, get_expense_tools
- `visualize.py` — parse_content_block, parse_response, format_json, render_text_content, render_tool_use, render_server_tool_use, render_tool_result, render_code_execution_result +2

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
- `broadcasts.js` — runBroadcastLoop, resumeBroadcastIfPaused, recoverPendingBroadcasts
- `cadences.js`
- `contracts.js`
- `dashboard.js`
- `funnels.js`
- `integrations.js`
- `launches.js`
- `leads.js`
- `messages.js`
- `proposals.js` — publicProposalHandler
- `qualifications.js`
- `ready-messages.js`
- `tag-mapping.js`
- `tasks.js`
- `users.js`
- `webhooks.js`

**crm-dashboard\server\services/**
- `autoMessages.js` — Aplica variaveis no texto da auto-mensagem · applyVars, getInstanceConfig, wasAutoMsgSentRecently, shouldSendAway, sendAutoMessage
- `metaCapi.js` — Hash padrao Meta: SHA256 lowercase trim · sendCapiEvent, loadLeadForCapi, triggerCapiForStageChange, testCapi

**crm-dashboard\src/**
- `App.tsx` — default:App
- `main.tsx`

**crm-dashboard\src\components/**
- `AccountSelector.tsx` — default:AccountSelector
- `DisconnectedInstancesAlert.tsx` — default:DisconnectedInstancesAlert
- `EditTaskModal.tsx` — default:EditTaskModal
- `FilterDropdown.tsx` — Dropdown de multi-selecao com checkboxes — usado em Pipeline e Chat · FilterValue, default:FilterDropdown
- `InstanceAutoMessagesModal.tsx` — default:InstanceAutoMessagesModal
- `MessageMedia.tsx` — default:MessageMedia
- `Sidebar.tsx` — default:Sidebar

**crm-dashboard\src\context/**
- `AccountContext.tsx` — AccountProvider, useAccount
- `AuthContext.tsx` — AuthProvider, useAuth, User
- `SSEContext.tsx` — SSEProvider, useSSE, useSSEStatus

**crm-dashboard\src\hooks/**
- `useIsMobile.ts` — Hook compartilhado pra detectar viewport mobile. Default 640px (sm do Tailwind). · useIsMobile

**crm-dashboard\src\lib/**
- `api.ts` — apiFetch, formatBRL, formatNumber, pctChange, createLeadOrFindExisting, fetchMessageMedia, login, fetchAccounts +2
- `dates.ts` — Parser de timestamps do SQLite que sao gravados em UTC mas sem marcador de timezone. · parseSqlDate, formatTime, formatDate, formatDateTime
- `messageVars.ts` — Single source of truth for message template variables. · applyMessageVars, MESSAGE_VARIABLES, VarContext, VarDoc

**crm-dashboard\src\pages/**
- `BroadcastDetail.tsx` — default:BroadcastDetail
- `Cadences.tsx` — default:Cadences
- `Chat.tsx` — default:Chat
- `Contratos.tsx` — default:Contratos
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
- `TransferRequests.tsx` — default:TransferRequests

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

**dros-sales-site-v2/**
- `_bp-acabamentos-split.js` — Gera duas imagens separadas a partir da fonte:
- `_bp-boleto.js`
- `_bp-cxs-chromakey.js`
- `_bp-cxs-clean.js`
- `_bp-cxs-final.js`
- `_bp-cxs-multiply.js`
- `_bp-cxs-png.js`
- `_bp-cxs-skybg.js`
- `_bp-cxs-tight.js`
- `_bp-cxs.js`
- `_bp-entrega.js`
- `_bp-estoque.js`
- `_bp-extra-images.js` — Otimiza:
- `_bp-hero-img.js` — Otimiza box-paper-img-hero.png pra usar no hero do V8.
- `_bp-hero-mockups.js` — Top-view Pizza Pitzz fechada (mockup limpo, vista superior)
- `_bp-hero-mockups2.js`
- `_bp-hero2.js`
- `_bp-hero3.js` — Otimiza as 3 imagens do hero — alternando entre Pizza Pitzz, Aló Pizza e Leal Pizzas.
- `_bp-replace-images.js` — Replace box-paper images with new professional ones.
- `optimize-images.js` — Otimiza as imagens grandes do site para deploy em produção.

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
- `.playwright-mcp\page-2026-05-21T10-36-17-074Z.yml`
- `.playwright-mcp\page-2026-05-21T10-37-38-341Z.yml`
- `.playwright-mcp\page-2026-05-21T10-39-42-916Z.yml`
- `.playwright-mcp\page-2026-05-21T10-43-18-605Z.yml`
- `.playwright-mcp\page-2026-05-21T10-57-29-309Z.yml`
- `.playwright-mcp\page-2026-05-21T11-06-55-522Z.yml`
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
- `dros-sales-site-v2\package.json`
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
- `CLAUDE.md`
- `client-dashboard\DEPLOY.md`
- `client-dashboard\README.md`
- `CODEBASE_INDEX.md`
- `CONTRIBUTING.md`
- `drive-snap.md`
- `drive-snapshot.md`
- `dros-sales-site-v2\INTEGRACAO-LEADS.md`
- `dros-sales-site-v2\README.md`
- `dros-sales-site\README.md`
- `oxi-pedidos\DEPLOY.md`
- `oxi-pedidos\README.md`
- `oxiquimica-lp\README.md`
- `README.md`
- `skills\README.md`

---
*Index: ~11.2k tokens · Full codebase: ~19.8M tokens · Saves ~100%*
