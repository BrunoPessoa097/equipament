# ADR-002: Escolha do Prisma ORM

- **Status:** Aceita
- **Data:** 13/11/2026
- **Decisores:** Equipe de desenvolvimento
- **Contexto:** Projeto Equipament

## 1. Contexto

O projeto Equipament utiliza PostgreSQL como sistema gerenciador de banco de dados para armazenar informações relacionadas a usuários, permissões, equipamentos, categorias, locais de armazenamento, empréstimos e histórico de movimentações.

A aplicação necessita de uma camada de persistência que permita realizar operações de leitura e escrita de maneira organizada, segura e integrada ao backend desenvolvido com NestJS e TypeScript.

Também é necessário manter a consistência entre os modelos da aplicação e a estrutura do banco de dados, facilitando a manutenção e a evolução do esquema.

## 2. Decisão

Foi escolhido o **Prisma ORM** como ferramenta de mapeamento objeto-relacional (ORM) para realizar a comunicação entre a aplicação NestJS e o banco de dados PostgreSQL.

## 3. Justificativa

A escolha do Prisma foi baseada nos seguintes fatores:

- **Integração com TypeScript:** disponibiliza tipagem estática e geração automática de tipos com base no esquema do banco de dados.
- **Prisma Schema:** permite definir modelos, atributos, relacionamentos e restrições em uma estrutura declarativa.
- **Migrações:** possibilita versionar e aplicar alterações na estrutura do banco de dados de maneira controlada.
- **Segurança de tipos:** reduz erros relacionados à construção de consultas e manipulação de dados.
- **Produtividade:** simplifica operações CRUD e consultas relacionais.
- **Manutenibilidade:** centraliza a definição dos modelos e facilita a evolução da estrutura de persistência.
- **Integração com NestJS:** permite implementar uma camada de acesso a dados organizada por meio de serviços e injeção de dependência.

## 4. Consequências

### Positivas

- Maior segurança de tipos durante o desenvolvimento.
- Redução da necessidade de escrever SQL manualmente para operações comuns.
- Facilidade de manutenção dos modelos e relacionamentos.
- Controle de alterações no banco por meio de migrações.
- Integração com PostgreSQL e TypeScript.
- Maior produtividade na implementação das regras de persistência.

### Negativas

- Necessidade de aprender a sintaxe e os conceitos específicos do Prisma.
- Dependência da ferramenta para operações convencionais de persistência.
- Consultas SQL mais complexas podem exigir utilização de recursos específicos ou SQL nativo.
- Alterações no esquema podem exigir atualização e regeneração do Prisma Client.

## 5. Alternativas consideradas

### TypeORM

Foi considerado por sua integração com TypeScript e suporte a diferentes bancos relacionais.

Entretanto, o Prisma oferece uma abordagem baseada em schema declarativo e geração de tipos que se alinha melhor à proposta de desenvolvimento do projeto.

### Sequelize

Foi considerado por sua maturidade e utilização no ecossistema Node.js.

Entretanto, sua abordagem não oferece a mesma experiência de tipagem e geração automática de consultas disponibilizada pelo Prisma.

### SQL nativo

Foi considerado por proporcionar controle direto sobre as consultas e operações no banco de dados.

Entretanto, exigiria maior implementação manual de consultas, mapeamento de resultados e manutenção da camada de persistência.

## 6. Resultado

A adoção do Prisma ORM foi aprovada para gerenciar a persistência de dados do projeto Equipament, proporcionando integração com PostgreSQL, segurança de tipos e facilidade de manutenção.

A ferramenta será utilizada como camada de acesso a dados, mantendo a lógica de negócio separada da persistência e respeitando os princípios de responsabilidade única e baixo acoplamento.
