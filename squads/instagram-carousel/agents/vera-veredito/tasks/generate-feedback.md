---
task: "Gerar Feedback Estruturado"
order: 2
input: |
  - score_table: Tabela de scores com justificativas e veredicto preliminar
output: |
  - content_review: Relatório completo com veredicto final, pontos fortes, mudanças requeridas e sugestões
---

# Gerar Feedback Estruturado

Transforma a tabela de scores em um relatório de feedback acionável. Cada ponto de feedback tem instrução de execução — sem ambiguidade.

## Process

1. A partir da tabela de scores da task anterior:
2. **Pontos fortes** (scores ≥ 8.0): identificar o que está funcionando bem e por quê. Mínimo 2 pontos fortes, mesmo em rejeições — o produtor precisa saber o que manter.
3. **Mudanças requeridas** (scores < 7.0 OU gatilhos críticos ativados): para cada um:
   - Citar o trecho exato com problema
   - Descrever o impacto objetivo do problema
   - Dar a instrução específica de execução (não "melhore X" — diga exatamente o que fazer)
4. **Sugestões não-bloqueantes** (scores 7.0–8.9): listar como recomendações, deixando claro que não bloqueiam aprovação.
5. **Caminho para aprovação** (apenas em REJEITAR): listar em ordem de prioridade as mudanças que, se feitas, levariam o carrossel a APROVAR.
6. Confirmar o veredicto final com base na tabela de scores.

## Output Format

```markdown
# Revisão de Conteúdo — Vera Veredito

**Veredicto:** {APROVAR / APROVAR COM AJUSTES / REJEITAR}
**Score geral:** {média}/10
**Ciclo:** {N}
**Data:** {data}

---

## Pontos Fortes

**Ponto forte:** {o que está funcionando}
**Referência:** {slide N / legenda: "trecho citado"}
**Por quê funciona:** {análise objetiva}

[mínimo 2 pontos fortes]

---

## Mudanças Requeridas

{Se nenhuma: "Nenhuma mudança requerida — todos os critérios acima de 7.0."}

**Mudança requerida:** {critério N — nome do critério}
**Referência:** {slide N, linha X: "trecho exato com problema"}
**Impacto:** {consequência objetiva do problema}
**Instrução:** {o que fazer exatamente — específico e executável}

[repetir para cada mudança requerida]

---

## Sugestões (Não-Bloqueantes)

{Se nenhuma: "Nenhuma sugestão adicional."}

**Sugestão:** {critério N}
**Referência:** {trecho}
**Recomendação:** {o que poderia melhorar — opcional implementar}

---

## Caminho para Aprovação

{Apenas se veredicto = REJEITAR}

Para transformar este carrossel em APROVAR, priorizar nesta ordem:
1. {mudança mais crítica — critério crítico com score < 4.0}
2. {segunda mudança mais impactante}
3. {terceira, se houver}

Após essas correções, a média projetada seria ≥ 7.0 sem gatilhos críticos ativos.
```

## Quality Criteria

- [ ] Mínimo 2 pontos fortes identificados com referência específica
- [ ] Cada mudança requerida tem trecho citado + impacto + instrução executável
- [ ] Sugestões claramente marcadas como não-bloqueantes
- [ ] Caminho para aprovação presente em todo veredicto REJEITAR
- [ ] Veredicto final consistente com a tabela de scores

## Veto Conditions

1. Veredicto REJEITAR sem "Caminho para Aprovação" — adicionar antes de entregar
2. Instrução de correção vaga ("melhore", "revise", "ajuste") — especificar o que exatamente fazer
