# AGENTS.md

# Equipament — Instruções para Agentes de IA

## 1. Sobre o projeto

O **Equipament** é uma API REST desenvolvida com NestJS para gerenciamento de equipamentos.

O projeto tem como objetivo aplicar boas práticas de desenvolvimento de software, organização arquitetural, segurança, testes automatizados e qualidade de código.

Toda implementação deve priorizar:

- Legibilidade e manutenibilidade.
- Segurança e integridade dos dados.
- Baixo acoplamento e alta coesão.
- Princípios SOLID.
- Clean Code.
- Testabilidade.
- Consistência arquitetural.

## 2. Stack tecnológica

Tecnologias utilizadas no projeto:

- **Node.js:** 22
- **NestJS:** Framework principal.
- **TypeScript:** Linguagem de programação.
- **pnpm:** Gerenciador de pacotes.
- **Prisma ORM:** Mapeamento objeto-relacional.
- **PostgreSQL:** Versão 17.
- **Docker:** Containerização.
- **Docker Compose:** Orquestração dos serviços.
- **Jest:** Testes automatizados.
- **Supertest:** Testes HTTP e integração.
- **Swagger / OpenAPI:** Documentação da API.

Antes de adicionar qualquer dependência, verificar se já existe uma biblioteca no projeto que atende à necessidade.

Não substituir tecnologias ou bibliotecas sem justificativa técnica.

## 3. Idioma e nomenclatura

- Utilizar inglês para nomes de classes, métodos, variáveis, propriedades e arquivos.
- Utilizar português para documentação explicativa, quando apropriado.
- Seguir as convenções de nomenclatura do TypeScript e NestJS.
- Utilizar nomes que representem claramente a responsabilidade dos componentes.
- Evitar abreviações desnecessárias.
- Manter consistência com o padrão já estabelecido no repositório.

## 4. Arquitetura e organização

O projeto utiliza a arquitetura modular do NestJS.

Cada módulo deve possuir responsabilidades bem definidas.

Organização esperada:

- `controllers`: Responsáveis por receber requisições HTTP e encaminhar operações.
- `services`: Responsáveis pelas regras de negócio.
- `dto`: Responsáveis pela validação e transferência de dados.
- `entities`: Quando necessário, representam estruturas do domínio.
- `guards`: Responsáveis pela proteção de rotas e autorização.
- `decorators`: Responsáveis por funcionalidades reutilizáveis relacionadas aos metadados.
- `strategies`: Quando necessário, responsáveis pelas estratégias de autenticação.

Diretrizes:

1. Não implementar regras de negócio diretamente nos controllers.
2. Não colocar responsabilidades distintas em uma mesma classe.
3. Evitar serviços excessivamente grandes.
4. Não duplicar lógica entre módulos.
5. Utilizar injeção de dependências do NestJS.
6. Evitar dependências circulares.
7. Respeitar a separação de responsabilidades.

Não criar pastas, abstrações ou camadas desnecessárias.

## 5. Princípios SOLID e Design Patterns

Toda implementação deve considerar os princípios SOLID:

- SRP: Responsabilidade única.
- OCP: Aberto para extensão e fechado para modificação.
- LSP: Substituição de Liskov.
- ISP: Segregação de interfaces.
- DIP: Inversão de dependência.

Design Patterns podem ser utilizados quando resolverem um problema real.

Diretrizes:

- Não implementar padrões apenas para aumentar a complexidade.
- Justificar tecnicamente a utilização de padrões arquiteturais.
- Priorizar soluções simples e de fácil manutenção.
- Evitar abstrações prematuras.

## 6. Banco de dados e Prisma

O PostgreSQL é o banco de dados principal e o Prisma é utilizado como ORM.

Diretrizes:

1. Utilizar Prisma para operações de persistência.
2. Respeitar o schema existente.
3. Não alterar estruturas do banco sem necessidade.
4. Utilizar migrations para mudanças estruturais.
5. Não editar migrations já aplicadas sem avaliar os impactos.
6. Utilizar transações quando uma operação envolver múltiplas alterações que precisem manter atomicidade.
7. Respeitar constraints, índices e relacionamentos definidos no banco.
8. Priorizar a integridade referencial.

