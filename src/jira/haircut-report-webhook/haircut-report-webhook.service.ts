import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HaircutReportWebhookDto } from './haircut-report-webhook.dto';
import { ProcessHaircutTaskService } from '../../ai-agent/process-haircut-task/process-haircut-task.service';
import { ProcessHaircutTaskDto } from '../../ai-agent/process-haircut-task/process-haircut-task.dto';
import axios from 'axios';

@Injectable()
export class HaircutReportWebhookService {
  private readonly logger = new Logger(HaircutReportWebhookService.name);

  constructor(
    private readonly processHaircutTaskService: ProcessHaircutTaskService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Обрабатывает webhook события от Jira - просто передает данные AI агенту
   */
  async processWebhook(webhookData: HaircutReportWebhookDto): Promise<any> {
    this.logger.log(
      `📞 Webhook received: ${webhookData.webhookEvent} for task ${webhookData.issue?.key}`,
    );

    try {
      // Просто конвертируем webhook данные в формат для AI агента (с полными данными из Jira)
      const taskData = await this.convertWebhookToTaskData(webhookData);

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
  private async convertWebhookToTaskData(
    webhookData: HaircutReportWebhookDto,
  ): Promise<ProcessHaircutTaskDto> {
    const issue = webhookData.issue;
    const changelog = webhookData.changelog;

    // Получаем полные данные задачи из Jira API
    let fullIssue = issue;
    try {
      const fullTaskResponse = await axios.get(
        `/rest/api/3/issue/${issue.key}?expand=changelog`,
        {
          baseURL: this.configService.get<string>('jira.baseUrl'),
          auth: {
            username: this.configService.get<string>('jira.email') || '',
            password: this.configService.get<string>('jira.apiToken') || '',
          },
        },
      );
      fullIssue = fullTaskResponse.data;
      this.logger.log(`📥 Fetched full data for ${issue.key}`);
    } catch (error) {
      this.logger.warn(
        `⚠️ Could not fetch full data for ${issue.key}, using webhook data`,
      );
    }

    return {
      webhookEvent: webhookData.webhookEvent,
      taskKey: fullIssue.key,
      taskSummary: fullIssue.fields.summary,
      taskDescription:
        this.extractTextFromADF(fullIssue.fields.description) || '',
      currentStatus: fullIssue.fields.status?.name || 'Unknown',
      assigneeName: fullIssue.fields.assignee?.displayName || 'Unassigned',
      fromStatus: this.getPreviousStatus(changelog),
      totalTimeSeconds: fullIssue.fields.timespent || 0,
      worklogEntries: this.extractWorklogEntries(fullIssue),
      comments: this.extractComments(fullIssue),
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
      body: this.extractTextFromADF(comment.body) || '',
      author: {
        displayName: comment.author?.displayName || 'Unknown',
      },
      created: comment.created,
    }));
  }

  /**
   * Извлекает текст из Atlassian Document Format (ADF)
   */
  private extractTextFromADF(adfObject: any): string {
    if (!adfObject) return '';

    if (typeof adfObject === 'string') return adfObject;

    if (adfObject.type === 'text') {
      return adfObject.text || '';
    }

    if (adfObject.content && Array.isArray(adfObject.content)) {
      return adfObject.content
        .map((item: any) => this.extractTextFromADF(item))
        .filter((text: string) => text.trim().length > 0)
        .join(' ');
    }

    return '';
  }
}
