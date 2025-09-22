import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RunAutoWorkflowService } from '../run-auto-workflow/run-auto-workflow.service';

@Injectable()
export class AiAgentSchedulerService {
  private readonly logger = new Logger(AiAgentSchedulerService.name);

  constructor(
    private readonly runAutoWorkflowService: RunAutoWorkflowService,
  ) {}

  /**
   * Запускает AI workflow каждую минуту
   * ВРЕМЕННО ОТКЛЮЧЕНО для тестирования
   */
  // @Cron(CronExpression.EVERY_MINUTE)
  async handleAutoWorkflow() {
    this.logger.log('⏰ Running scheduled AI workflow...');

    try {
      const result = await this.runAutoWorkflowService.runAutoWorkflow();
      this.logger.log(
        `⏰ Scheduled workflow complete: ${result.totalMoved} tasks moved in ${result.duration}ms`,
      );
    } catch (error) {
      this.logger.error('⏰ Scheduled workflow failed:', error.message);
    }
  }
}
