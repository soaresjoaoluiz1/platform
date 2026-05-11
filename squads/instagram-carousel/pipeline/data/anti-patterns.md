# Anti-Patterns — Instagram Carousel Squad

## Padrões que Destroem Performance

Este documento lista erros específicos a NUNCA cometer na produção de carrosséis.
Baseado em análise de conteúdo de baixo desempenho e boas práticas do mercado PT-BR.

---

## Anti-Patterns de Conteúdo

### 1. Slides Superficiais (< 40 palavras)
**Por que mata o conteúdo**: Slides com menos de 40 palavras são manchetes sem corpo.
O leitor vê o título, aprende nada novo, e não salva. O save rate cai porque não houve
entrega de valor real. Sem saves, o algoritmo não redistribui o post.

**Sinal de problema**: "Seja persistente." (1 frase). Ou: "Dica 3: Use hashtags." (sem explicação)

**Correção**: Todo slide deve ter título + texto de suporte com contexto, dado ou exemplo.
"Seja persistente." → "Seja persistente. 87% das contas que ultrapassam 10K seguidores
levaram mais de 18 meses para chegar lá. O que separa quem chega é a consistência
semanal, não o talento."

---

### 2. Slide de Capa Genérico
**Por que mata o conteúdo**: A capa compete com centenas de posts no feed. Uma capa
genérica ("5 dicas para crescer no Instagram") não para o scroll. O algoritmo não
terá chance de mostrar o conteúdo porque o CTR de abertura será baixo.

**Sinal de problema**: Títulos que começam com "5 dicas de...", "Como fazer...", "O que é..."
sem elemento de surprise, urgência ou contradição.

**Correção**: Usar curiosity gap, contradição ou dado específico:
"5 dicas de Instagram" → "O erro que 9 em cada 10 marcas cometem no Instagram (e estão pagando caro)"

---

### 3. CTA Genérico
**Por que mata o conteúdo**: "Curte se gostou" e "Segue o perfil" treinam o algoritmo
a não redistribuir. Curtidas têm o menor peso algorítmico. Sem CTA de save, share ou
comment keyword, o conteúdo morre após a primeira rodada de distribuição.

**Sinal de problema**: CTAs que pedem like, que são vagos ("Compartilha!"), ou que
aparecem apenas na legenda sem nenhum slide de CTA dedicado.

**Correção**: "Comenta [PALAVRA-CHAVE] abaixo que te mando o guia completo no DM." ou
"Salva esse carrossel — você vai querer voltar a esse passo 3."

---

### 4. Hook de Legenda Após o Fold (> 125 chars)
**Por que mata o conteúdo**: O Instagram mostra apenas os primeiros ~125 caracteres
antes do "...mais". Se o hook real só aparece depois, o leitor nunca o vê no feed.
A legenda é invisível para quem não abre o post — e a maioria não abre.

**Sinal de problema**: Legenda começa com "Neste carrossel, vamos falar sobre..." ou
com apresentação do tema antes de qualquer hook.

**Correção**: A primeira frase deve ser o hook. Completo, sozinho, provocador.
"Marketing digital tem mudado muito nos últimos anos e hoje..." → "Sua estratégia de
conteúdo vai falhar em 2026. A não ser que você leia isso."

---

### 5. Slides com Fundo Idêntico em Sequência
**Por que mata o conteúdo**: Fundos iguais em slides consecutivos criam monotonia visual.
O leitor não sabe que avançou para uma informação nova — parece que o conteúdo parou.
A taxa de deslize cai drasticamente após o 3º slide se não houver variação visual.

**Sinal de problema**: Todos os slides com fundo branco; ou todos com fundo escuro.

**Correção**: Alternar systematicamente: claro → escuro → accent → claro → escuro → ...

---

### 6. Slides Sem Hierarquia Visual
**Por que mata o conteúdo**: Texto todo no mesmo tamanho é indistinguível. O leitor
não sabe o que é o claim principal e o que é suporte. A leitura é lenta, a retenção
é baixa. Carrosséis educativos vivem de scannability — sem hierarquia, não há scan.

**Sinal de problema**: Todos os textos em 34px; ou título sem destaque bold.

**Correção**: Título ≥ 43px bold + texto de suporte ≥ 34px medium. Sempre dois níveis
de hierarquia. Nunca um bloco de texto uniforme.

---

### 7. Repetição Entre Slides
**Por que mata o conteúdo**: Cada slide que repete informação do anterior é um slide
que não justifica existir. O leitor percebe a repetição e para de deslizar. A taxa de
deslize até o último slide é o indicador mais forte de qualidade de carrossel.

**Sinal de problema**: Slide 3 diz "Como mencionado no slide anterior..." ou dois slides
consecutivos fazem essencialmente o mesmo ponto.

**Correção**: Cada slide deve avançar a narrativa. Se um slide pode ser removido sem
perda de informação, ele deve ser removido.

---

## Anti-Patterns de Design

### 8. Texto Sobre Imagem Sem Proteção de Contraste
**Por que mata o conteúdo**: Texto diretamente sobre foto sem overlay é ilegível em
muitos contextos. Falha em contraste WCAG AA (4.5:1). Posts ilegíveis são ignorados.

**Correção**: Overlay sólido ≥ 60% de opacidade, gradient overlay claro→transparente,
ou backdrop-filter blur antes de colocar qualquer texto sobre imagem.

---

### 9. Fontes Abaixo do Mínimo para Instagram
**Por que mata o conteúdo**: No mobile (a maioria do consumo do Instagram), texto <34px
é ilegível. O leitor não vai aproximar a tela — vai apenas passar para o próximo post.

**Regra absoluta**:
- Hero (título de capa): mínimo 58px
- Heading (títulos de slides): mínimo 43px
- Body (texto de suporte): mínimo 34px
- Caption (elementos secundários): mínimo 24px

---

### 10. Contador de Slides nas Imagens
**Por que é problema**: O Instagram exibe navegação nativa de carrossel (pontos na base).
Adicionar "7/8" ou "1/7" nas imagens cria redundância visual e ocupa espaço valioso
de conteúdo.

**Correção**: Nunca incluir numeração de slides nas imagens HTML renderizadas.

---

## Anti-Patterns de Copywriting

### 11. Aberturas de Legenda Clichê
Nunca começar a legenda com:
- "Você sabia que..."
- "Neste post, vou te mostrar..."
- "Hoje vamos falar sobre..."
- "No mundo digital de hoje..."
- "É muito importante que..."

Essas aberturas são gatilhos de scroll. O leitor reconhece o padrão em 0,1s e passa.

---

### 12. Promessas Infladas Sem Evidência
Nunca fazer claims sem dados ou exemplos:
- "O método infalível para triplicar seu alcance" — sem provas
- "A estratégia que todo mundo está usando" — vago
- "Resultados garantidos" — sem especificidade

Substituir por: números reais, timeframes concretos, fontes identificáveis.

---

### 13. Parede de Texto na Legenda
Nunca escrever legendas em blocos únicos sem line breaks.
No mobile, 5 linhas contínuas = parede de texto = skip.

Regra: máximo 3 linhas por parágrafo. Line break entre ideias.