### Tratamento de erros

Não realizar consultas prévias desnecessárias para verificar restrições que já são garantidas pelo banco.

Exemplo: não consultar previamente se um e-mail existe apenas para depois tentar cadastrar um usuário.

Utilizar as constraints do banco e tratar adequadamente os erros retornados pelo Prisma.

Não expor mensagens internas do banco de dados ao cliente da API.

## 7. Segurança e autenticação

Segurança é um requisito fundamental.

Diretrizes:

- Nunca armazenar senhas em texto puro.
- Utilizar Argon2id para hash de senhas.
- Nunca retornar hashes de senhas nas respostas da API.
- Não registrar senhas, tokens ou informações sensíveis nos logs.
- Validar entradas recebidas pela API.
- Não confiar em dados de autorização enviados pelo cliente.
- Utilizar mecanismos apropriados de autenticação e autorização.

### RBAC

O projeto utiliza controle de acesso baseado em papéis (RBAC).

As permissões devem ser verificadas no backend.

Diretrizes:

1. Não confiar em informações de perfil enviadas pelo cliente.
2. Utilizar Guards e Decorators do NestJS quando apropriado.
3. Centralizar as verificações de autorização.
4. Garantir que usuários sem autorização não executem operações restritas.
5. Considerar a proteção adicional dos dados no PostgreSQL quando aplicável.

## 8. DTOs e validação

Utilizar DTOs para definir os contratos de entrada da API.

Diretrizes:

- Utilizar `class-validator` para validações.
- Utilizar `class-transformer` quando necessário.
- Separar DTOs de criação e atualização.
- Não aceitar propriedades que não fazem parte do contrato.
- Não utilizar entidades do Prisma diretamente como DTOs de entrada.
- Não expor estruturas internas do banco como contratos públicos da API.

Os DTOs devem representar claramente o que o cliente pode enviar.

## 9. API e documentação

A API deve possuir documentação OpenAPI utilizando Swagger.

Diretrizes:

- Documentar endpoints.
- Documentar parâmetros e respostas.
- Documentar códigos HTTP.
- Documentar requisitos de autenticação.
- Documentar DTOs e seus campos.
- Não expor informações sensíveis nos schemas.
- Manter a documentação sincronizada com a implementação.

Utilizar os recursos do Swagger disponíveis no NestJS.

## 10. Tratamento de erros

O tratamento de erros deve ser consistente.

Diretrizes:

- Utilizar exceções apropriadas do NestJS.
- Não retornar erros genéricos sem contexto.
- Não expor stack traces em respostas públicas.
- Tratar erros conhecidos do Prisma.
- Manter respostas HTTP coerentes com a natureza da falha.
- Evitar blocos try/catch desnecessários.

## 11. Testes automatizados

Toda funcionalidade relevante deve possuir testes.

Utilizar Jest e Supertest conforme a necessidade.

Tipos de testes:

- Unitários: verificam o comportamento isolado de componentes.
- Integração: verificam a interação entre componentes e dependências.
- E2E: verificam o comportamento da API por meio de requisições HTTP.

Diretrizes:

1. Testar cenários de sucesso.
2. Testar cenários de falha.
3. Testar entradas inválidas.
4. Testar regras de autorização.
5. Testar situações de conflito e restrições do banco.
6. Não escrever testes que apenas reproduzam a implementação.
7. Não remover testes existentes para contornar falhas.

Ao identificar falhas, investigar a causa antes de alterar o código.

## 12. Qualidade de código

Priorizar:

- Código simples e legível.
- Funções pequenas e objetivas.
- Tipagem explícita quando melhorar a compreensão.
- Evitar `any`.
- Evitar duplicação.
- Evitar comentários desnecessários.
- Evitar números e strings mágicas.
- Respeitar ESLint e Prettier configurados no projeto.

Não desabilitar regras de qualidade apenas para fazer o código passar na análise.

## 13. Logs, métricas e observabilidade

