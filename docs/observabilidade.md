# Observabilidade e SLO

## Métricas

A API Equipament possui um mecanismo simples de monitoramento por meio do endpoint `GET /metrics`.

São coletadas as seguintes informações:

- `uptimeSeconds`: tempo de atividade da aplicação em segundos.
- `totalRequests`: quantidade total de requisições processadas.
- `totalErrors`: quantidade de respostas com status HTTP de erro (400 ou superior).
- `averageResponseTimeMs`: tempo médio de resposta em milissegundos.

## SLO — Service Level Objective

Foram definidos os seguintes objetivos de nível de serviço:

| Indicador               |   Objetivo |
| ----------------------- | ---------: |
| Disponibilidade         |        99% |
| Tempo médio de resposta | Até 500 ms |

Esses objetivos servem como referência para avaliar a disponibilidade e o desempenho da API.

## Consulta

Com a aplicação em execução, consulte:

`GET http://localhost:3000/metrics`

As métricas são mantidas em memória durante a execução da aplicação e reiniciadas quando ela é reiniciada.

## Limitações

O monitoramento atual é básico e não utiliza armazenamento histórico, alertas ou ferramentas externas de observabilidade.
