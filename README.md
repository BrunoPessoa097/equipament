# Gestor Técnico

API REST para gerenciamento de equipamentos, responsáveis, armazenamento e empréstimos.

O **Gestor Técnico** é um projeto acadêmico desenvolvido com o objetivo de aplicar conceitos de engenharia de software, arquitetura de aplicações, segurança e boas práticas de desenvolvimento.

## Tecnologias

- **Node.js** — ambiente de execução.
- **NestJS** — framework para desenvolvimento da API.
- **TypeScript** — linguagem de programação.
- **PostgreSQL** — banco de dados relacional.
- **Prisma ORM** — modelagem e acesso aos dados.
- **Docker** — conteinerização do ambiente.

## Funcionalidades previstas

- Gerenciamento de usuários e permissões.
- Controle de acesso baseado em papéis (RBAC).
- Cadastro e gerenciamento de equipamentos.
- Organização de equipamentos por categorias.
- Gerenciamento de locais de armazenamento.
- Histórico de movimentação de equipamentos.
- Registro de empréstimos e devoluções.
- Consulta de empréstimos ativos e histórico.

## Requisitos

Para executar o projeto localmente, serão necessários:

- Node.js
- pnpm
- Docker e Docker Compose
- Git

## Instalação

Clone o repositório:

```bash
git clone <URL_DO_REPOSITORIO>
```

Entre na pasta do projeto:

```bash
cd equipament
```

Instale as dependências:

```bash
pnpm install
```

## Configuração do ambiente

Crie um arquivo `.env` na raiz do projeto.

As variáveis de ambiente serão definidas conforme a configuração do banco de dados e do Prisma.

**Importante:** não compartilhe arquivos `.env` com credenciais ou informações sensíveis.

## Executando o projeto

Para iniciar a aplicação em modo de desenvolvimento:

```bash
pnpm run start:dev
```

## Testes

Executar os testes unitários:

```bash
pnpm run test
```

Executar os testes de integração:

```bash
pnpm run test:e2e
```

## Segurança e qualidade

O projeto prevê a aplicação de:

- RBAC para controle de permissões na aplicação.
- Row Level Security (RLS) para proteção de dados no PostgreSQL.
- Testes automatizados.
- Análise estática de código.
- Documentação da API com OpenAPI/Swagger.

## Status do projeto

<badge color="warning">Em desenvolvimento</badge>

O projeto encontra-se na fase inicial de estruturação, modelagem do banco de dados e configuração do ambiente.

## Autor

Desenvolvido por **Bruno Pessoa**