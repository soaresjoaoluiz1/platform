# Domain Framework — Instagram Carousel

## Estrutura Operacional para Produção de Carrosséis

Este framework define o processo completo de criação de um carrossel de Instagram
de alta performance, desde a identificação da notícia até a entrega dos slides prontos.

---

## Fase 1: Pesquisa e Seleção de Pauta

### Critérios de seleção de notícia/pauta
- **Relevância**: conecta com dores reais do público do cliente
- **Temporalidade**: publicada nas últimas 24–72h (para relevância) OU evergreen (para longevidade)
- **Ângulo potencial**: tema que permite ≥3 ângulos emocionais distintos
- **Validação**: tem fonte verificável (estudo, pesquisa, especialista citado)

### Fontes de pesquisa recomendadas
- Google Trends (tendências em tempo real)
- Publicações do setor (blogs especializados, newsletters)
- LinkedIn (posts virais recentes na área)
- Twitter/X (trending topics no nicho)

---

## Fase 2: Geração de Ângulos

### Definição de ângulo
Um ângulo é a perspectiva emocional usada para contar UMA peça de conteúdo.
A mesma notícia produz carrosséis completamente diferentes por ângulo.

### Os 5 ângulos fundamentais
1. **🔴 Medo/Urgência** — "Se você não fizer X agora, vai perder Y"
   - Driver: Loss aversion
   - Estrutura: problema → consequência → solução urgente

2. **🟢 Oportunidade** — "Essa é sua janela antes que todo mundo descubra"
   - Driver: Status elevation + Achievement
   - Estrutura: insight exclusivo → janela de oportunidade → como aproveitar

3. **📚 Educacional** — "Como funciona X — explicado de forma simples"
   - Driver: Achievement + Control
   - Estrutura: conceito → contexto → aplicação prática

4. **↔️ Contrário** — "O que ninguém te conta sobre X"
   - Driver: Cognitive dissonance + Curiosity
   - Estrutura: crença comum → evidência contrária → nova perspectiva

5. **⭐ Inspiracional** — "Como alguém usou X para transformar Y"
   - Driver: Belonging + Achievement + Future pacing
   - Estrutura: contexto → jornada → resultado → lição

### Critério de qualidade de ângulo
- O ângulo deve produzir um slide de capa DIFERENTE para a mesma notícia
- Se dois ângulos teriam a mesma capa, não são ângulos distintos — são variações
- Cada ângulo precisa de um driver emocional claramente identificável

---

## Fase 3: Estrutura do Carrossel

### Seleção de formato
Escolher o formato baseado no ângulo selecionado:

| Ângulo | Formato Recomendado |
|--------|---------------------|
| Medo/Urgência | Problema → Solução |
| Oportunidade | Editorial/Tese |
| Educacional | Tutorial / Listicle |
| Contrário | Mito vs Realidade |
| Inspiracional | Storytelling / Antes e Depois |

### Anatomia do carrossel (8–10 slides)

**Slide 1 — Capa (Hook)**
- Função: parar o scroll em 0,3 segundos
- Elementos: imagem ou fundo forte + título bold (max 20 palavras) + promessa implícita
- Regra: se o leitor soubesse a resposta, este slide ainda seria relevante?

**Slides 2–8 — Desenvolvimento**
- Uma ideia por slide
- Hierarquia dupla: título bold (claim) + texto de suporte (evidência/contexto)
- 40–80 palavras totais por slide
- Palavras-chave destacadas em cor de accent
- Cada slide termina com "tensão implícita" que convida ao próximo slide

**Slide Final — CTA**
- Ação específica: comentar keyword, salvar, compartilhar, DM
- Não combinar mais de 1 CTA principal
- Opcional: crédito da fonte se baseado em pesquisa/estudo

### Regras de alternância visual
- Fundos: alternar claro / escuro / accent entre slides
- Fotos editoriais: intercalar entre slides de texto para ritmo visual
- Nunca dois slides com o mesmo fundo em sequência

---

## Fase 4: Redação da Legenda

### Estrutura da legenda (max 2.200 chars)

**Parágrafo 1 — Hook (max 125 chars)**
- Completo como uma frase independente
- Deve funcionar sem contexto adicional
- Cria urgência, curiosidade ou relevância pessoal imediata

**Parágrafos 2–4 — Corpo**
- Argumentação ou contexto expandido
- Line breaks agressivos: máximo 3 linhas por parágrafo no mobile
- Uma ideia por bloco

**Parágrafo Final — CTA + Pergunta**
- Pergunta aberta provocadora que gera comentários
- CTA de engajamento alinhado ao funil (save, DM, compartilhar)

**Hashtags (5–15)**
- 3–5 nicho/específico (< 500K posts)
- 3–5 médio alcance (500K–5M posts)
- 2–3 broad/popular (> 5M posts)
- Posição: final da legenda ou primeiro comentário

---

## Fase 5: Design Visual

### Processo de design

1. Definir sistema de cores (máximo 5 cores)
2. Definir tipografia (família, escalas por papel)
3. Gerar HTML/CSS para slide de capa
4. Renderizar e verificar slide 1 antes do batch
5. Gerar slides 2–N usando o mesmo sistema
6. Renderizar todos os slides
7. Verificar legibilidade e contraste em cada slide

### Sistema de design padrão para Dros Agência
- Família tipográfica: Inter ou Poppins (Google Fonts)
- Cor de accent: define a identidade do cliente
- Fundo claro: #FFFFFF ou #F8F9FA
- Fundo escuro: #1A1A2E ou #0F0F1A
- Texto principal: #FFFFFF (sobre escuro) ou #1A1A2E (sobre claro)

---

## Fase 6: Revisão e Aprovação

### Processo de revisão
1. Leitura completa do conjunto (slides + legenda) antes de qualquer score
2. Score individual por critério (1–10) com justificativa obrigatória
3. Identificar passagens específicas para feedback
4. Calcular score geral
5. Emitir veredicto (APROVAR / REJEITAR / APROVAR COM AJUSTES)
6. Listar mudanças requeridas com fixes específicos

### Critério de aprovação
- Score geral ≥ 7/10 → APROVAR
- Score geral ≥ 7/10 com critérios não-críticos entre 4–6 → APROVAR COM AJUSTES
- Score geral < 7/10 → REJEITAR
- Qualquer critério < 4/10 → REJEITAR (trigger automático)

---

## Padrões de Hook Mais Eficazes

### Estrutural
1. **Contradiction opener**: "Para crescer no Instagram, PARE de postar todos os dias."
2. **Bold claim**: "O algoritmo do Instagram mudou. Aqui está a prova."
3. **Statistic lead**: "47% das marcas erram nesse ponto — e você provavelmente também."
4. **Pattern interrupt**: "Isso não é um post de motivação. É uma análise fria."
5. **Future pacing**: "Em 90 dias, sua conta pode ter um perfil completamente diferente."

### Templates de CTA Mais Eficazes
1. **Keyword DM**: "Comenta [PALAVRA] que te mando o guia completo no DM"
2. **Save para referência**: "Salve esse carrossel — você vai querer reler isso"
3. **Tag um amigo**: "Marca alguém que precisa ver isso hoje"
4. **Debate**: "Discorda? Comenta o que você pensa aqui embaixo"
