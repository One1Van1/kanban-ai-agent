import { Injectable, Logger } from '@nestjs/common';
import { AnalyzeNewTasksService } from '../analyze-new-tasks/analyze-new-tasks.service';
import { CheckProgressTasksService } from '../check-progress-tasks/check-progress-tasks.service';
import { RunAutoWorkflowResponse } from './run-auto-workflow.interface';

@Injectable()
export class RunAutoWorkflowService {
  private readonly logger = new Logger(RunAutoWorkflowService.name);

  constructor(
    private readonly analyzeNewTasksService: AnalyzeNewTasksService,
    private readonly checkProgressTasksService: CheckProgressTasksService,
  ) {}

  async runAutoWorkflow(): Promise<RunAutoWorkflowResponse> {
    const startTime = Date.now();
    this.logger.log('🚀 Starting AI auto workflow...');

    try {
      // 1. Анализируем задачи в New
      const newTasksResult =
        await this.analyzeNewTasksService.analyzeNewTasks();

      // 2. Проверяем задачи в In Progress
      const progressTasksResult =
        await this.checkProgressTasksService.checkProgressTasks();

      const endTime = Date.now();
      const duration = endTime - startTime;

      const result: RunAutoWorkflowResponse = {
        timestamp: new Date().toISOString(),
        newTasks: {
          analyzed: newTasksResult.tasksAnalyzed,
          moved: newTasksResult.tasksMoved,
        },
        progressTasks: {
          checked: progressTasksResult.tasksChecked,
          moved: progressTasksResult.tasksMoved,
        },
        totalMoved: newTasksResult.tasksMoved + progressTasksResult.tasksMoved,
        duration,
      };

      this.logger.log(
        `✅ Auto workflow complete in ${duration}ms. Total tasks moved: ${result.totalMoved}`,
      );
      return result;
    } catch (error) {
      this.logger.error('❌ Auto workflow failed:', error.message);
      throw error;
    }
  }
}
