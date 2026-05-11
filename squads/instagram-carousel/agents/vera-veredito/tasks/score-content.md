---
task: "Pontuar Conteúdo"
order: 1
input: |
  - carousel_content: Conteúdo completo — slides, legenda e hashtags
  - quality_criteria: Critérios detalhados com definições e exemplos
  - slide_pngs: Imagens renderizadas dos slides (quando disponíveis)
output: |
  - score_table: Tabela com scores dos 9 critérios, justificativas e veredicto preliminar
---

# Pontuar Conteúdo

Lê o carrossel completo e pontua cada um dos 9 critérios com justificativa específica. Nenhum score sem razão — nenhuma razão sem trecho citado.

## Process

**Regra absoluta:** Ler o conteúdo completo ANTES de pontuar qualquer critério.

1. Leia `squads/instagram-carousel/output/carousel-content.md` do início ao fim.
2. Leia `squads/instagram-carousel/pipeline/data/quality-criteria.md` para os critérios detalhados.
3. Se disponíveis, revise os PNGs em `squads/instagram-carousel/output/slides/`.
4. Pontue cada critério de 0 a 10, com justificativa específica:
   - Cite o trecho exato que embasou o score (slide N, linha X: "...texto...")
   - Para scores ≥ 8.0: identificar o que impede o 10
   - Para scores < 7.0: identificar a mudança exata necessária para chegar a 7.0+
5. Verifique os gatilhos críticos:
   - Capa (critério 1) < 4.0 → REJEITAR automático
   - Proposta de Valor (critério 2) < 4.0 → REJEITAR automático
   - CTA (critério 6) < 4.0 → REJEITAR automático
   - Hook da Legenda (critério 7) < 4.0 → REJEITAR automático
6. Calcule a média geral (soma dos scores / 9).
7. Determine o veredicto preliminar:
   - Média ≥ 7.0 E nenhum critério < 4.0 → APROVAR
   - Média ≥ 7.0 E critérios não-críticos entre 4.0–6.9 → APROVAR COM AJUSTES
   - Média < 7.0 OU qualquer critério crítico < 4.0 → REJEITAR

## Output Format

```markdown
# Score do Carrossel — Vera Veredito

**Data da revisão:** {data}
**Ciclo de revisão:** {N} (rastrear entre revisões do mesmo carrossel)

## Tabela de Scores

| # | Critério | Peso | Score | Gatilho crítico |
|---|----------|------|-------|-----------------|
| 1 | Slide de Capa — Hook Visual e Textual | Alto | {0-10} | {✅ OK / ❌ REJEITAR} |
| 2 | Proposta de Valor — Vale o Save? | Muito alto | {0-10} | {✅ OK / ❌ REJEITAR} |
| 3 | Fluxo Narrativo | Alto | {0-10} | — |
| 4 | Hierarquia Visual | Médio | {0-10} | — |
| 5 | Densidade de Texto 40–80 palavras | Médio | {0-10} | — |
| 6 | Slide de CTA — Específico e Ativo | Alto | {0-10} | {✅ OK / ❌ REJEITAR} |
| 7 | Hook da Legenda — Primeiros 125 Chars | Alto | {0-10} | {✅ OK / ❌ REJEITAR} |
| 8 | Legenda — Estrutura e CTA Final | Médio | {0-10} | — |
| 9 | Hashtags — Mix e Quantidade | Baixo | {0-10} | — |

**Média geral:** {média}/10
**Veredicto preliminar:** {APROVAR / APROVAR COM AJUSTES / REJEITAR}

## Justificativas

### Critério 1 — Slide de Capa
**Score:** {N}/10
**Referência:** Slide 1: "{texto citado}"
**Justificativa:** {por que esse score — específico ao conteúdo}
{Se < 7.0: **O que falta para 7.0+:** {instrução específica}}

[... demais critérios no mesmo formato ...]
```

## Quality Criteria

- [ ] Conteúdo completo lido antes de qualquer score
- [ ] Cada score tem referência ao trecho específico
- [ ] Cada score < 7.0 tem instrução de correção
- [ ] Gatilhos críticos verificados e documentados
- [ ] Média calculada corretamente

## Veto Conditions

1. Algum score sem justificativa e sem citação de trecho — adicionar antes de entregar
2. Veredicto não segue as regras de decisão (média e gatilhos) — recalcular
