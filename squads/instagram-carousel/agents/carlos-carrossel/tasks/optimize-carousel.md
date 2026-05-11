---
task: "Otimizar Carrossel"
order: 3
input: |
  - carousel_draft: Rascunho completo do carrossel (slides, legenda, hashtags)
output: |
  - carousel_final: Carrossel otimizado após stress test de 4 filtros, com carousel-content.md pronto para design
---

# Otimizar Carrossel

Aplica o stress test de 4 filtros em todo o carrossel e entrega a versão final otimizada. Esta task não adiciona conteúdo — ela remove fricção e fortalece o que já existe.

## Process

### Stress Test — 4 Filtros

Percorra cada slide e a legenda aplicando os 4 filtros em sequência:

**Filtro 1 — Teste do Cético**
> "Tem prova para essa afirmação?"

Para cada claim nos slides: verificar se há dado verificável da história-fonte como suporte. Se não tem prova, remover ou reformular como opinião explícita.

**Filtro 2 — Teste de Inflação**
> "Essa afirmação está exagerada?"

Identificar palavras de inflação: "incrível", "revolucionário", "transformador", "nunca antes visto", "único". Se encontradas, substituir por linguagem específica com dado concreto.

**Filtro 3 — Teste de Fricção**
> "Tem palavra desnecessária que torna a leitura mais difícil?"

Percorrer cada slide contando palavras. Eliminar: advérbios redundantes, qualificadores vagos, repetições de ideia já expressa. Meta: cada frase deve ser necessária.

**Filtro 4 — Teste do Personagem**
> "O público se reconhece nesse conteúdo?"

Verificar se o leitor-alvo do cliente aparece explícita ou implicitamente nos slides. Ajustar referências se necessário para maximizar identificação.

### Finalização

Após o stress test:
1. Reescrever os trechos que falharam em algum filtro
2. Verificar que a variante A/B de capa ainda está presente
3. Confirmar que nenhuma mudança quebrou a contagem de palavras (40–80 por slide)
4. Salvar como arquivo final

## Output Format

O output é o arquivo `carousel-content.md` com o carrossel completo e otimizado, no mesmo formato do rascunho, com uma seção adicional ao final:

```markdown
---

## Notas de Otimização

**Filtro 1 (Cético):** {O que foi verificado ou ajustado}
**Filtro 2 (Inflação):** {Palavras removidas ou substituídas, se houver}
**Filtro 3 (Fricção):** {Palavras/frases cortadas, contagem antes→depois por slide}
**Filtro 4 (Personagem):** {Ajustes de identificação do público, se houver}
```

## Quality Criteria

- [ ] Todos os 4 filtros aplicados e documentados
- [ ] Nenhum slide passou de 80 palavras após os cortes
- [ ] Variante A/B de capa mantida no output final
- [ ] Nenhum dado adicionado na otimização — apenas remoção de fricção e ajuste do que já existia

## Veto Conditions

1. Filtros aplicados mas não documentados — documentar antes de entregar
2. Conteúdo novo adicionado na otimização que não estava na história-fonte — remover
