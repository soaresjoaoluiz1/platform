# Instruções para rodar o projeto API-Liya com Docker

## Pré-requisitos

- Docker instalado
- Banco de dados configurado (ex: PostgreSQL, MySQL, etc.)
- Variáveis de ambiente configuradas (ver abaixo)

## Passos para rodar

1. **Configure o arquivo `.env`**
    - Copie `.env.example` para `.env` e ajuste os valores conforme necessário.

2. **Build da imagem Docker:**

    ```sh
    docker build -t api-liya .
    ```

3. **Execute o container:**

    ```sh
    docker run --env-file .env -p 3000:3000 api-liya
    ```

    - O serviço estará disponível em `http://localhost:3000`

4. **(Opcional) Rodar com Docker Compose:**
    - Crie um arquivo `docker-compose.yml` se desejar orquestrar banco + app.

5. **Publicar a imagem**
    ```sh
    docker tag api-lyia SEU_USUARIO/api-lyia:x.x.x
    docker push SEU_USUARIO/api-lyia:x.x.x
    ```

## Principais variáveis de ambiente

- `NODE_ENV=production`
- `PORT=3000`
- `DATABASE_URL=postgres://usuario:senha@host:5432/nome_db`
- `JWT_SECRET=sua_chave_jwt`
- `LOG_LEVEL=info`
- `WHATSAPP_API_URL=...` (se aplicável)
- `WHATSAPP_API_TOKEN=...` (se aplicável)

Veja `.env.example` para mais detalhes.

---

Dúvidas? Consulte o README.md ou peça suporte ao time de desenvolvimento.
