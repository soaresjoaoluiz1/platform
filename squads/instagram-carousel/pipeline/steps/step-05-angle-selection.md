---
id: step-05-angle-selection
type: checkpoint
label: "Seleção de Ângulo e Tom"
outputFile: squads/instagram-carousel/output/selected-angle.md
---

# Checkpoint — Seleção de Ângulo e Tom

Carlos gerou 5 ângulos para a história selecionada. Agora você escolhe a perspectiva do carrossel.

Apresente ao usuário os 5 ângulos do arquivo `squads/instagram-carousel/output/angles.md` com:
- Hook de capa sugerido
- Driver emocional
- Formato recomendado

Em seguida, apresente as 6 opções de tom de voz do arquivo `squads/instagram-carousel/pipeline/data/tone-of-voice.md`.

**Perguntas ao usuário:**
1. Qual ângulo prefere? (1–5)
2. Qual tom de voz? (1–6)

Após as respostas, salve no outputFile:

```
# Ângulo e Tom Selecionados

**Ângulo escolhido:** {número} — {nome do ângulo}
**Hook de capa:** {hook do ângulo selecionado}
**Driver emocional:** {driver}
**Formato:** {formato recomendado}

**Tom de voz:** {número} — {nome do tom}
**Características:** {resumo das características do tom selecionado}
```
