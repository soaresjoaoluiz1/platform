---
task: "Encontrar Notícias"
order: 1
input: |
  - topic: Tema de pesquisa definido pelo usuário no checkpoint
  - time_range: Janela de tempo selecionada (últimas 24h / 7 dias / mês / sem restrição)
output: |
  - raw_stories: Lista de 8-12 histórias encontradas com título, fonte, URL, data e resumo
---

# Encontrar Notícias

Busca web sistemática para encontrar as histórias mais relevantes e com maior potencial de carrossel sobre o tema especificado.

## Process

1. Leia o arquivo `squads/instagram-carousel/output/research-focus.md` para extrair o tema e a janela de tempo.

2. Execute 3-4 buscas web usando variações do tema:
   - Busca 1: "{tema} 2025" ou "{tema} {mês atual}"
   - Busca 2: "{tema} tendências" ou "{tema} pesquisa"
   - Busca 3: "{tema} Brasil" (para contexto local)
   - Busca 4: "{tema} dados" ou "{tema} estudo" (para validação com dados concretos)

3. Para cada resultado promissor, faça web_fetch na URL para:
   - Confirmar que a história é real e verificável
   - Extrair dados concretos (números, pesquisas, especialistas citados)
   - Identificar a data exata de publicação

4. Compile uma lista de 8-12 histórias encontradas com todos os metadados necessários.

## Output Format

```yaml
topic: "tema pesquisado"
time_range: "janela de tempo"
stories_found: 10
stories:
  - id: 1
    title: "Título da história"
    source: "Nome da publicação"
    url: "https://..."
    date: "YYYY-MM-DD"
    summary: "Resumo em 2-3 frases do que a história é sobre"
    data_points: ["dado 1 com número", "dado 2 com número"]
```

## Output Example

> Use como referência de qualidade, não como template rígido.

```yaml
topic: "inteligência artificial no trabalho"
time_range: "últimos 7 dias"
stories_found: 10
stories:
  - id: 1
    title: "McKinsey: 30% dos empregos serão automatizados até 2030 no Brasil"
    source: "Valor Econômico"
    url: "https://valor.globo.com/..."
    date: "2026-03-22"
    summary: "Relatório da McKinsey atualizado projeta que 30% das ocupações brasileiras terão mais da metade de suas tarefas automatizadas até 2030. O estudo analisou 800 ocupações e identificou que funções administrativas e operacionais são as mais vulneráveis, enquanto papéis criativos e relacionais têm menor risco."
    data_points:
      - "30% dos empregos com >50% das tarefas automatizáveis até 2030"
      - "800 ocupações analisadas"
      - "funções administrativas: risco mais alto"

  - id: 2
    title: "Pesquisa MIT: trabalhadores que usam IA produzem 40% mais em menos tempo"
    source: "MIT Technology Review"
    url: "https://technologyreview.mit.edu/..."
    date: "2026-03-20"
    summary: "Experimento controlado com 758 profissionais mostrou que uso de IA generativa aumentou produtividade em 40% e qualidade do output em 18% comparado ao grupo controle. O efeito foi maior entre profissionais com menos de 5 anos de experiência."
    data_points:
      - "40% de aumento de produtividade"
      - "18% de melhora na qualidade"
      - "758 profissionais no estudo"
      - "maior impacto em profissionais com < 5 anos de experiência"
```

## Quality Criteria

- [ ] Cada história tem URL verificável e data de publicação confirmada
- [ ] Mínimo de 8 histórias encontradas no total
- [ ] Cada história tem pelo menos 1 dado concreto (número, percentual ou fonte nomeada)
- [ ] Todas as histórias respeitam a janela de tempo definida pelo usuário

## Veto Conditions

Rejeitar e refazer se QUALQUER condição for verdadeira:
1. Alguma história não tem URL verificável ou a URL retorna erro de acesso
2. Menos de 5 histórias encontradas após 4 buscas distintas — ampliar escopo e refazer
