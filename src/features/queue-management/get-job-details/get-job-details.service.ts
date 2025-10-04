import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

export interface JobDetailsResponse {
  id: string;
  name: string;
  data: any;
  progress: number;
  attemptsMade: number;
  processedOn?: number;
  finishedOn?: number;
  failedReason?: string;
}

@Injectable()
export class GetJobDetailsService {
  private readonly logger = new Logger(GetJobDetailsService.name);

  constructor(
    @InjectQueue('ai-agent-tasks') private readonly aiAgentQueue: Queue,
  ) {}

  async getJobDetails(jobId: string): Promise<JobDetailsResponse | null> {
    try {
      const job = await this.aiAgentQueue.getJob(jobId);
      if (!job) {
        return null;
      }

      return {
        id: job.id.toString(),
        name: job.name,
        data: job.data,
        progress: job.progress(),
        attemptsMade: job.attemptsMade,
        processedOn: job.processedOn,
        finishedOn: job.finishedOn,
        failedReason: job.failedReason,
      };
    } catch (error) {
      this.logger.error(`Failed to get job ${jobId} details:`, error);
      throw error;
    }
  }
}
