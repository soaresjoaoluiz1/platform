---
task: "Ranquear Histórias"
order: 2
input: |
  - raw_stories: Lista de histórias brutas do task anterior (find-news.md)
  - company_context: Perfil da empresa em _opensquad/_memory/company.md
output: |
  - ranked_stories: Top 5 histórias ranqueadas por potencial de carrossel, com justificativa
---

# Ranquear Histórias

Avalia e ranqueia as histórias encontradas pelo potencial de gerar um carrossel de alto engajamento para o perfil do cliente.

## Process

1. Para cada história da lista bruta, avaliar em 3 dimensões:
   - **Potencial de save** (1-10): A história entrega um framework, dado ou insight que vale salvar para consultar depois?
   - **Relevância para o público** (1-10): O público do cliente vai se identificar, se preocupar ou se importar com essa história?
   - **Potencial visual** (1-10): A história tem dados, comparações, processo ou antes/depois que se traduz bem em slides de carrossel?

2. Calcular o score composto para cada história:
   `score = (save × 0.4) + (relevância × 0.35) + (visual × 0.25)`

3. Selecionar as top 5 histórias com maior score composto.

4. Para cada história no top 5, identificar:
   - O ângulo emocional mais forte: Medo / Oportunidade / Educacional / Contrário / Inspiracional
   - O formato de carrossel mais adequado: Editorial, Listicle, Tutorial, Mito vs Realidade, Antes e Depois, Storytelling, Problema → Solução
   - A janela de relevância estimada: horas / dias / semanas / evergreen

5. Formatar o output para apresentação ao usuário no próximo checkpoint (seleção de pauta).

## Output Format

```yaml
ranked_stories:
  - rank: 1
    title: "Título da história"
    source: "Fonte"
    url: "https://..."
    date: "YYYY-MM-DD"
    summary: "Resumo em 1 frase"
    scores:
      save_potential: 9
      audience_relevance: 8
      visual_potential: 8
      composite: 8.55
    strongest_angle: "Oportunidade"
    recommended_format: "Editorial/Tese"
    relevance_window: "evergreen"
    why_top: "Justificativa em 1-2 frases de por que essa história lidera o ranking"
```

## Output Example

> Use como referência de qualidade, não como template rígido.

```yaml
ranked_stories:
  - rank: 1
    title: "Pesquisa MIT: trabalhadores que usam IA produzem 40% mais"
    source: "MIT Technology Review"
    url: "https://technologyreview.mit.edu/..."
    date: "2026-03-20"
    summary: "Experimento com 758 profissionais: IA aumentou produtividade em 40% e qualidade em 18%"
    scores:
      save_potential: 9
      audience_relevance: 9
      visual_potential: 8
      composite: 8.75
    strongest_angle: "Oportunidade"
    recommended_format: "Editorial/Tese"
    relevance_window: "evergreen"
    why_top: "Dado concreto de fonte altamente credível com relevância direta para profissionais. Alto potencial de save porque entrega prova de que IA funciona — sem opinião, com evidência."

  - rank: 2
    title: "McKinsey: 30% dos empregos serão automatizados até 2030"
    source: "Valor Econômico"
    url: "https://valor.globo.com/..."
    date: "2026-03-22"
    summary: "Estudo projeta automação de 30% das ocupações no Brasil até 2030"
    scores:
      save_potential: 8
      audience_relevance: 8
      visual_potential: 9
      composite: 8.25
    strongest_angle: "Medo/Urgência"
    recommended_format: "Problema → Solução"
    relevance_window: "semanas"
    why_top: "Dado impactante com ângulo de urgência forte. Público vai salvar para mostrar para colegas. Potencial visual excelente: porcentagens e comparações entre categorias de ocupação."
```

## Quality Criteria

- [ ] Exatamente 5 histórias no ranking final
- [ ] Score composto calculado explicitamente usando a fórmula especificada para cada história
- [ ] Cada história tem ângulo emocional e formato de carrossel recomendado
- [ ] Janela de relevância explicitada para todas as histórias
- [ ] Campo "why_top" com justificativa específica baseada em critérios objetivos, não genérica

## Veto Conditions

Rejeitar e refazer se QUALQUER condição for verdadeira:
1. Menos de 5 histórias no output — se o input tiver menos de 5, retornar ao task find-news.md e refazer
2. Alguma história no ranking sem score composto calculado explicitamente com os três sub-scores
