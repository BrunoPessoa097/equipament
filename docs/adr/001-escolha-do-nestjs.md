# ADR-001: Escolha do NestJS como framework de backend

- **Status:** Aceita
- **Data:** 13/11/2026
- **Decisores:** Equipe de desenvolvimento
- **Contexto:** Projeto Equipament

## 1. Contexto

O projeto Equipament consiste em uma API REST para gerenciamento de equipamentos, usuários, categorias, locais de armazenamento, empréstimos e histórico de movimentações.

A aplicação necessita de uma estrutura de backend organizada, escalável e de fácil manutenção, que permita implementar regras de negócio, autenticação, autorização e integração com banco de dados.

Também é necessário manter um padrão consistente de desenvolvimento, favorecendo princípios de Clean Code, SOLID, testes automatizados e boas práticas de arquitetura de software.

Diante desses requisitos, foi necessário selecionar um framework para o desenvolvimento da API.

## 2. Decisão

Foi escolhido o **NestJS** como framework principal para o desenvolvimento do backend do projeto Equipament, utilizando TypeScript e sua arquitetura modular.

## 3. Justificativa

A escolha do NestJS foi baseada nos seguintes fatores:

- **Arquitetura modular:** permite organizar a aplicação em módulos independentes, facilitando a separação de responsabilidades e a evolução do sistema.
- **TypeScript:** oferece tipagem estática, melhorando a segurança do código, a legibilidade e a identificação antecipada de erros.
- **Injeção de dependência:** facilita o desacoplamento entre componentes e contribui para a aplicação dos princípios SOLID.
- **Organização de responsabilidades:** disponibiliza uma estrutura baseada em Controllers, Services, Modules, Guards e Providers.
- **Testabilidade:** oferece suporte à criação de testes unitários e de integração.
- **Ecossistema:** possui integração com ferramentas como Prisma, Swagger e bibliotecas de autenticação.
- **Manutenibilidade:** incentiva uma organização padronizada, facilitando a compreensão e manutenção do código.

Além disso, o NestJS permite implementar mecanismos de autenticação e autorização, incluindo RBAC, atendendo às necessidades de controle de acesso do sistema.

## 4. Consequências

### Positivas

- Código organizado em módulos e responsabilidades bem definidas.
- Maior facilidade para aplicar princípios SOLID e padrões de projeto.
- Suporte à criação de testes automatizados.
- Facilidade de integração com PostgreSQL por meio do Prisma.
- Documentação da API utilizando Swagger/OpenAPI.
- Facilidade de implementação de autenticação e autorização.
- Maior previsibilidade na manutenção e evolução do projeto.

### Negativas

- Curva de aprendizado inicial devido à estrutura e aos conceitos do framework.
- Maior quantidade de abstrações e configurações em comparação com soluções mais simples.
- Necessidade de compreender conceitos como injeção de dependência, decorators, módulos e providers.

## 5. Alternativas consideradas

### Express.js

Foi considerado por sua simplicidade, flexibilidade e ampla utilização no desenvolvimento de APIs com Node.js.

Entretanto, sua estrutura mais livre exige maior definição manual de padrões arquiteturais e organização do projeto.

### Fastify

Foi considerado por seu foco em desempenho e baixo overhead.

Entretanto, o NestJS oferece uma estrutura arquitetural mais alinhada às necessidades de organização, padronização e manutenção do projeto.

## 6. Resultado

A adoção do NestJS atende aos requisitos arquiteturais e técnicos do projeto Equipament, proporcionando uma base estruturada para o desenvolvimento de uma API REST modular, testável e de fácil manutenção.

A decisão foi aceita e será mantida durante o desenvolvimento do projeto.
