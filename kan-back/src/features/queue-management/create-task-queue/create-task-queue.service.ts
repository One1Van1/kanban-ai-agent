import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import {
  CreateTaskQueueRequestDto,
  CreateTaskQueueResponseDto,
  TaskPriority,
} from './create-task-queue.dto';

@Injectable()
export class CreateTaskQueueService {
  private readonly logger = new Logger(CreateTaskQueueService.name);

  constructor(
    @InjectQueue('ai-agent-tasks') private readonly aiAgentQueue: Queue,
  ) {}

  async addTaskToQueue(
    requestDto: CreateTaskQueueRequestDto,
  ): Promise<CreateTaskQueueResponseDto> {
    try {
      this.logger.log(
        `Adding task ${requestDto.taskId} to queue with type: ${requestDto.taskType}`,
      );

      const jobOptions = {
        priority: this.getPriorityValue(
          requestDto.priority || TaskPriority.NORMAL,
        ),
        delay: requestDto.delay || 0,
        attempts: requestDto.attempts || 3,
        removeOnComplete: 100,
        removeOnFail: 50,
      };

      const job = await this.aiAgentQueue.add(
        requestDto.taskType,
        {
          taskId: requestDto.taskId,
          taskType: requestDto.taskType,
          data: requestDto.data,
          createdAt: new Date().toISOString(),
        },
        jobOptions,
      );

      this.logger.log(
        `Task ${requestDto.taskId} added to queue with job ID: ${job.id}`,
      );

      return {
        success: true,
        jobId: job.id.toString(),
        taskId: requestDto.taskId,
        queueName: 'ai-agent-tasks',
        message: `Task ${requestDto.taskId} successfully added to queue`,
      };
    } catch (error) {
      this.logger.error(
        `Failed to add task ${requestDto.taskId} to queue:`,
        error,
      );
      throw error;
    }
  }

  private getPriorityValue(priority: TaskPriority): number {
    const priorityMap = {
      [TaskPriority.LOW]: 1,
      [TaskPriority.NORMAL]: 5,
      [TaskPriority.HIGH]: 10,
      [TaskPriority.CRITICAL]: 20,
    };
    return priorityMap[priority];
  }
}