O projeto deve manter mecanismos de observabilidade.

Diretrizes:

- Utilizar logs estruturados.
- Registrar eventos importantes da aplicação.
- Não registrar dados sensíveis.
- Permitir identificação de erros e falhas.
- Considerar métricas de desempenho e disponibilidade.
- Respeitar os SLOs definidos na documentação do projeto.

Não adicionar logs indiscriminadamente.

## 14. Variáveis de ambiente

- Não inserir credenciais diretamente no código.
- Utilizar variáveis de ambiente.
- Manter o `.env.example` atualizado.
- Nunca versionar arquivos `.env` com credenciais reais.
- Validar variáveis obrigatórias durante a inicialização da aplicação.

## 15. Docker e ambiente

O ambiente utiliza Docker e Docker Compose.

Diretrizes:

- Respeitar os serviços já definidos no `compose.yaml` ou `docker-compose.yml`.
- Não alterar portas, volumes ou nomes de serviços sem necessidade.
- Garantir que a aplicação consiga acessar o PostgreSQL pelo serviço correto dentro da rede Docker.
- Não inserir segredos diretamente no Dockerfile.
- Preservar a consistência entre os ambientes de desenvolvimento e execução.

## 16. CI e integração contínua

O projeto utiliza GitHub Actions para automação.

As alterações devem preservar os processos de integração contínua.

Considerar:

- Instalação de dependências.
- Verificação de tipos.
- Lint.
- Testes unitários.
- Testes de integração e E2E, conforme configurados.
- Build da aplicação.

Não modificar workflows para ignorar falhas de qualidade.

## 17. Documentação técnica

Manter a documentação atualizada.

Considerar os seguintes arquivos:

- `README.md`: apresentação, instalação e execução.
- `CONTRIBUTING.md`: diretrizes de contribuição.
- `CONTRIBUTORS.md`: colaboradores.
- `CHANGELOG.md`: histórico de alterações.
- `SECURITY.md`: políticas de segurança.
- `docs/`: documentação técnica.
- ADRs: registros de decisões arquiteturais.
- `docs/desempenho.md`: resultados dos testes de carga.

Ao realizar mudanças arquiteturais relevantes, avaliar a necessidade de criar ou atualizar um ADR.

## 18. Git e versionamento

Respeitar o fluxo Gitflow adotado pelo projeto.

Diretrizes:

- Não realizar commits diretamente na `master`.
- Utilizar branches apropriadas para cada tipo de alteração.
- Não alterar branches ou histórico sem autorização.
- Não executar comandos destrutivos sem autorização.
- Não realizar push ou merge sem solicitação explícita.
- Manter commits organizados e com mensagens descritivas.
- Respeitar as regras de proteção de branches do GitHub.

## 19. Comportamento esperado do agente

Antes de implementar qualquer funcionalidade:

1. Analisar a estrutura existente do projeto.
2. Verificar os módulos e padrões já utilizados.
3. Identificar dependências e possíveis impactos.
4. Consultar os DTOs, serviços e schemas relacionados.
5. Propor a solução mais simples que atenda ao requisito.

Durante a implementação:

- Seguir os padrões existentes.
- Evitar alterações fora do escopo solicitado.
- Não inventar funcionalidades.
- Não modificar configurações sem necessidade.
- Explicar decisões técnicas relevantes.
- Apontar riscos e possíveis impactos.

Após a implementação:

1. Revisar o código alterado.
2. Executar as verificações pertinentes.
3. Executar os testes aplicáveis.
4. Informar os arquivos modificados.
5. Informar os testes executados e seus resultados.
6. Identificar pendências ou limitações.

## 20. Regra fundamental

**Não priorize velocidade de implementação em detrimento da qualidade técnica.**

O objetivo é desenvolver uma API segura, organizada, testável e sustentável.

Quando houver mais de uma solução possível, priorize aquela que respeite a arquitetura existente, os princípios SOLID e a simplicidade de manutenção.

Não assuma que uma implementação está correta apenas porque compila ou porque os testes existentes passaram.
