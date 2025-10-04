import { Injectable } from '@nestjs/common';
import { JiraBaseService } from '../../../shared/jira/jira-base.service';
import { HealthCheckResponse } from './health-check.interface';

@Injectable()
export class HealthCheckService extends JiraBaseService {
  async checkHealth(): Promise<HealthCheckResponse> {
    const isConnected = await this.testConnection();
    return {
      status: isConnected ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
    };
  }
}
