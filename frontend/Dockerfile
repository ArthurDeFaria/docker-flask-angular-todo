# frontend/Dockerfile

# ---- Estágio 1: Build ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ---- Estágio 2: Produção ----
FROM nginx:stable-alpine

# Copiar os arquivos compilados do estágio de build para a pasta do Nginx
# ATENÇÃO AO CAMINHO '/app/dist/frontend/browser'
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html

# Copiar o nosso arquivo de configuração customizado do Nginx
# Ele irá sobrescrever a configuração padrão
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor a porta 80
EXPOSE 80