# Equipament
## Projeto B

API REST para gerenciamento de equipamentos, usuários, papéis de acesso e locais de armazenamento. O projeto usa NestJS, TypeScript, Prisma ORM e PostgreSQL.

## Funcionalidades

- Autenticação por JWT e controle de acesso baseado em papéis (`ADM` e `PUBLIC`).
- Cadastro, consulta, atualização e remoção de usuários, papéis, equipamentos, locais de armazenamento e vínculos entre essas entidades.
- Validação de entrada com DTOs e documentação OpenAPI.
- Métricas de requisições disponíveis pela API.

## Tecnologias

- Node.js 22 ou superior
- pnpm 10
- NestJS 11 e TypeScript
- PostgreSQL 17
- Prisma ORM 7 com adaptador PostgreSQL
- Jest e Supertest
- Docker Compose (para executar o PostgreSQL localmente)

## Requisitos

Instale Node.js, pnpm, Git e Docker com o plugin Docker Compose. Para executar o banco sem Docker, é necessário ter PostgreSQL 17 instalado.

## Instalação

Clone o repositório e instale as dependências:

```bash
git clone <URL_DO_REPOSITORIO>
cd equipament
pnpm install
```

Copie o modelo de variáveis de ambiente:

```bash
cp .env.example .env
```

Preencha o `.env` com valores locais. Exemplo para a API executada na máquina e PostgreSQL iniciado pelo Docker Compose:

```dotenv
PORT=3000
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=equipament_db
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/equipament_db?schema=public
DATABASE_TEST_URL=postgresql://postgres:postgres@localhost:5432/equipament_test_db
JWT_SECRET=troque-por-um-segredo-local-forte
CORS_ORIGIN=http://localhost:3001
SEED_PUBLIC_NAME=Usuario Publico
SEED_PUBLIC_EMAIL=publico@example.com
SEED_PUBLIC_PASSWORD=troque-esta-senha
SEED_ADMIN_NAME=Administrador
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=troque-esta-senha
```

Use segredos próprios no seu ambiente. Não compartilhe nem versione o `.env` ou credenciais reais.

## Banco de dados

Inicie o serviço PostgreSQL definido no Compose:

```bash
docker compose up -d postgres
```

Gere o Prisma Client e aplique as migrations ao banco indicado por `DATABASE_URL`:

```bash
pnpm exec prisma generate
pnpm exec prisma migrate deploy
```

Para criar os papéis padrão e os usuários definidos pelas variáveis `SEED_*`:

```bash
pnpm exec prisma db seed
```

O seed pode ser executado novamente: papéis e usuários existentes não são recriados, e os vínculos duplicados são ignorados. Senhas são armazenadas com hash Argon2. O seed exige as seis variáveis de usuário configuradas.

### Preparar o banco de teste E2E

Crie o banco de teste uma vez, usando as mesmas credenciais PostgreSQL do `.env`:

```bash
PGPASSWORD=postgres psql -h localhost -U postgres -d postgres \
  -c "CREATE DATABASE equipament_test_db;"
```

Se suas credenciais forem diferentes, ajuste o comando. Depois aplique as migrations ao banco de teste:

```bash
DATABASE_URL="$DATABASE_TEST_URL" pnpm exec prisma migrate deploy
```

O comando `test:e2e` usa `DATABASE_TEST_URL` e exige que ele esteja configurado no `.env`. Os testes verificam se estão conectados ao banco esperado antes de executar operações.

## Executar a aplicação

Inicie a API em modo de desenvolvimento:

```bash
pnpm run start:dev
```

Por padrão, a API fica disponível em `http://localhost:3000`. A documentação Swagger fica em `http://localhost:3000/api`, e o documento OpenAPI em `http://localhost:3000/api/openapi.json`.

## Rotas principais

| Recurso                                    | Base da rota          | Operações                                              |
| ------------------------------------------ | --------------------- | ------------------------------------------------------ |
| Autenticação                               | `/auth`               | `POST /login`                                          |
| Usuários                                   | `/user`               | `POST`, `GET`, `GET /:id`, `PATCH /:id`, `DELETE /:id` |
| Papéis                                     | `/roles`              | `POST`, `GET`, `GET /:id`, `PATCH /:id`, `DELETE /:id` |
| Equipamentos                               | `/equipament`         | `POST`, `GET`, `GET /:id`, `PATCH /:id`, `DELETE /:id` |
| Armazenamentos                             | `/storage`            | `POST`, `GET`, `GET /:id`, `PATCH /:id`, `DELETE /:id` |
| Vínculos usuário-papel                     | `/user-roles`         | `POST`, `GET`, `GET /:id`, `PATCH /:id`, `DELETE /:id` |
| Vínculos armazenamento-equipamento-usuário | `/storage-equip-user` | `POST`, `GET`, `GET /:id`, `PATCH /:id`, `DELETE /:id` |
| Métricas                                   | `/metrics`            | `GET`                                                  |

As rotas protegidas exigem token Bearer. Para obter um token, envie `POST /auth/login` com `email` e `password` de um usuário ativo. Os requisitos de autorização e os contratos estão detalhados na documentação Swagger.

## Verificações

Executar os testes unitários:

```bash
pnpm test --runInBand
```

Executar os testes E2E (requer o banco de teste iniciado e migrado):

```bash
pnpm run test:e2e
```

Verificar lint sem alterar arquivos:

```bash
pnpm exec eslint "{src,apps,libs,test}/**/*.ts"
```

Verificar formatação:

```bash
pnpm exec prettier --check "src/**/*.ts" "test/**/*.ts"
```

Verificar tipos e gerar o build:

```bash
pnpm exec tsc --noEmit
pnpm run build
```

## CI

O GitHub Actions instala as dependências, verifica formatação e lint, gera o Prisma Client, aplica migrations, executa seeds, testes unitários e E2E e compila a aplicação. O workflow usa um PostgreSQL temporário e credenciais exclusivas do ambiente de CI.

## Contribuição

Consulte as instruções do projeto antes de abrir uma contribuição. Não inclua arquivos `.env`, credenciais, tokens ou dados pessoais no repositório.

## Status

Projeto em desenvolvimento.

## Autor

Bruno Pessoa
