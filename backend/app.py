# backend/app.py
from flask import Flask, jsonify
from flask_cors import CORS

# Cria a aplicação Flask
app = Flask(__name__)

# Habilita o CORS para permitir requisições do frontend
CORS(app)

# Rota de teste da API
@app.route('/api/message')
def get_message():
    # Retorna uma mensagem em formato JSON
    return jsonify(message="Olá do Backend Flask!")

# O Gunicorn vai rodar a aplicação, então não precisamos de __main__
# Se quiser testar localmente sem Docker, adicione:
# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000)