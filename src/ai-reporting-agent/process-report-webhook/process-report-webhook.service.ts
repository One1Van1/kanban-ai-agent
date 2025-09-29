import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProcessReportWebhookDto } from './process-report-webhook.dto';
import { GenerateReportService } from '../generate-report/generate-report.service';

@Injectable()
export class ProcessReportWebhookService {
  private readonly logger = new Logger(ProcessReportWebhookService.name);
  private readonly processingTasks = new Set<string>();

  constructor(
    private readonly configService: ConfigService,
    private readonly generateReportService: GenerateReportService,
  ) {}

  async processWebhook(payload: any): Promise<string> {
    this.logger.log(
      `🎯 Processing report webhook: ${payload.webhookEvent || 'unknown'}`,
    );

    try {
      const eventType = payload.webhookEvent;
      const issue = payload.issue;

      if (!issue) {
        this.logger.warn('⚠️ No issue data in webhook payload');
        return 'No issue data';
      }

      const taskKey = issue.key;
      const assigneeDisplayName = issue.fields.assignee?.displayName;
      const status = issue.fields.status?.name;

      this.logger.log(
        `📋 Task: ${taskKey}, Assignee: ${assigneeDisplayName}, Status: ${status}`,
      );

      // Check if assigned to AI-Report-maker
      if (!assigneeDisplayName || assigneeDisplayName !== 'AI-Report-maker') {
        this.logger.log(
          `⏩ Task ${taskKey} not assigned to AI-Report-maker, skipping`,
        );
        return `Task not assigned to AI-Report-maker`;
      }

      // Check if it's a relevant event type
      if (!['jira:issue_updated', 'jira:issue_created'].includes(eventType)) {
        this.logger.log(
          `⏩ Event type ${eventType} not supported for report processing`,
        );
        return `Event type not supported`;
      }

      // Check if task is in "In Progress" status (when someone moves it to work)
      if (status !== 'In Progress') {
        this.logger.log(
          `⏩ Task ${taskKey} status "${status}" not in trigger list [In Progress]`,
        );
        return `Status not in trigger list`;
      }

      // Prevent duplicate processing
      if (this.processingTasks.has(taskKey)) {
        this.logger.warn(
          `🔒 Task ${taskKey} is already being processed, skipping`,
        );
        return 'Task already being processed';
      }

      // Add to processing set
      this.processingTasks.add(taskKey);

      try {
        // Process the report task
        await this.generateReportService.processReportTask(taskKey);

        this.logger.log(`✅ Report webhook completed for ${taskKey}`);
        return `Report generated successfully for ${taskKey}`;
      } finally {
        // Remove from processing set
        this.processingTasks.delete(taskKey);
      }
    } catch (error) {
      this.logger.error('❌ Error processing report webhook:', error);
      throw error;
    }
  }

  async healthCheck(): Promise<{ status: string; processingTasks: number }> {
    return {
      status: 'healthy',
      processingTasks: this.processingTasks.size,
    };
  }
}
