# Dros — Sistemas Internos

Repositório dos sistemas internos da Agência DROS. Esse repo contém dois sistemas que compartilham infraestrutura e são deployados separadamente em produção.

## Sistemas

### Hub — `agency-hub/`

Sistema de gestão da agência: clientes, contas, tarefas com workflow editorial completo (briefing → aprovação → publicação), aprovações de cliente, financeiro (DRE, despesas, parcelamentos) e calendário de gravações.

- **Stack:** Node 16 + Express 5 + SQLite (better-sqlite3) + React 19 + Vite 6 + TypeScript
- **Realtime:** Server-Sent Events (SSE)
- **Produção:** https://drosagencia.com.br/hub
- **Docs:** [agency-hub/README.md](agency-hub/README.md) · [agency-hub/DEPLOY.md](agency-hub/DEPLOY.md) · [agency-hub/.env.example](agency-hub/.env.example)

### Painel de Performance — `client-dashboard/`

Dashboard para clientes visualizarem performance de campanhas. Consolida métricas de Meta Ads, Google Ads e vendas via Kiwify em um único painel, com gráficos e funil de qualificação de leads.

- **Stack:** Node 16 + Express 5 + SQLite (better-sqlite3) + React 19 + Vite 6 + TypeScript
- **Integrações:** Meta Marketing API, Google Ads API, Kiwify
- **Produção:** https://drosagencia.com.br/core
- **Docs:** [client-dashboard/README.md](client-dashboard/README.md) · [client-dashboard/DEPLOY.md](client-dashboard/DEPLOY.md) · [client-dashboard/.env.example](client-dashboard/.env.example)

## Estrutura

| Pasta | O que é |
|---|---|
| `agency-hub/` | Código do Hub |
| `client-dashboard/` | Código do Painel de Performance |
| Outras (`_opensquad/`, `_scripts/`, etc.) | Ferramentas e workspace local de dev — não fazem parte do deploy de produção |

## Infra

Ambos rodam em VPS HostGator (CentOS 7, Node 16, Apache/cPanel como proxy reverso) em portas e processos PM2 separados. Detalhes específicos em cada `DEPLOY.md`.
