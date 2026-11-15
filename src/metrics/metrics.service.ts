import { Injectable } from '@nestjs/common';

@Injectable()
export class MetricsService {
  private totalRequests = 0;
  private totalErrors = 0;
  private totalResponseTime = 0;
  private readonly startTime = Date.now();

  recordRequest(statusCode: number, responseTime: number): void {
    this.totalRequests++;
    this.totalResponseTime += responseTime;

    if (statusCode >= 400) {
      this.totalErrors++;
    }
  }

  getMetrics() {
    return {
      uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
      totalRequests: this.totalRequests,
      totalErrors: this.totalErrors,
      averageResponseTimeMs:
        this.totalRequests > 0
          ? Number((this.totalResponseTime / this.totalRequests).toFixed(2))
          : 0,
    };
  }
}
