---
id: step-10-review
agent: vera-veredito
execution: inline
label: "Revisão de Qualidade"
inputFile: squads/instagram-carousel/output/carousel-content.md
outputFile: squads/instagram-carousel/output/content-review.md
on_reject: step-06-create-carousel
---

# Revisão de Qualidade — Vera Veredito

Vera Veredito executa as tasks `score-content.md` e `generate-feedback.md` em sequência para avaliar o carrossel completo.

## Input

Leia:
- `squads/instagram-carousel/output/carousel-content.md` (conteúdo completo: slides, legenda, hashtags)
- `squads/instagram-carousel/pipeline/data/quality-criteria.md` (critérios detalhados)
- Imagens PNG em `squads/instagram-carousel/output/slides/` (quando disponíveis)

## Output

Salve a revisão estruturada em:
`squads/instagram-carousel/output/content-review.md`

O arquivo deve conter: veredicto (APROVAR / APROVAR COM AJUSTES / REJEITAR), tabela de scores dos 9 critérios com justificativas, pontos fortes identificados, mudanças requeridas (com instrução específica de execução) e sugestões não-bloqueantes.

## Veto Conditions

1. Vera emitiu veredicto sem ler o conteúdo completo — reler e reavliar
2. Algum score sem justificativa específica — adicionar justificativa antes de entregar
