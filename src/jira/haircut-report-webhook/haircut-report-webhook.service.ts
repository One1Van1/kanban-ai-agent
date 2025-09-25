import { Injectable, Logger } from '@nestjs/common';
import { HaircutReportWebhookDto } from './haircut-report-webhook.dto';
import { ProcessHaircutTaskService } from '../../ai-agent/process-haircut-task/process-haircut-task.service';
import { ProcessHaircutTaskDto } from '../../ai-agent/process-haircut-task/process-haircut-task.dto';

@Injectable()
export class HaircutReportWebhookService {
  private readonly logger = new Logger(HaircutReportWebhookService.name);

  constructor(
    private readonly processHaircutTaskService: ProcessHaircutTaskService,
  ) {}

  /**
   * Обрабатывает webhook события от Jira - просто передает данные AI агенту
   */
  async processWebhook(webhookData: HaircutReportWebhookDto): Promise<any> {
    this.logger.log(
      `📞 Webhook received: ${webhookData.webhookEvent} for task ${webhookData.issue?.key}`,
    );

    try {
      // Просто конвертируем webhook данные в формат для AI агента
      const taskData = this.convertWebhookToTaskData(webhookData);

      // Передаем все обработку unified AI агенту
      const result = await this.processHaircutTaskService.processTask(taskData);

      this.logger.log(
        `✅ Webhook processed for task ${taskData.taskKey}: ${result.action}`,
      );

      return {
        webhookProcessed: true,
        agentResult: result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(
        `❌ Webhook processing failed: ${error.message}`,
        error.stack,
      );

      return {
        webhookProcessed: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Конвертирует webhook данные в формат для AI агента
   */
  private convertWebhookToTaskData(
    webhookData: HaircutReportWebhookDto,
  ): ProcessHaircutTaskDto {
    const issue = webhookData.issue;
    const changelog = webhookData.changelog;

    return {
      webhookEvent: webhookData.webhookEvent,
      taskKey: issue.key,
      taskSummary: issue.fields.summary,
      taskDescription: issue.fields.description || '',
      currentStatus: issue.fields.status?.name || 'Unknown',
      assigneeName: issue.fields.assignee?.displayName || 'Unassigned',
      fromStatus: this.getPreviousStatus(changelog),
      totalTimeSeconds: issue.fields.timespent || 0,
      worklogEntries: this.extractWorklogEntries(issue),
      comments: this.extractComments(issue),
      timestamp: webhookData.timestamp
        ? String(webhookData.timestamp)
        : new Date().toISOString(),
    };
  }

  /**
   * Извлекает предыдущий статус из changelog
   */
  private getPreviousStatus(changelog: any): string {
    if (!changelog?.items) return 'Unknown';

    const statusChange = changelog.items.find(
      (item: any) => item.field === 'status',
    );
    return statusChange?.fromString || 'Unknown';
  }

  /**
   * Извлекает записи времени из задачи
   */
  private extractWorklogEntries(issue: any): any[] {
    if (!issue.fields.worklog?.worklogs) return [];

    return issue.fields.worklog.worklogs.map((worklog: any) => ({
      timeSpentSeconds: worklog.timeSpentSeconds || 0,
      started: worklog.started || '',
      comment: worklog.comment || '',
      author: {
        displayName: worklog.author?.displayName || 'Unknown',
      },
    }));
  }

  /**
   * Извлекает комментарии из задачи
   */
  private extractComments(issue: any): any[] {
    if (!issue.fields.comment?.comments) return [];

    return issue.fields.comment.comments.map((comment: any) => ({
      body: comment.body || '',
      author: {
        displayName: comment.author?.displayName || 'Unknown',
      },
      created: comment.created,
    }));
  }
}
