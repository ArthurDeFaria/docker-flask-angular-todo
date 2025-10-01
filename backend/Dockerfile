# backend/Dockerfile

# 1. Usar uma imagem base oficial do Python
FROM python:3.10-slim

# 2. Definir o diretório de trabalho dentro do container
WORKDIR /app

# 3. Copiar o arquivo de dependências e instalar
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copiar o resto do código da aplicação
COPY . .

# 5. Expor a porta que a aplicação vai rodar
EXPOSE 5000

# 6. Comando para iniciar a aplicação com Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]