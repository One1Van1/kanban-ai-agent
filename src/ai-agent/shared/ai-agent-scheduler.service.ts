import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RunAutoWorkflowService } from '../run-auto-workflow/run-auto-workflow.service';
import { AnalyzeHaircutTasksService } from '../analyze-haircut-tasks/analyze-haircut-tasks.service';

@Injectable()
export class AiAgentSchedulerService {
  private readonly logger = new Logger(AiAgentSchedulerService.name);

  constructor(
    private readonly runAutoWorkflowService: RunAutoWorkflowService,
    private readonly analyzeHaircutTasksService: AnalyzeHaircutTasksService,
  ) {}

  /**
   * Запускает AI workflow каждую минуту
   * ВРЕМЕННО ОТКЛЮЧЕНО для тестирования
   */
  @Cron(CronExpression.EVERY_MINUTE)
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

  /**
   * Запускает анализ задач о стрижках каждую минуту
   * Проверяет колонку New на наличие задач о стрижках
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async handleHaircutScheduler() {
    this.logger.log('✂️ Running scheduled haircut analysis...');

    try {
      const result = await this.analyzeHaircutTasksService.execute({
        sourceColumn: 'New',
      });

      if (result.tasksAnalyzed > 0) {
        this.logger.log(
          `✂️ Haircut scheduler complete: ${result.tasksMoved}/${result.tasksAnalyzed} tasks processed`,
        );
      } else {
        this.logger.debug('✂️ No haircut tasks found in New column');
      }
    } catch (error) {
      this.logger.error('✂️ Haircut scheduler failed:', error.message);
    }
  }
}
