# ADR-005 — Simplificação e definição da estrutura inicial do banco de dados

- **Status:** Aceita
- **Data:** 14/11/2026
- **Decisores:** Equipe de desenvolvimento
- **Contexto:** Modelagem de dados — Projeto Equipament

## 1. Contexto

Durante o desenvolvimento do projeto Equipament, foi identificada a necessidade de simplificar a estrutura inicial do banco de dados.

A modelagem anterior contemplava uma quantidade maior de entidades e funcionalidades, aumentando o esforço de implementação e o tempo necessário para concluir a entrega acadêmica.

Considerando o prazo de desenvolvimento e os requisitos obrigatórios do projeto, foi tomada a decisão de reduzir a estrutura inicial para seis tabelas, priorizando as funcionalidades essenciais de gerenciamento de usuários, permissões, equipamentos e locais de armazenamento.

## 2. Decisão

O banco de dados inicial será composto por seis tabelas:

| Tabela           | Responsabilidade                                  |
| ---------------- | ------------------------------------------------- |
| User             | Cadastro e gerenciamento de usuários              |
| Roles            | Definição dos papéis de acesso                    |
| UserRoles        | Associação entre usuários e papéis                |
| Equipament       | Cadastro e gerenciamento de equipamentos          |
| Storage          | Cadastro dos locais de armazenamento              |
| StorageEquipUser | Associação entre equipamento, local e responsável |

A implementação utilizará Prisma ORM com PostgreSQL.

## 3. Relacionamentos e regras de negócio

### 3.1. Usuários e permissões

Será utilizado o modelo RBAC (Role-Based Access Control) para gerenciamento de permissões.

- Um usuário poderá possuir várias Roles.
- Uma Role poderá estar associada a vários usuários.
- Não será permitida a associação duplicada entre o mesmo usuário e a mesma Role.
- Todo usuário criado pela API receberá automaticamente a Role `public`.
- A Role `adm` será reservada para atribuição administrativa.

A tabela `UserRoles` será responsável por manter essa associação.

### 3.2. Gerenciamento de equipamentos

A tabela `Equipament` será responsável pelo cadastro dos equipamentos.

- Cada equipamento possuirá um código exclusivo.
- Os equipamentos poderão ser ativados ou desativados.
- Os dados de criação e atualização serão registrados.

### 3.3. Locais de armazenamento

A tabela `Storage` será responsável pelo cadastro dos locais físicos onde os equipamentos poderão ser armazenados.

- Cada local possuirá um nome exclusivo.
- Será possível identificar se o local está cheio.
- Os locais poderão armazenar vários equipamentos.

### 3.4. Associação entre equipamento, usuário e armazenamento

A tabela `StorageEquipUser` será responsável por relacionar três entidades:

- Usuário responsável.
- Local físico de armazenamento.
- Equipamento correspondente.

Cada equipamento poderá possuir somente um registro nessa tabela, garantindo um único responsável e uma única localização atual.

Essa regra será implementada por meio de uma restrição de unicidade no campo `id_equipament`.

## 4. Justificativa

A simplificação foi adotada para:

- Reduzir a complexidade inicial da modelagem.
- Priorizar os requisitos essenciais da entrega acadêmica.
- Facilitar a implementação e os testes dos módulos.
- Manter a integridade referencial entre as entidades.
- Permitir evolução incremental do sistema.
- Evitar funcionalidades desnecessárias durante a primeira entrega.

A decisão não representa uma limitação definitiva da arquitetura, mas uma definição de escopo para a versão inicial.

## 5. Consequências

### Positivas

- Menor quantidade de entidades para implementar e testar.
- Estrutura mais objetiva e fácil de manter.
- Redução da complexidade dos relacionamentos.
- Maior foco nas regras de negócio essenciais.
- Possibilidade de implementar novas funcionalidades posteriormente.

### Negativas

- Funcionalidades adicionais não estarão disponíveis na versão inicial.
- A ausência de uma tabela de histórico impede o registro estruturado das movimentações anteriores.
- A tabela de associação representará somente a situação atual do equipamento.

## 6. Alternativas consideradas

- **Manter a modelagem anterior:** descartada devido à complexidade e ao tempo necessário para implementar todas as entidades.
- **Adicionar todas as funcionalidades inicialmente planejadas:** descartada para evitar ampliação do escopo da entrega acadêmica.
- **Simplificar para seis tabelas e evoluir por funcionalidades:** escolhida por permitir uma implementação incremental sem comprometer as funcionalidades essenciais.

## 7. Evolução futura

Novas entidades poderão ser adicionadas conforme a necessidade do projeto.

Entre as possibilidades de evolução estão:

- Histórico de movimentações dos equipamentos.
- Controle de empréstimos e devoluções.
- Categorias de equipamentos.
- Controle de capacidade dos locais de armazenamento.

Essas funcionalidades serão avaliadas e documentadas em novas decisões arquiteturais, quando forem incorporadas ao escopo.

## 8. Considerações finais

A estrutura inicial de seis tabelas foi definida como base para o desenvolvimento da primeira versão do Equipament.

A prioridade será garantir a integridade dos dados, a consistência dos relacionamentos e a implementação correta das regras de negócio antes de ampliar a estrutura do banco de dados.
