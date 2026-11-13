# ADR-004: Adoção de princípios de Clean Architecture, Clean Code e SOLID

- **Status:** Aceita
- **Data:** 10/11/2026
- **Decisores:** Equipe de desenvolvimento
- **Contexto:** Projeto Equipament

## 1. Contexto

O projeto Equipament necessita de uma arquitetura que permita organizar o código de maneira consistente, facilitando a manutenção, os testes e a evolução da aplicação.

Considerando que o sistema possui diferentes responsabilidades, como gerenciamento de usuários, permissões, equipamentos, categorias, armazenamento e empréstimos, é importante estabelecer padrões que evitem o acoplamento excessivo e a concentração de responsabilidades.

Também é necessário garantir que o desenvolvimento siga boas práticas de engenharia de software, priorizando legibilidade, reutilização controlada, testabilidade e separação de responsabilidades.

## 2. Decisão

Foi adotada a utilização dos princípios de **Clean Architecture, Clean Code e SOLID** como diretrizes arquiteturais e de qualidade de código do projeto.

A implementação será realizada utilizando a estrutura modular do NestJS, respeitando a separação entre responsabilidades de apresentação, regras de negócio e acesso a dados.

## 3. Diretrizes arquiteturais

### 3.1. Clean Architecture

A organização da aplicação deverá priorizar a separação de responsabilidades e a independência das regras de negócio em relação a ferramentas e frameworks.

As principais responsabilidades serão:

- **Presentation:** responsável pela comunicação com os clientes da API, incluindo Controllers, DTOs, Guards e validações de entrada.
- **Application:** responsável pela coordenação dos casos de uso e execução das operações da aplicação.
- **Domain:** responsável pelas regras e conceitos centrais do negócio, mantendo independência de detalhes externos.
- **Infrastructure:** responsável pela comunicação com recursos externos, como banco de dados, Prisma e serviços de terceiros.

As dependências deverão apontar preferencialmente para as regras internas da aplicação, evitando que o domínio dependa diretamente de detalhes de infraestrutura.

### 3.2. Clean Code

O desenvolvimento deverá seguir práticas que favoreçam a legibilidade e a manutenção do código:

- Utilização de nomes claros e descritivos.
- Métodos e funções com responsabilidades bem definidas.
- Evitar duplicação desnecessária de código.
- Evitar funções ou classes excessivamente extensas.
- Manter tratamento de erros consistente.
- Evitar comentários desnecessários, priorizando código expressivo.
- Padronizar a organização de arquivos e diretórios.
- Evitar dependências e abstrações sem necessidade justificada.

### 3.3. Princípios SOLID

O código deverá respeitar os cinco princípios SOLID:

- **S — Single Responsibility Principle:** cada classe ou módulo deverá possuir uma responsabilidade bem definida.
- **O — Open/Closed Principle:** componentes deverão permitir extensão sem exigir modificações desnecessárias em funcionalidades existentes.
- **L — Liskov Substitution Principle:** implementações derivadas deverão respeitar o comportamento esperado de suas abstrações.
- **I — Interface Segregation Principle:** interfaces deverão ser específicas, evitando contratos com responsabilidades desnecessárias.
- **D — Dependency Inversion Principle:** módulos de alto nível deverão depender de abstrações, e não diretamente de implementações concretas.

## 4. Organização do projeto

A aplicação será organizada em módulos de negócio, mantendo a separação das responsabilidades internas.

Cada módulo deverá possuir, quando necessário:

- Controllers: exposição dos endpoints da API.
- DTOs: definição e validação dos dados de entrada.
- Services ou Use Cases: execução das regras e operações da aplicação.
- Interfaces: definição de contratos e abstrações.
- Repositories: abstração das operações de persistência.
- Implementações de infraestrutura: integração com Prisma e outros recursos externos.

A estrutura deverá ser aplicada de forma proporcional à complexidade de cada módulo, evitando abstrações desnecessárias.

## 5. Qualidade e padronização

Para garantir a aplicação das diretrizes estabelecidas, serão utilizadas ferramentas de análise e verificação de qualidade:

- **ESLint:** análise estática e identificação de problemas no código.
- **Prettier:** padronização da formatação.
- **SonarQube Community Build:** análise de qualidade, identificação de code smells, possíveis bugs e vulnerabilidades.
- **Jest:** execução de testes automatizados.
- **GitHub Actions:** automação das verificações de qualidade no processo de integração contínua.

As verificações deverão ser executadas durante o desenvolvimento e integradas ao pipeline de CI.

## 6. Consequências

### Positivas

- Maior organização e previsibilidade do código.
- Redução do acoplamento entre componentes.
- Melhor separação das responsabilidades.
- Facilidade de manutenção e evolução.
- Maior facilidade para criar testes unitários e de integração.
- Melhor compreensão das regras de negócio.
- Padronização do desenvolvimento.
- Identificação antecipada de problemas de qualidade.

### Negativas

- Maior esforço inicial na definição da arquitetura.
- Necessidade de compreender e aplicar corretamente os princípios estabelecidos.
- Possibilidade de aumento da quantidade de arquivos e abstrações.
- Maior cuidado na definição das dependências entre módulos.

## 7. Alternativas consideradas

### Arquitetura tradicional em camadas

Foi considerada a utilização de uma arquitetura baseada apenas em Controllers, Services e Repositories.

Entretanto, essa abordagem isoladamente não estabelece necessariamente limites claros entre regras de negócio e infraestrutura.

### Arquitetura sem padrão definido

Foi considerada a utilização da estrutura padrão do framework sem diretrizes arquiteturais adicionais.

Entretanto, essa abordagem poderia gerar inconsistências de organização e dificultar a manutenção conforme o crescimento do sistema.

## 8. Resultado

A adoção de Clean Architecture, Clean Code e SOLID foi aprovada como diretriz de desenvolvimento do projeto Equipament.

Esses princípios deverão orientar a implementação dos módulos, a organização das responsabilidades, a definição das dependências e a criação dos testes automatizados.

A aplicação deverá priorizar soluções simples e justificáveis, evitando complexidade arquitetural desnecessária.
