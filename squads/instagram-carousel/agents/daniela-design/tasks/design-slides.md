---
task: "Criar Sistema de Design e HTMLs"
order: 1
input: |
  - carousel_content: Conteúdo aprovado com todos os slides, títulos e textos de apoio
  - company_context: Contexto da empresa para calibrar identidade visual
output: |
  - slide_htmls: Arquivos HTML para cada slide (slide-01.html, slide-02.html, ...)
  - design_system: Documentação do sistema de cores, tipografia e espaçamento aplicado
---

# Criar Sistema de Design e HTMLs

Define o sistema visual do carrossel e gera os arquivos HTML para cada slide. O slide 1 é sempre verificado antes de prosseguir com os demais.

## Process

### Fase 1 — Sistema de Design

1. Leia `squads/instagram-carousel/output/carousel-content.md` para entender o volume e estrutura do conteúdo.
2. Leia `_opensquad/_memory/company.md` para extrair identidade visual do cliente (se disponível).
3. Defina o sistema de design:
   - **Paleta** (máx. 5 cores): cor primária, secundária, acento, texto claro, texto escuro
   - **Tipografia**: família Google Fonts (Inter ou Poppins como padrão), tamanhos por papel:
     - Hero: ≥ 58px (hooks de capa)
     - Heading: ≥ 43px (títulos de slides)
     - Body: ≥ 34px (texto de apoio)
     - Caption: ≥ 24px (elementos secundários)
   - **Espaçamento base**: padding interno dos slides
   - **Alternância de fundos**: sequência claro/escuro/accent para criar ritmo visual

### Fase 2 — HTML do Slide 1 (Capa)

Gere o HTML do slide 1 com estas regras absolutas:
- `body`: `width: 1080px; height: 1440px; overflow: hidden; margin: 0; padding: 0`
- Fontes via `@import` do Google Fonts — sem arquivos externos
- CSS inline apenas — sem arquivos `.css` separados
- Layout com Grid ou Flexbox (não position absolute como estrutura primária)
- Hook de capa em destaque máximo (peso ≥ 700, tamanho ≥ 58px)

### Fase 3 — Verificação do Slide 1

**OBRIGATÓRIO**: Após gerar o HTML do slide 1, verificar visualmente antes de continuar.

Anunciar: "🎨 Daniela Design — Slide 1 (capa) gerado. Verificando antes de prosseguir com os demais..."

Checklist de verificação do slide 1:
- [ ] Viewport 1080×1440px respeitado
- [ ] Fontes carregam corretamente (URL do Google Fonts no `@import`)
- [ ] Contraste do texto principal ≥ 4.5:1 (WCAG AA)
- [ ] Hierarquia tipográfica visível (hero > heading > body)
- [ ] Nenhum elemento cortado ou fora do viewport

Só avançar para os demais slides após essa verificação.

### Fase 4 — HTMLs dos Demais Slides

Gere um arquivo HTML para cada slide restante usando o mesmo sistema de design.

Para cada slide:
- Aplique a alternância de fundos definida no sistema de design
- Reproduza a hierarquia dupla do conteúdo (título bold + texto de apoio)
- Palavras-chave em cor de acento quando houver destaque semântico
- Nunca incluir numeração de posição (ex: "3/8", "slide 3 de 8")

## Output Format

Gere os arquivos em `squads/instagram-carousel/output/slides/`:
- `slide-01.html`, `slide-02.html`, ..., `slide-NN.html`

Ao final, documente o sistema de design:

```markdown
# Sistema de Design — {nome do cliente}

## Paleta de Cores
- Primária: {hex} — {uso}
- Secundária: {hex} — {uso}
- Acento: {hex} — {uso}
- Texto claro: {hex}
- Texto escuro: {hex}

## Tipografia
- Família: {nome da fonte}
- Hero: {px}px / weight {peso}
- Heading: {px}px / weight {peso}
- Body: {px}px / weight {peso}

## Alternância de Fundos
{sequência de fundos por slide: ex. slide 1: escuro, slide 2: claro, slide 3: acento...}

## Slides Gerados
{lista de arquivos criados}
```

## Quality Criteria

- [ ] Sistema de design documentado antes de gerar os slides
- [ ] Slide 1 verificado visualmente antes dos demais
- [ ] Todos os textos com contraste WCAG AA (≥ 4.5:1)
- [ ] Nenhum elemento ultrapassa viewport 1080×1440px
- [ ] Fontes carregam via Google Fonts `@import`
- [ ] Tipografia respeita escalas mínimas
- [ ] Nenhum slide contém numeração de posição

## Veto Conditions

1. Slide 1 não verificado antes de gerar os demais — verificar e corrigir antes de continuar
2. Algum arquivo HTML tem dependência externa além de Google Fonts — remover e tornar autossuficiente
