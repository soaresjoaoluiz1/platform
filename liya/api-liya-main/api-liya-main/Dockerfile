# Dockerfile para API-Liya (Node.js + TypeScript)

# Imagem base
FROM node:20-alpine

# Diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install --production

# Copia o restante do código
COPY . .

# Compila o TypeScript (se necessário)
RUN npm run build || true

# Porta exposta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "start"]
