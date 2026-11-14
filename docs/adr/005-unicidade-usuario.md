# ADR-004 — Restrição de unicidade para identificação de usuários

- **Status:** Aceita
- **Data:** 14/11/2026
- **Decisores:** Equipe de desenvolvimento
- **Contexto:** Modelagem do banco de dados — módulo User

## 1. Contexto

Durante a modelagem da entidade `User`, foi identificada a necessidade de reduzir cadastros duplicados de usuários.

Apenas a restrição de unicidade no e-mail não impede que uma mesma pessoa seja cadastrada novamente utilizando outro endereço de e-mail.

Para reduzir esse risco, foi definida uma segunda restrição de unicidade sobre o campo `name`.

## 2. Decisão

Os campos `name` e `email` da entidade `User` deverão possuir restrições de unicidade (`@unique`) no Prisma, garantindo que o banco de dados rejeite registros que apresentem valores já cadastrados.

Implementação:

```prisma
model User {
  id       Int    @id @default(autoincrement())
  name     String @unique
  email    String @unique
  password String
  active   Boolean @default(true)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 3. Justificativa

A decisão busca:

- Reduzir a possibilidade de cadastros duplicados.
- Evitar que um mesmo usuário seja registrado com diferentes endereços de e-mail.
- Centralizar a garantia de unicidade no banco de dados.
- Evitar consultas prévias desnecessárias antes de cada tentativa de cadastro.
- Garantir a integridade dos dados mesmo quando houver requisições simultâneas.

A restrição será aplicada diretamente pelo PostgreSQL, utilizando os índices únicos gerados pelo Prisma.

## 4. Consequências

### Positivas

- Maior controle sobre a duplicidade cadastral.
- Integridade garantida pelo banco de dados.
- Menor dependência de verificações prévias na aplicação.
- Tratamento padronizado de conflitos de unicidade.

### Negativas

- Pessoas diferentes com o mesmo nome completo não poderão ser cadastradas.
- Alterações de nome poderão gerar conflitos caso o novo nome já esteja cadastrado.
- A unicidade do nome não garante, por si só, a identificação inequívoca de uma pessoa.

## 5. Tratamento de erros

A aplicação NestJS deverá capturar a violação de unicidade do Prisma (`P2002`) e retornar HTTP `409 Conflict`, informando que o nome ou e-mail já está cadastrado.

A verificação prévia poderá ser utilizada para melhorar a experiência do usuário, mas não será considerada garantia de integridade.

## 6. Alternativas consideradas

- **Somente e-mail único:** descartada por não impedir cadastros com nomes já existentes.
- **Identificação por CPF:** considerada uma alternativa mais confiável para identificar pessoas, mas não adotada nesta versão devido ao escopo atual e às responsabilidades adicionais relacionadas à proteção de dados pessoais.
- **Nome e e-mail únicos:** escolhida por sua simplicidade de implementação e por atender à regra de negócio definida para a versão atual.

## 7. Revisão futura

A decisão poderá ser revisada caso o sistema passe a atender um cenário com múltiplas pessoas homônimas.

Nesse caso, poderá ser adotado um identificador pessoal apropriado, respeitando os princípios de necessidade e proteção de dados da LGPD.
