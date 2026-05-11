---
id: step-06-create-carousel
agent: carlos-carrossel
execution: inline
label: "Criação do Carrossel"
inputFile: squads/instagram-carousel/output/selected-angle.md
outputFile: squads/instagram-carousel/output/carousel-content.md
---

# Criação do Carrossel — Carlos Carrossel

Carlos Carrossel executa as tasks `create-carousel.md` e `optimize-carousel.md` em sequência para produzir o carrossel completo.

## Input

Leia:
- `squads/instagram-carousel/output/selected-story.md` (história com dados verificáveis)
- `squads/instagram-carousel/output/selected-angle.md` (ângulo e tom selecionados)
- `squads/instagram-carousel/pipeline/data/domain-framework.md`
- `squads/instagram-carousel/pipeline/data/anti-patterns.md`
- `squads/instagram-carousel/pipeline/data/quality-criteria.md`
- `_opensquad/_memory/company.md`

## Output

Salve o carrossel completo e otimizado em:
`squads/instagram-carousel/output/carousel-content.md`

O arquivo deve conter todos os slides (título + texto de apoio), legenda completa, hashtags e variante A/B de capa.

## Veto Conditions

1. Qualquer slide ultrapassa 80 palavras — cortar e reescrever
2. Último slide não tem CTA com mecânica de engajamento real (DM ou save) — adicionar
3. Legenda não tem hook nos primeiros 125 caracteres — reescrever abertura
4. Algum dado ou número no carrossel não está presente na história-fonte — remover ou substituir
