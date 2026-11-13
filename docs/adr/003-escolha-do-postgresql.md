# ADR-003: Escolha do PostgreSQL como sistema gerenciador de banco de dados

- **Status:** Aceita
- **Data:** 10/11/2026
- **Decisores:** Equipe de desenvolvimento
- **Contexto:** Projeto Equipament

## 1. Contexto

O projeto Equipament necessita de um sistema gerenciador de banco de dados capaz de armazenar e gerenciar informações relacionadas a usuários, permissões, equipamentos, categorias, locais de armazenamento, empréstimos e histórico de movimentações.

A estrutura do sistema envolve relacionamentos entre diferentes entidades, restrições de integridade e operações que precisam manter a consistência dos dados.

Também é necessário utilizar uma solução confiável, com suporte a transações, integridade referencial, segurança e possibilidade de evolução conforme o crescimento da aplicação.

## 2. Decisão

Foi escolhido o **PostgreSQL 17** como sistema gerenciador de banco de dados relacional do projeto Equipament.

O banco será executado em ambiente containerizado por meio do Docker Compose e acessado pela aplicação NestJS utilizando o Prisma ORM.

## 3. Justificativa

A escolha do PostgreSQL foi baseada nos seguintes fatores:

- **Integridade dos dados:** oferece suporte a chaves primárias, estrangeiras, restrições UNIQUE, NOT NULL e CHECK.
- **Transações:** garante operações consistentes por meio das propriedades ACID.
- **Relacionamentos:** oferece suporte eficiente a estruturas relacionais e consultas envolvendo múltiplas tabelas.
- **Segurança:** disponibiliza mecanismos de controle de usuários, privilégios e permissões.
- **Row-Level Security (RLS):** permite implementar políticas de segurança em nível de linha no banco de dados.
- **Desempenho:** oferece índices e diferentes estratégias de otimização de consultas.
- **Extensibilidade:** disponibiliza recursos avançados, extensões e tipos de dados adicionais.
- **Ecossistema:** possui ampla compatibilidade com ferramentas e tecnologias utilizadas no projeto, incluindo Prisma e Docker.

## 4. Consequências

### Positivas

- Garantia de integridade referencial entre as entidades.
- Suporte a transações e consistência dos dados.
- Possibilidade de implementar políticas de segurança em nível de banco.
- Recursos avançados de indexação e otimização.
- Facilidade de integração com Prisma ORM.
- Possibilidade de executar o banco em containers Docker.
- Ampla documentação e comunidade ativa.

### Negativas

- Necessidade de administrar configurações, usuários, permissões e conexões.
- Exige planejamento de índices e otimização conforme o volume de dados cresce.
- Necessidade de implementar estratégias de backup e recuperação.
- Recursos avançados de segurança, como RLS, exigem configuração e testes cuidadosos.

## 5. Alternativas consideradas

### MySQL

Foi considerado por sua ampla utilização em aplicações web e suporte a bancos relacionais.

Entretanto, o PostgreSQL oferece um conjunto de recursos avançados que atende melhor às necessidades de integridade, segurança e extensibilidade previstas para o projeto.

### MariaDB

Foi considerado por sua compatibilidade com o ecossistema MySQL e por ser uma alternativa relacional consolidada.

Entretanto, o PostgreSQL foi escolhido por seu conjunto de funcionalidades e integração com a stack definida para o projeto.

### SQLite

Foi considerado por sua simplicidade e facilidade de configuração.

Entretanto, sua arquitetura baseada em arquivo não atende tão bem às necessidades previstas de gerenciamento concorrente, controle de acesso e evolução da aplicação.

## 6. Resultado

A adoção do PostgreSQL 17 foi aprovada como solução de armazenamento persistente do projeto Equipament.

O banco será responsável por armazenar os dados e garantir sua integridade, utilizando o Prisma ORM como camada de acesso pela aplicação NestJS.

A configuração do ambiente será realizada por meio do Docker Compose, permitindo padronizar a execução do banco de dados nos ambientes de desenvolvimento.
