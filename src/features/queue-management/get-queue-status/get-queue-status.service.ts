import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

export interface QueueStatusResponse {
  queueName: string;
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  paused: boolean;
}

@Injectable()
export class GetQueueStatusService {
  private readonly logger = new Logger(GetQueueStatusService.name);

  constructor(
    @InjectQueue('ai-agent-tasks') private readonly aiAgentQueue: Queue,
  ) {}

  async getQueueStatus(): Promise<QueueStatusResponse> {
    try {
      this.logger.log('Getting queue status for ai-agent-tasks');

      const [waiting, active, completed, failed, delayed] = await Promise.all([
        this.aiAgentQueue.getWaiting(),
        this.aiAgentQueue.getActive(),
        this.aiAgentQueue.getCompleted(),
        this.aiAgentQueue.getFailed(),
        this.aiAgentQueue.getDelayed(),
      ]);

      const isPaused = await this.aiAgentQueue.isPaused();

      const status: QueueStatusResponse = {
        queueName: 'ai-agent-tasks',
        waiting: waiting.length,
        active: active.length,
        completed: completed.length,
        failed: failed.length,
        delayed: delayed.length,
        paused: isPaused,
      };

      this.logger.log(`Queue status: ${JSON.stringify(status)}`);
      return status;
    } catch (error) {
      this.logger.error('Failed to get queue status:', error);
      throw error;
    }
  }
}
