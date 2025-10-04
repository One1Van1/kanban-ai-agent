import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthCheckService } from './health-check.service';
import { HealthCheckResponse } from './health-check.interface';

@ApiTags('health')
@Controller('jira')
export class HealthCheckController {
  constructor(private readonly healthCheckService: HealthCheckService) {}

  /**
   * Проверить подключение к Jira
   */
  @Get('health')
  @ApiOperation({
    summary: 'Проверить состояние подключения к Jira',
    description: 'Проверяет доступность и корректность подключения к Jira API',
  })
  @ApiResponse({
    status: 200,
    description: 'Статус подключения получен',
    schema: {
      example: {
        status: 'healthy',
        timestamp: '2025-09-22T15:04:11.000Z',
      },
    },
  })
  async checkHealth(): Promise<HealthCheckResponse> {
    return this.healthCheckService.checkHealth();
  }
}
