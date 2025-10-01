# Projeto TODO List com Docker, Flask e Angular

Este é um projeto de uma aplicação TODO List Full-Stack desenvolvido para a disciplina de Tópicos Especiais(BRATOPI) do curso de Análise e Desenvolvimento de Sistemas do IFSP - Câmpus de Bragança Paulista.

O principal objetivo do projeto é demonstrar a aplicação de conceitos de DevOps e arquitetura de software, utilizando containers Docker para criar um ambiente de desenvolvimento e produção desacoplado, escalável e fácil de gerenciar.

## Status do Projeto
Em Desenvolvimento 🚧

## Funcionalidades
A aplicação permite o gerenciamento de tarefas com as seguintes funcionalidades:

- Criar novas tarefas.
- Listar todas as tarefas pendentes e concluídas.
- Atualizar o status de uma tarefa (marcar como concluída).
- Deletar tarefas.

## Tecnologias Utilizadas
A arquitetura do projeto é dividida em três camadas principais:

### Frontend
Angular: Framework para a construção da interface de usuário reativa (Single Page Application).

TypeScript: Superset do JavaScript que adiciona tipagem estática.

### Backend
Python: Linguagem de programação para a lógica do servidor.

Flask: Microframework para a criação da API REST.

### Infraestrutura e DevOps
Docker: Plataforma de containerização para isolar e empacotar as aplicações.

Docker Compose: Ferramenta para definir e gerenciar a aplicação multi-container.

Nginx: Servidor web de alta performance para servir a aplicação Angular de produção.

Docker Swarm: Ferramenta de orquestração para clusterização e escalonamento dos serviços.

## Como Executar o Projeto
Siga os passos abaixo para executar a aplicação em seu ambiente local.

### Pré-requisitos
Antes de começar, você vai precisar ter as seguintes ferramentas instaladas:

- Git
- Docker

### Usando Docker Compose (Modo de Desenvolvimento)
Este é o método mais simples para subir a aplicação completa.

Clone o repositório:
``` 
git clone https://github.com/ArthurDeFaria/docker-flask-angular-todo.git
```

Navegue até a pasta raiz do projeto:
```
cd docker-flask-angular-todo
```
Suba os containers:
O comando a seguir irá construir as imagens do frontend e do backend e iniciar os containers.
```
docker-compose up --build
```
Acesse a aplicação:
Abra seu navegador e acesse ```http://localhost:4200.```

### Usando Docker Swarm (Modo de Cluster)
Para demonstrar a capacidade de orquestração e escalonamento.

Inicialize o Swarm:
```
docker swarm init
```

Faça o deploy da stack:
A partir da pasta raiz do projeto, execute:
```
docker stack deploy -c docker-compose.yml todoapp
```

Verifique os serviços:
Para ver os serviços rodando, use o comando:
```
docker service ls
```

Demonstre o escalonamento (Exemplo):
Para escalar o serviço de backend para 3 réplicas, use:
```
docker service scale todoapp_backend=3
```

## Estrutura do Projeto
O projeto está organizado em um monorepo com a seguinte estrutura:
```
.
├── backend/            # Contém a aplicação Flask (API)
│   ├── app.py
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/           # Contém a aplicação Angular (UI)
│   ├── src/
│   ├── Dockerfile
│   └── nginx.conf
└── docker-compose.yml  # Orquestra os containers de backend e frontend
```

## Autores
Este projeto foi desenvolvido por:

[Nome do Aluno 1] - GitHub

[Nome do Aluno 2] - GitHub

[Nome do Aluno 3] - GitHub

[Nome do Aluno 4] - GitHub

## Licença
Este projeto está sob a licença MIT. Veja o arquivo LICENSE.md para mais detalhes.