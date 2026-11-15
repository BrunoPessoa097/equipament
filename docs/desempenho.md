# Teste de Desempenho — Equipament API

## Ferramenta

Foi utilizado o [k6](https://grafana.com/docs/k6/latest/) para realizar o teste de carga da API.

## Configuração do teste

- Usuários virtuais: 1
- Duração: 30 segundos
- Endpoint: `GET /metrics`
- Ambiente: execução local com Docker

## Resultados

| Métrica                  | Resultado |
| ------------------------ | --------: |
| Total de requisições     |        30 |
| Requisições por segundo  |      0,99 |
| Requisições com sucesso  |      100% |
| Requisições com falha    |        0% |
| Tempo médio de resposta  |   4,24 ms |
| Tempo máximo de resposta |  39,89 ms |
| Percentil 95 (p95)       |   6,76 ms |

## Critérios de aceitação

- Taxa de falhas inferior a 1%: aprovado.
- Percentil 95 inferior a 500 ms: aprovado.
- Todas as verificações HTTP 200: aprovadas.

## Conclusão

O teste foi concluído com 30 requisições, sem falhas. O tempo de resposta p95 foi de 6,76 ms, atendendo aos critérios definidos para este teste.

Este resultado representa uma execução local com apenas um usuário virtual e não deve ser interpretado como garantia de desempenho sob alta concorrência.
