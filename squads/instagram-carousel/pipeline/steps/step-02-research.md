---
id: step-02-research
agent: renata-rastreio
execution: subagent
model_tier: powerful
label: "Pesquisa de Notícias"
inputFile: squads/instagram-carousel/output/research-focus.md
outputFile: squads/instagram-carousel/output/news-ranking.md
---

# Pesquisa de Notícias — Renata Rastreio

Renata Rastreio executa a pesquisa completa em duas tasks sequenciais:

1. **find-news** — Busca 8–12 histórias relevantes sobre o tema com dados verificáveis
2. **rank-stories** — Ranqueia as histórias por potencial de carrossel usando o sistema de score (save × 0.4 + relevância × 0.35 + visual × 0.25)

## Input

Leia o arquivo de foco definido no checkpoint anterior:
`squads/instagram-carousel/output/research-focus.md`

## Output

Salve o ranking completo em:
`squads/instagram-carousel/output/news-ranking.md`

## Veto Conditions

1. Menos de 5 histórias encontradas — ampliar escopo e refazer
2. Nenhuma história com score composto ≥ 6.0 no ranking final
