---
task: "Gerar Ângulos"
order: 1
input: |
  - selected_story: História selecionada com título, fonte, dados e resumo
  - domain_framework: Framework de domínio com os 5 ângulos fundamentais
output: |
  - angles: 5 ângulos distintos com hook de capa, driver emocional e formato recomendado
---

# Gerar Ângulos

Cria 5 ângulos emocionais distintos para a história selecionada. Cada ângulo deve produzir um carrossel completamente diferente — mesma notícia, perspectivas únicas.

## Process

1. Leia a história em `squads/instagram-carousel/output/selected-story.md`.
2. Leia o framework de ângulos em `squads/instagram-carousel/pipeline/data/domain-framework.md` (Fase 2: Geração de Ângulos).
3. Para cada um dos 5 ângulos fundamentais (Medo/Urgência, Oportunidade, Educacional, Contrário, Inspiracional):
   - Identifique qual elemento concreto da história ativa esse ângulo
   - Escreva o hook de capa (máx. 20 palavras) específico para essa história + ângulo
   - Defina o driver emocional principal
   - Recomende o formato de carrossel (baseado na tabela formato × ângulo do framework)
4. Verifique: cada hook de capa é visualmente e textualmente diferente dos outros 4 — se dois forem parecidos, reescrever.

## Output Format

```markdown
# Ângulos para: {título da história}

## Ângulo 1 — Medo/Urgência
**Hook de capa:** {título bold, máx. 20 palavras}
**Driver emocional:** Loss aversion — {elemento específico da história que ativa o medo}
**Formato recomendado:** Problema → Solução
**Por que funciona:** {1 frase explicando a conexão com a história}

## Ângulo 2 — Oportunidade
**Hook de capa:** {título bold, máx. 20 palavras}
**Driver emocional:** Status elevation — {elemento da história que abre janela de oportunidade}
**Formato recomendado:** Editorial/Tese
**Por que funciona:** {1 frase}

## Ângulo 3 — Educacional
**Hook de capa:** {título bold, máx. 20 palavras}
**Driver emocional:** Achievement + Control — {o que o leitor vai dominar/entender}
**Formato recomendado:** Tutorial / Listicle
**Por que funciona:** {1 frase}

## Ângulo 4 — Contrário
**Hook de capa:** {título bold, máx. 20 palavras}
**Driver emocional:** Cognitive dissonance — {crença comum que a história desafia}
**Formato recomendado:** Mito vs Realidade
**Por que funciona:** {1 frase}

## Ângulo 5 — Inspiracional
**Hook de capa:** {título bold, máx. 20 palavras}
**Driver emocional:** Belonging + Future pacing — {transformação que a história representa}
**Formato recomendado:** Storytelling / Antes e Depois
**Por que funciona:** {1 frase}
```

## Quality Criteria

- [ ] Cada hook de capa é único — nenhum pode servir para outro ângulo
- [ ] Cada ângulo usa elemento concreto e específico da história (não genérico)
- [ ] Driver emocional está claramente identificado para cada ângulo
- [ ] Formato recomendado segue a tabela ângulo × formato do domain-framework

## Veto Conditions

1. Dois ou mais hooks de capa são visualmente similares ou intercambiáveis — reescrever os duplicados
2. Algum ângulo usa afirmação que não tem suporte na história-fonte — substituir pelo elemento verificável
