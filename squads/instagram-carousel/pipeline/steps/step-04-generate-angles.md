---
id: step-04-generate-angles
agent: carlos-carrossel
execution: inline
label: "Geração de Ângulos"
inputFile: squads/instagram-carousel/output/selected-story.md
outputFile: squads/instagram-carousel/output/angles.md
---

# Geração de Ângulos — Carlos Carrossel

Carlos Carrossel executa a task `generate-angles.md` para criar 5 ângulos distintos para a história selecionada.

## Input

Leia a história selecionada em:
`squads/instagram-carousel/output/selected-story.md`

Leia também:
- `squads/instagram-carousel/pipeline/data/domain-framework.md`
- `squads/instagram-carousel/pipeline/data/tone-of-voice.md`

## Output

Salve os ângulos gerados em:
`squads/instagram-carousel/output/angles.md`

## Veto Conditions

1. Dois ou mais ângulos teriam o mesmo hook de capa — não são ângulos distintos, refazer
2. Algum ângulo não tem driver emocional claramente identificável — refazer o ângulo específico
