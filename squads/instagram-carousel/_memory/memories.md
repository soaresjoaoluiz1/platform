# Squad Memory — Instagram Carousel

## Histórico de execuções

### 2026-03-24 — Josiane Vargas | Aulão 09/04
- **Tema:** Estrutura de Decisão Clínica — da insegurança para o critério
- **Carrosséis produzidos:** 5 (C1 Medo/Urgência, C2 Oportunidade, C3 Educacional, C4 Contrário, C5 Inspiracional)
- **Score médio Vera Veredito:** 8.28/10 — APROVADO COM AJUSTES
- **Output:** `output/2026-03-24-143410/`
- **Keywords CTA usadas:** AULÃO (C1), VAGA (C2), PERGUNTAS (C3), CRITÉRIO (C4), ESTRUTURA (C5)

---

## Aprendizados acumulados

### Background com foto da cliente
- Preferência confirmada: inserir foto da Josiane como fundo dos slides com `opacity: 0.08`
- Uma imagem de fundo diferente por carrossel (bg1–bg5)
- C1/slide-05: foto de perfil circular no canto superior direito (200px, borda teal)
- Foto de perfil de alta qualidade disponível em: `slides/profile.jpg` (1080×1080 Instagram)

### Imagens do Google Drive
- URLs `lh3.googleusercontent.com/d/FILE_ID` **não funcionam** como `<img src>` (CORS/auth) — funcionam apenas com Playwright navegando diretamente
- URL correta para embed: `https://drive.google.com/thumbnail?id=FILE_ID&sz=w1600` — retorna JPEG público, funciona em `<img>`
- Pasta de fotos Josiane: `1OagLrBoj17F0_zRw3kZDmLkAaYmeKuSb` (Google Drive)
- IDs das fotos profissionais:
  - photo1 (escritório, sorrindo): `1OMkAJQCwnJ1P4YwJqM1p8TI02nPjfGLt`
  - photo2 (pose com livro): `1vb6aCmXLa3fYLC38IX21K8Q5u9nWCLM6`
  - photo3 (sorrindo, roupa clara): `1OEpDQVQYRkCll_PLde9UoNRyxXI7lCpx`
  - photo4: `1G8gzoOlS1ATe9QyzInFrDdt14UuM5sxn`
  - photo5: `1HAwTlvopfxh6STPL1zE7YKro119SdTKQ`

### Servidor local para renderização
- Porta padrão 8765 frequentemente ocupada de sessões anteriores
- Usar portas alternativas: 8766, 8767, 8768...
- Servir o diretório `/slides/` pai para acessar todos os carrosséis com um único servidor

### Hashtags
- Sempre verificar typos com espaços nas hashtags — frequentes em geração automática
- Ex. de erros encontrados: "#psicopedagogianapr atica", "#mitovsr ealidade"

---

## Preferências do cliente

### Josiane Vargas — Psicopedagoga & Mentora
- **Voz:** Sempre em primeira pessoa ("eu vou", "eu mostro") — nunca terceira pessoa
- **Design system:** Teal `#00B5AD`, Orange `#F07A30`, Dark `#2D2D2D`, Cream `#F5F0E8`, Poppins
- **Fotos:** Usar fotos profissionais nas slides de autoridade/apresentação (sobre mim, credencial)
- **Dados verificados:** +10 anos clínica, +500 casos, +200 profissionais orientadas
- **Tom preferido:** Autoridade direta, sem hipérboles, linguagem técnica acessível
