---
task: "Criar Carrossel"
order: 2
input: |
  - selected_story: História com dados verificáveis
  - selected_angle: Ângulo escolhido com hook, driver emocional e formato
  - tone_of_voice: Tom selecionado pelo usuário
output: |
  - carousel_draft: 8–10 slides com título + texto de apoio, legenda completa, hashtags e variante A/B de capa
---

# Criar Carrossel

Constrói o carrossel completo slide a slide, seguindo o ângulo e tom selecionados. Todo dado usado deve estar presente na história-fonte.

## Process

1. Leia:
   - `squads/instagram-carousel/output/selected-story.md`
   - `squads/instagram-carousel/output/selected-angle.md`
   - `squads/instagram-carousel/pipeline/data/domain-framework.md` (Fase 3: Estrutura do Carrossel)
   - `squads/instagram-carousel/pipeline/data/anti-patterns.md`

2. **Slide 1 — Capa:**
   - Use o hook de capa do ângulo selecionado como ponto de partida
   - Refine para máx. 20 palavras, bold e impactante
   - Teste mentalmente: "Eu pararia o scroll por isso?"
   - Gere também uma variante A/B (segunda opção de hook para teste)

3. **Slides 2–(N-1) — Desenvolvimento:**
   - Uma ideia por slide
   - Hierarquia dupla: **Título em negrito** (claim/afirmação) + texto de apoio (evidência/contexto)
   - 40–80 palavras totais por slide
   - Cada slide termina com tensão implícita que convida ao próximo
   - Aplique o tom de voz selecionado de forma consistente

4. **Slide Final — CTA:**
   - Ação única e específica
   - Use apenas: "Comenta [PALAVRA] que te mando no DM" ou "Salva esse carrossel"
   - Nunca: "Curte e comenta", "Me segue", CTAs genéricos

5. **Legenda:**
   - Parágrafo 1: Hook (máx. 125 caracteres, completo e independente)
   - Parágrafos 2–4: Corpo com line breaks agressivos (máx. 3 linhas por bloco)
   - Parágrafo final: Pergunta aberta + CTA de engajamento
   - Máx. 2.200 caracteres totais

6. **Hashtags:**
   - 3–5 nicho (< 500K posts)
   - 3–5 médio alcance (500K–5M posts)
   - 2–3 broad (> 5M posts)
   - Total: 8–15 hashtags

## Output Format

```markdown
# Carrossel — {título da história}

**Ângulo:** {ângulo selecionado}
**Tom:** {tom selecionado}
**Formato:** {formato do carrossel}

---

## Slide 1 — Capa

**Título:** {hook principal}
**Variante A/B:** {hook alternativo para teste}

---

## Slide 2

**Título:** {claim em negrito}

{texto de apoio — evidência ou contexto da história}

---

## Slide 3

**Título:** {claim em negrito}

{texto de apoio}

---

[... demais slides ...]

---

## Slide {N} — CTA

**Título:** {chamada de ação visual}

{CTA com mecânica real — DM keyword ou save}

---

## Legenda

{hook de 125 caracteres}

{corpo da legenda com line breaks}

{pergunta aberta}

{CTA de engajamento}

---

## Hashtags

{lista de hashtags}
```

## Quality Criteria

- [ ] Hook de capa para o scroll — testado mentalmente
- [ ] Todos os slides têm hierarquia dupla (título + apoio)
- [ ] Nenhum slide ultrapassa 80 palavras
- [ ] Legenda tem hook nos primeiros 125 caracteres
- [ ] CTA do último slide tem mecânica real (DM keyword ou save)
- [ ] Tom aplicado de forma consistente em todos os slides e legenda
- [ ] Nenhum dado sem fonte rastreável à história selecionada

## Veto Conditions

1. Algum slide ultrapassa 80 palavras — cortar antes de entregar
2. CTA do último slide é genérico ("curte e comenta", "me segue") — substituir por mecânica real
3. Algum número ou percentual não está presente na história-fonte — remover ou substituir por dado verificável
