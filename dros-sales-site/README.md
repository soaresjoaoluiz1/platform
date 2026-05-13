# DROS Sales — Site Institucional

Site institucional de DROS Sales, focado no novo posicionamento: **canal de vendas para indústria**.

## Stack

HTML5 + CSS3 puro, sem framework. Inter via Google Fonts.

## Estrutura

```
dros-sales-site/
├── index.html        # Página única com 14 seções
├── styles.css        # Design tokens + componentes
├── assets/
│   ├── img/          # Fotos (hero, case, depoimentos)
│   └── icons/        # Logos de clientes
└── README.md
```

## Design tokens

| Token | Valor |
|---|---|
| Background base | `#0a1018` |
| Background alt | `#0e1620` |
| Accent | `#ffb300` |
| Texto | `#ffffff` |
| Fonte | Inter (400–900) |
| Container | 1140px |

## Rodar localmente

Qualquer servidor estático funciona. Exemplos:

```bash
# Node (sem dependências, já instalado)
node c:/tmp/dros-server.js
# abre em http://localhost:8765

# OU com npx (precisa rede)
npx serve dros-sales-site
```

Para abrir direto pelo Windows Explorer, dois cliques em `index.html` também funciona.

## Imagens a fornecer

Substitua os placeholders nos paths abaixo:

### Críticos (sem eles o site parece incompleto)
- `assets/img/hero-industria.jpg` — bg do hero (dono em chão de fábrica, 1920×1080+)
- `assets/img/quimiprol-fachada.jpg` — case principal (fachada + caminhão, 1200×900+)

### Logos de clientes (6 PNGs com fundo transparente, altura ~80px)
- `assets/icons/cliente-ask.svg`
- `assets/icons/cliente-invista.svg`
- `assets/icons/cliente-renove.svg`
- `assets/icons/cliente-suprema.svg`
- `assets/icons/cliente-quimiprol.svg`
- `assets/icons/cliente-doorgrill.svg`

> Substituir os `<span class="logo-ph">` por `<img src="assets/icons/cliente-XXX.svg" alt="...">`

### Depoimentos (avatares circulares, ~200×200)
- `assets/img/rodri.jpg` — Rodri, CEO DoorGrill
- `assets/img/welliton.jpg` — Welliton, Suprema Alimentos *(opcional)*
- `assets/img/ramon.jpg` — Ramon, ASK Equipamentos *(opcional)*

> Substituir os `<div class="author-avatar">R</div>` por `<div class="author-avatar"><img src="assets/img/rodri.jpg" alt="Rodri"></div>`

### Logo DROS Sales
- `assets/img/logo-dros-sales.svg` — versão para fundo escuro

> Substituir os `<span class="logo-mark">D</span>` por `<img src="assets/img/logo-dros-sales.svg" alt="DROS Sales">`

## Conteúdo a finalizar

- WhatsApp: número real (footer + CTAs)
- E-mail: endereço real (footer)
- Links das âncoras `#cases` e `#conteudos` apontam para o que existir quando essas páginas forem criadas

## Notas editoriais

- O site é **institucional**, não landing page agressiva.
- CTA principal é **"Falar com a DROS"** (não "Quero um diagnóstico").
- **Faturamento da Quimiprol não é exposto** — case usa metros², revendedores e tempo de parceria.
- Dados de mercado (PIB, arrecadação, Sondagem CNI) têm fonte visível.

## Deploy

Hospede em qualquer servidor estático (cPanel, Vercel, Netlify, S3+CloudFront, GitHub Pages). Não há build step.
