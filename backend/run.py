from app.create_app import create_app

app = create_app()

# Este bloco padrão do Python garante que o servidor só será executado
# quando este script for chamado diretamente (ex: 'python run.py').
# Ele não será executado se o arquivo for importado por outro módulo (como o Gunicorn fará em produção).
if __name__ == '__main__':
    # Executa o servidor de desenvolvimento do Flask
    # host='0.0.0.0' faz o servidor ser acessível na rede local (essencial para o Docker mais tarde)
    # debug=True ativa o modo de depuração, que reinicia o servidor a cada alteração no código.
    app.run(host='0.0.0.0', port=5000, debug=True)