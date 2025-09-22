import { Controller, Get } from '@nestjs/common';
import { HealthCheckService } from './health-check.service';
import { HealthCheckResponse } from './health-check.interface';

@Controller('jira')
export class HealthCheckController {
  constructor(private readonly healthCheckService: HealthCheckService) {}

  /**
   * Проверить подключение к Jira
   */
  @Get('health')
  async checkHealth(): Promise<HealthCheckResponse> {
    return this.healthCheckService.checkHealth();
  }
}
