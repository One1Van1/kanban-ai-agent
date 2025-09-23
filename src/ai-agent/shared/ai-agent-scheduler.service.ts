import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RunAutoWorkflowService } from '../run-auto-workflow/run-auto-workflow.service';
import { AnalyzeHaircutTasksService } from '../analyze-haircut-tasks/analyze-haircut-tasks.service';
import { ExecuteHaircutTasksService } from '../execute-haircut-tasks/execute-haircut-tasks.service';

@Injectable()
export class AiAgentSchedulerService {
  private readonly logger = new Logger(AiAgentSchedulerService.name);

  constructor(
    private readonly runAutoWorkflowService: RunAutoWorkflowService,
    private readonly analyzeHaircutTasksService: AnalyzeHaircutTasksService,
    private readonly executeHaircutTasksService: ExecuteHaircutTasksService,
  ) {}

  /**
   * Запускает AI workflow каждую минуту
   * ВРЕМЕННО ОТКЛЮЧЕНО для тестирования стрижек
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

  /**
   * Запускает анализ задач о стрижках каждую минуту
   * Проверяет колонку New на наличие задач о стрижках
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async handleHaircutScheduler() {
    this.logger.log('✂️ Running scheduled haircut analysis...');

    try {
      // 1. Анализируем задачи в New (перемещаем в In Progress или Questions)
      const analyzeResult = await this.analyzeHaircutTasksService.execute({
        sourceColumn: 'New',
      });

      if (analyzeResult.tasksAnalyzed > 0) {
        this.logger.log(
          `✂️ Analysis complete: ${analyzeResult.tasksMoved}/${analyzeResult.tasksAnalyzed} tasks processed`,
        );
      }

      // 2. Выполняем стрижки в In Progress (перемещаем в Review)
      const executeResult = await this.executeHaircutTasksService.execute({
        sourceColumn: 'In Progress',
      });

      if (executeResult.tasksExecuted > 0) {
        this.logger.log(
          `🚀 Execution complete: ${executeResult.tasksCompleted}/${executeResult.tasksExecuted} haircuts executed`,
        );
      }

      // Общий итог
      const totalProcessed =
        analyzeResult.tasksAnalyzed + executeResult.tasksExecuted;
      if (totalProcessed === 0) {
        this.logger.debug(
          '✂️ No haircut tasks found in New or In Progress columns',
        );
      } else {
        this.logger.log(
          `✂️ Haircut workflow complete: ${totalProcessed} tasks processed`,
        );
      }
    } catch (error) {
      this.logger.error('✂️ Haircut scheduler failed:', error.message);
    }
  }
}
