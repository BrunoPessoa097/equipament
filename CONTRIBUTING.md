# Contributing Guide

Obrigado pelo interesse em contribuir com o **Equipament**!

Este documento apresenta as diretrizes para desenvolvimento, manutenção e contribuição no projeto.

## 1. Sobre o projeto

O Equipament é uma API REST desenvolvida com NestJS e TypeScript, utilizando PostgreSQL como banco de dados e Prisma ORM para persistência.

O projeto tem como objetivo gerenciar equipamentos, categorias, locais de armazenamento, usuários e empréstimos.

## 2. Tecnologias utilizadas

- Node.js
- TypeScript
- NestJS
- PostgreSQL
- Prisma ORM
- Docker e Docker Compose
- pnpm

## 3. Configuração do ambiente

Clone o repositório:

```bash
git clone <URL_DO_REPOSITORIO>
```

Entre na pasta:

```bash
cd equipament
```

Instale as dependências:

```bash
pnpm install
```

Configure as variáveis de ambiente utilizando o arquivo `.env.example` como referência.

Inicie o ambiente de desenvolvimento:

```bash
pnpm run start:dev
```

## 4. Organização das branches

O projeto utiliza uma estratégia de branches para organizar o desenvolvimento.

| Branch | Finalidade |
|---|---|
| `main` | Versão estável do projeto |
| `develop` | Integração das funcionalidades |
| `feature/*` | Desenvolvimento de novas funcionalidades |
| `fix/*` | Correção de problemas |
| `hotfix/*` | Correções urgentes na versão estável |

Novas funcionalidades devem ser desenvolvidas em branches específicas e integradas à `develop` por meio de Pull Requests.

A branch `main` deve permanecer estável.

## 5. Padrão de commits

Os commits devem seguir o padrão **Conventional Commits**.

Formato:

```text
tipo(escopo): descrição
```

Tipos mais utilizados:

| Tipo | Descrição |
|---|---|
| `feat` | Nova funcionalidade |
| `fix` | Correção de problema |
| `docs` | Alteração na documentação |
| `test` | Criação ou alteração de testes |
| `refactor` | Refatoração sem alteração de comportamento |
| `style` | Alterações de formatação |
| `chore` | Tarefas de manutenção e configuração |
| `build` | Alterações no processo de build |
| `ci` | Alterações na integração contínua |

Exemplos:

```bash
git commit -m "feat(equipment): add equipment registration"
git commit -m "fix(auth): correct token validation"
git commit -m "docs(readme): update installation instructions"
git commit -m "test(loan): add loan creation tests"
```

## 6. Padrões de desenvolvimento

O desenvolvimento deve seguir boas práticas de programação, priorizando:

- Código limpo e legível (Clean Code).
- Responsabilidade única.
- Baixo acoplamento e alta coesão.
- Separação de responsabilidades.
- Tratamento adequado de exceções.
- Validação de dados de entrada.
- Reutilização de componentes e serviços quando apropriado.

As funcionalidades devem respeitar a arquitetura e os padrões já estabelecidos no projeto.

## 7. Qualidade de código

Antes de enviar alterações, recomenda-se executar as verificações de qualidade.

### Formatação

Formatar os arquivos do projeto:

```bash
pnpm run format
```

### Análise estática (ESLint)

Verificar problemas de código:

```bash
pnpm run lint
```

### Verificação de tipos (TypeScript)

Verificar erros de tipagem sem gerar arquivos:

```bash
pnpm exec tsc --noEmit
```

### Build

Verificar se a aplicação compila corretamente:

```bash
pnpm run build
```

As alterações devem respeitar os padrões de formatação, tipagem e qualidade definidos no projeto.

## 8. Testes

Novas funcionalidades e correções devem possuir testes compatíveis com seu comportamento.

Executar testes unitários:

```bash
pnpm run test
```

Executar testes de integração:

```bash
pnpm run test:e2e
```

Executar testes com cobertura:

```bash
pnpm run test:cov
```

Os testes devem validar tanto os cenários esperados quanto as possíveis situações de erro.

## 9. Pull Requests

Antes de abrir um Pull Request:

1. Verifique se o código segue os padrões do projeto.
2. Execute as verificações de qualidade.
3. Execute os testes automatizados.
4. Confira se o build é concluído corretamente.
5. Atualize a documentação, quando necessário.
6. Descreva claramente as alterações realizadas.

Os Pull Requests devem apresentar:

- Objetivo da alteração.
- Descrição das modificações.
- Testes realizados.
- Verificações de qualidade executadas.
- Issues relacionadas, quando aplicável.

## 10. Segurança

Não devem ser enviados ao repositório:

- Senhas ou credenciais.
- Tokens de autenticação.
- Arquivos `.env` com informações reais.
- Dados pessoais ou informações sensíveis.

Problemas relacionados à segurança devem seguir as orientações descritas no arquivo `SECURITY.md`.

## 11. Licença

Ao contribuir com este projeto, você concorda que suas contribuições estarão sujeitas aos termos da licença definida no arquivo `LICENSE`.

---

Desenvolvido por **Bruno Pessoa**.