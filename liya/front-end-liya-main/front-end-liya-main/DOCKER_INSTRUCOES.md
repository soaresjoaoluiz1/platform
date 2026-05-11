# Instruções para rodar o projeto com Docker

## Pré-requisitos
- Docker instalado

## Variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto com as variáveis necessárias para o front-end, por exemplo:

```
# URL da API backend
VITE_API_URL=https://sua-api.com/api
# Outras variáveis VITE_*
```

## Build e execução

1. **Build da imagem:**
   ```sh
   docker build -t front-end-liya .
   ```

2. **Rodar o container:**
   ```sh
   docker run -d -p 8080:80 --env-file .env --name liya-front front-end-liya
   ```
   O app estará disponível em http://localhost:8080

3. **Publicar a imagem**
   ```sh
   docker tag front-end-liya docker.io/SEU_USUARIO/front-end-liya
   docker push docker.io/SEU_USUARIO/front-end-liya
   ```

## Customização do Nginx
Se quiser customizar o nginx, crie um arquivo `nginx.conf` na raiz do projeto. Exemplo básico:

```
server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

## Observações
- As variáveis de ambiente que começam com `VITE_` são automaticamente expostas no build do Vite.
- Para ambiente de desenvolvimento, use `npm run dev` localmente.
