import { Controller, Get } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('metrics')
@ApiTags('Metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  @ApiOperation({ summary: 'Consultar métricas da aplicação' })
  @ApiResponse({
    status: 200,
    description: 'Métricas retornadas com sucesso.',
    schema: {
      example: {
        uptimeSeconds: 96,
        totalRequests: 79,
        totalErrors: 0,
        averageResponseTimeMs: 0.24,
      },
    },
  })
  getMetrics() {
    return this.metricsService.getMetrics();
  }
}
