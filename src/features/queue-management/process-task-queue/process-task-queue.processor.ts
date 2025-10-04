import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

export interface ProcessTaskData {
  taskId: string;
  taskType: string;
  data: any;
  createdAt: string;
}

@Processor('ai-agent-tasks')
export class ProcessTaskQueueProcessor {
  private readonly logger = new Logger(ProcessTaskQueueProcessor.name);

  @Process('*')
  async handleTask(job: Job<ProcessTaskData>) {
    const { taskId, taskType, data } = job.data;

    this.logger.log(`Processing task ${taskId} of type: ${taskType}`);
    this.logger.debug(`Task data:`, data);

    try {
      // Simulate task processing
      await this.processTaskByType(taskType, data);

      this.logger.log(`Task ${taskId} completed successfully`);
      return { success: true, taskId, completedAt: new Date().toISOString() };
    } catch (error) {
      this.logger.error(`Task ${taskId} failed:`, error);
      throw error;
    }
  }

  private async processTaskByType(taskType: string, data: any): Promise<void> {
    // Simulate different processing times based on task type
    const processingMap: Record<string, number> = {
      'ai-analysis': 3000,
      'send-notification': 1000,
      'generate-report': 5000,
      default: 2000,
    };

    const delay = processingMap[taskType] || processingMap['default'];

    this.logger.log(`Processing ${taskType} task for ${delay}ms`);
    await new Promise((resolve) => setTimeout(resolve, delay));

    this.logger.log(`Finished processing ${taskType} task`);
  }
}
