---
task: "Renderizar Slides em PNG"
order: 2
input: |
  - slide_htmls: Arquivos HTML dos slides em squads/instagram-carousel/output/slides/
output: |
  - slide_pngs: Arquivos PNG 1080×1440px para cada slide
---

# Renderizar Slides em PNG

Renderiza cada arquivo HTML em PNG usando a skill `image-creator`. Cada PNG deve ter exatamente 1080×1440px.

## Process

1. Liste todos os arquivos `slide-NN.html` em `squads/instagram-carousel/output/slides/`.
2. Para cada HTML, use a skill `image-creator` para renderizar em PNG:
   - Dimensões: 1080×1440px
   - Output: `slide-NN.png` no mesmo diretório
3. Após renderizar cada slide, verificar visualmente que:
   - Dimensões estão corretas (1080×1440px)
   - Nenhum elemento foi cortado
   - Texto está legível (não foi distorcido pela renderização)
4. Se um slide apresentar erro de renderização, tentar novamente uma vez antes de reportar.

## Instrução para a Skill image-creator

Para cada slide, seguir as instruções da skill `image-creator` para:
- Servir o HTML localmente via servidor HTTP temporário
- Capturar screenshot com Playwright na viewport exata 1080×1440px
- Salvar como PNG no caminho de output

## Output Format

Lista de arquivos gerados:

```markdown
# Slides Renderizados

| Slide | HTML | PNG | Status |
|-------|------|-----|--------|
| 1 — Capa | slide-01.html | slide-01.png | ✅ |
| 2 | slide-02.html | slide-02.png | ✅ |
| ... | ... | ... | ... |

**Total:** {N} slides renderizados
**Diretório:** squads/instagram-carousel/output/slides/
```

## Quality Criteria

- [ ] Todos os slides HTML foram renderizados em PNG
- [ ] Todos os PNGs têm dimensões 1080×1440px
- [ ] Nenhum PNG apresenta elementos cortados ou fora do viewport
- [ ] Arquivos nomeados sequencialmente (slide-01.png, slide-02.png, ...)

## Veto Conditions

1. Algum PNG com dimensões diferentes de 1080×1440px — re-renderizar com dimensões corretas
2. Mais de 2 falhas de renderização — reportar ao usuário antes de continuar
