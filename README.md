# Projeto TODO List com Docker, Flask e Angular

Este é um projeto de uma aplicação TODO List Full-Stack desenvolvido para a disciplina de Tópicos Especiais (BRATOPI) do curso de Análise e Desenvolvimento de Sistemas do IFSP - Câmpus de Bragança Paulista.

O principal objetivo do projeto é demonstrar a aplicação de conceitos de DevOps e arquitetura de software limpa (**Clean Architecture**), utilizando containers Docker para criar um ambiente de desenvolvimento e produção desacoplado, escalável e fácil de gerenciar.

## 📋 Status do Projeto

**Em Desenvolvimento** 🚧

## Funcionalidades

A aplicação permite o gerenciamento de tarefas com as seguintes funcionalidades planejadas:

* **CRUD Básico:** Criar, listar, atualizar e deletar tarefas.
* **Hierarquia:** Suporte para tarefas e sub-tarefas aninhadas.
* **Progresso:** Cálculo de porcentagem de conclusão para tarefas "pai".
* **Tags:** Sistema de tags (etiquetas) para categorizar tarefas.
* **Calendário:** Visualização das tarefas com prazo em um calendário.

## Tecnologias Utilizadas

A arquitetura do projeto é dividida em várias camadas e tecnologias:

#### **Frontend**
* **Angular:** Framework para a construção da interface de usuário reativa (SPA).
* **TypeScript:** Superset do JavaScript que adiciona tipagem estática.

#### **Backend**
* **Python:** Linguagem de programação para a lógica do servidor.
* **Flask:** Microframework para a criação da API REST.
* **SQLAlchemy:** ORM para mapeamento objeto-relacional com o banco de dados.
* **Gunicorn:** Servidor WSGI para rodar a aplicação em produção.

#### **Banco de Dados**
* **PostgreSQL:** Sistema de gerenciamento de banco de dados relacional.
* **Neon:** Provedor de banco de dados PostgreSQL serverless na nuvem.

#### **Infraestrutura e DevOps**
* **Docker:** Plataforma de containerização para isolar e empacotar as aplicações.
* **Docker Compose:** Ferramenta para definir e gerenciar a aplicação multi-container.
* **Nginx:** Servidor web de alta performance para servir a aplicação Angular.
* **Docker Swarm:** Ferramenta de orquestração para clusterização e escalonamento.

---
## Como Executar o Projeto

Siga os passos abaixo para executar a aplicação em seu ambiente local.

### Pré-requisitos
Antes de começar, você vai precisar ter as seguintes ferramentas instaladas:

* [Git](https://git-scm.com)
* [Docker](https://www.docker.com/products/docker-desktop/)

### 1. Configuração do Ambiente

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/ArthurDeFaria/docker-flask-angular-todo.git](https://github.com/ArthurDeFaria/docker-flask-angular-todo.git)
    ```

2.  **Navegue até a pasta raiz do projeto:**
    ```bash
    cd docker-flask-angular-todo
    ```
    
3.  **Configure as Variáveis de Ambiente:**
    A aplicação backend precisa da URL de conexão do banco de dados para funcionar.
    * Vá até a pasta `backend/`.
    * Crie uma cópia do arquivo `.env.example` e renomeie para `.env`.
    * Abra o arquivo `.env` e substitua o valor de `DATABASE_URL` pela sua URL de conexão do Neon DB.

### 2. Usando Docker Compose (Modo de Desenvolvimento)

Este é o método mais simples para subir a aplicação completa.

1.  **Suba os containers:**
    A partir da pasta raiz do projeto, execute o comando a seguir. Ele irá construir as imagens e iniciar os containers.
    ```bash
    docker-compose up --build
    ```

2.  **Acesse a aplicação:**
    Abra seu navegador e acesse `http://localhost:4200`.

### 3. Usando Docker Swarm (Modo de Cluster)

Para demonstrar a capacidade de orquestração e escalonamento.

1.  **Inicialize o Swarm:**
    ```bash
    docker swarm init
    ```

2.  **Faça o deploy da stack:**
    ```bash
    docker stack deploy -c docker-compose.yml todoapp
    ```

3.  **Verifique os serviços:**
    ```bash
    docker service ls
    ```

4.  **Demonstre o escalonamento (Exemplo):**
    ```bash
    docker service scale todoapp_backend=3
    ```

---
## Estrutura do Projeto

O projeto está organizado em um monorepo, com o backend seguindo os princípios da Clean Architecture:
```
.
├── backend/                  # Contém a aplicação Flask (API)
│   ├── app/                  # Pacote principal da aplicação
│   │   ├── application/      # Camada de casos de uso e interfaces
│   │   ├── domain/           # Camada de entidades de negócio
│   │   └── infrastructure/   # Camada de frameworks (web, db)
│   ├── run.py                # Ponto de entrada da aplicação
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/                 # Contém a aplicação Angular (UI)
│   ├── src/
│   ├── Dockerfile
│   └── nginx.conf
└── docker-compose.yml        # Orquestra os containers
```

---
## Autores

Este projeto foi desenvolvido por:

* **[Nome do Aluno 1]** - `[Link para o GitHub]`
* **[Nome do Aluno 2]** - `[Link para o GitHub]`
* **[Nome do Aluno 3]** - `[Link para o GitHub]`
* **[Nome do Aluno 4]** - `[Link para o GitHub]`

---
## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE.md](LICENSE.md) para mais detalhes.
