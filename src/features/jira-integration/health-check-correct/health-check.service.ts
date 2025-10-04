import { Injectable } from '@nestjs/common';
import { JiraBaseService } from '../../../shared/jira/jira-base.service';
import { HealthCheckResponseDto } from './health-check.response.dto';

@Injectable()
export class HealthCheckService extends JiraBaseService {
  async execute(): Promise<HealthCheckResponseDto> {
    try {
      // Простая проверка подключения
      const isConnected = await this.testConnection();

      if (isConnected) {
        return new HealthCheckResponseDto(
          'ok',
          this.getConfig().baseUrl,
          this.getConfig().projectKey,
          {
            message: 'Jira connection is healthy',
          },
        );
      } else {
        throw new Error('Connection test failed');
      }
    } catch (error) {
      this.logger.error('Jira health check failed', error.stack);

      return new HealthCheckResponseDto(
        'error',
        this.getConfig().baseUrl || 'unknown',
        this.getConfig().projectKey || 'unknown',
        {
          error: error.message,
        },
      );
    }
  }
}
