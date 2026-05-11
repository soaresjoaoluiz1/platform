---
id: step-08-design-slides
agent: daniela-design
execution: inline
label: "Design dos Slides"
inputFile: squads/instagram-carousel/output/carousel-content.md
outputFile: squads/instagram-carousel/output/slides/slide-01.html
---

# Design dos Slides — Daniela Design

Daniela Design executa as tasks `design-slides.md` e `render-slides.md` em sequência para criar os slides visuais do carrossel.

## Input

Leia:
- `squads/instagram-carousel/output/carousel-content.md` (conteúdo textual aprovado)
- `_opensquad/_memory/company.md` (identidade visual da empresa cliente)

## Output

Gere os arquivos HTML em:
`squads/instagram-carousel/output/slides/slide-NN.html`

Renderize os PNGs em:
`squads/instagram-carousel/output/slides/slide-NN.png`

## Processo Obrigatório

1. Definir sistema de design (paleta, tipografia, espaçamento)
2. Gerar HTML do slide 1 (capa)
3. **Renderizar e verificar slide 1 antes de continuar**
4. Gerar HTMLs de todos os slides restantes
5. Renderizar todos os slides em PNG (1080×1440px)
6. Verificar contraste WCAG AA em cada slide

## Veto Conditions

1. Algum texto não atinge contraste WCAG AA (razão < 4.5:1) — corrigir antes de entregar
2. Algum elemento ultrapassa os limites do viewport 1080×1440px — ajustar layout
3. Slides contêm numeração de posição (ex: "3/8") — remover
