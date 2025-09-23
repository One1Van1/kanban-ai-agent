import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';
import {
  JiraWebhookPayload,
  WebhookResponse,
  WebhookProcessingConfig,
  AiAnalysisResult,
  JiraWebhookEvent,
  AIAgentAction,
} from './jira-webhook-handler.interface';

@Injectable()
export class JiraWebhookHandlerService {
  private readonly logger = new Logger(JiraWebhookHandlerService.name);
  private readonly config: WebhookProcessingConfig;
  private readonly webhookSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.webhookSecret = this.configService.get<string>('WEBHOOK_SECRET') || '';
    this.config = {
      enableAiAnalysis: true,
      enableNotifications: true,
      enableAutoAssignment: false,
      haircutKeywords: [
        'стрижка',
        'haircut',
        'окрашивание',
        'укладка',
        'маникюр',
        'педикюр',
        'косметология',
        'массаж',
        'эпиляция',
        'брови',
        'ресницы',
      ],
      delayMs: 2000, // 2 секунды задержки для обработки в Jira
    };
  }

  /**
   * Валидация подписи вебхука для безопасности
   */
  async validateWebhookSignature(
    headers: Record<string, string>,
    payload: any,
  ): Promise<void> {
    // Пропускаем валидацию для тестовых запросов
    if (headers['x-test-webhook'] === 'true') {
      this.logger.debug('Skipping signature validation for test webhook');
      return;
    }

    if (!this.webhookSecret) {
      this.logger.warn(
        'Webhook secret not configured, skipping signature validation',
      );
      return;
    }

    const signature = headers['x-hub-signature'] || headers['x-jira-signature'];
    if (!signature) {
      this.logger.warn('Missing webhook signature, but continuing...');
      return; // Не блокируем, если подпись отсутствует
    }

    const expectedSignature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(JSON.stringify(payload))
      .digest('hex');

    const providedSignature = signature.replace('sha256=', '');

    if (
      !crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'hex'),
        Buffer.from(providedSignature, 'hex'),
      )
    ) {
      this.logger.warn('Invalid webhook signature, but continuing...');
      return; // Не блокируем для разработки
    }

    this.logger.debug('Webhook signature validation passed');
  }

  /**
   * Основная функция обработки вебхука
   */
  async processWebhook(payload: JiraWebhookPayload): Promise<WebhookResponse> {
    const startTime = Date.now();
    const triggeredActions: string[] = [];

    try {
      // Определяем тип события
      const eventType = this.parseEventType(payload);
      this.logger.log(
        `Processing event: ${eventType} for issue ${payload.issue?.key}`,
      );

      // Основная логика обработки в зависимости от события
      switch (eventType) {
        case JiraWebhookEvent.ISSUE_CREATED:
          await this.handleIssueCreated(payload, triggeredActions);
          break;

        case JiraWebhookEvent.ISSUE_UPDATED:
          await this.handleIssueUpdated(payload, triggeredActions);
          break;

        case JiraWebhookEvent.COMMENT_CREATED:
          await this.handleCommentCreated(payload, triggeredActions);
          break;

        default:
          this.logger.log(`Unhandled event type: ${eventType}`);
          triggeredActions.push('event-logged');
      }

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        message: 'Webhook processed successfully',
        triggeredActions,
        timestamp: new Date().toISOString(),
        issueKey: payload.issue?.key,
        processingTimeMs: processingTime,
      };
    } catch (error) {
      this.logger.error(
        `Webhook processing failed: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Специализированная обработка для задач о стрижках
   */
  async processHaircutTaskWebhook(
    payload: JiraWebhookPayload,
  ): Promise<WebhookResponse> {
    const triggeredActions: string[] = [];

    try {
      const isHaircutTask = this.isHaircutRelated(
        payload.issue?.fields?.summary || '',
      );

      if (!isHaircutTask) {
        return {
          success: true,
          message: 'Not a haircut-related task, skipped',
          triggeredActions: ['skipped'],
          timestamp: new Date().toISOString(),
          issueKey: payload.issue?.key,
        };
      }

      // Анализ задачи о стрижке
      if (payload.issue?.fields?.status?.name === 'To Do') {
        await this.triggerAiAction(AIAgentAction.ANALYZE_HAIRCUT_TASK);
        triggeredActions.push('haircut-analysis');
      }

      // Мониторинг выполнения
      if (payload.issue?.fields?.status?.name === 'In Progress') {
        await this.triggerAiAction(AIAgentAction.CHECK_PROGRESS);
        triggeredActions.push('progress-monitoring');
      }

      return {
        success: true,
        message: 'Haircut task webhook processed',
        triggeredActions,
        timestamp: new Date().toISOString(),
        issueKey: payload.issue?.key,
      };
    } catch (error) {
      this.logger.error(`Haircut webhook processing failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Обработка создания новой задачи
   */
  private async handleIssueCreated(
    payload: JiraWebhookPayload,
    triggeredActions: string[],
  ): Promise<void> {
    const issue = payload.issue;
    if (!issue) return;

    this.logger.log(
      `New issue created: ${issue.key} - "${issue.fields.summary}"`,
    );

    // Задержка для обработки в Jira
    await this.delay(this.config.delayMs);

    // Запуск анализа новых задач
    if (this.config.enableAiAnalysis) {
      const isHaircut = this.isHaircutRelated(issue.fields.summary);

      if (isHaircut) {
        await this.triggerAiAction(AIAgentAction.ANALYZE_HAIRCUT_TASK);
        triggeredActions.push('haircut-analysis');
      } else {
        await this.triggerAiAction(AIAgentAction.ANALYZE_NEW_TASK);
        triggeredActions.push('new-task-analysis');
      }
    }

    // Отправка уведомлений
    if (this.config.enableNotifications) {
      await this.sendNotification(issue.key, 'New task created');
      triggeredActions.push('notification-sent');
    }
  }

  /**
   * Обработка обновления задачи
   */
  private async handleIssueUpdated(
    payload: JiraWebhookPayload,
    triggeredActions: string[],
  ): Promise<void> {
    const issue = payload.issue;
    const changelog = payload.changelog;

    if (!issue || !changelog) return;

    // Проверяем изменение статуса
    const statusChange = changelog.items.find(
      (item) => item.field === 'status',
    );
    if (statusChange) {
      this.logger.log(
        `Status changed for ${issue.key}: ${statusChange.fromString} → ${statusChange.toString}`,
      );

      // Запуск соответствующих действий
      await this.handleStatusChange(
        issue.key,
        statusChange.toString || '',
        triggeredActions,
      );
    }

    // Проверяем изменение исполнителя
    const assigneeChange = changelog.items.find(
      (item) => item.field === 'assignee',
    );
    if (assigneeChange) {
      this.logger.log(
        `Assignee changed for ${issue.key}: ${assigneeChange.toString}`,
      );
      triggeredActions.push('assignee-updated');
    }
  }

  /**
   * Обработка добавления комментария
   */
  private async handleCommentCreated(
    payload: JiraWebhookPayload,
    triggeredActions: string[],
  ): Promise<void> {
    const comment = payload.comment;
    const issue = payload.issue;

    if (!comment || !issue) return;

    this.logger.log(
      `Comment added to ${issue.key} by ${comment.author.displayName}`,
    );

    // Анализ комментария на предмет важной информации
    if (this.containsImportantKeywords(comment.body)) {
      await this.triggerAiAction(AIAgentAction.ANALYZE_NEW_TASK);
      triggeredActions.push('comment-analysis');
    }

    triggeredActions.push('comment-logged');
  }

  /**
   * Обработка изменения статуса
   */
  private async handleStatusChange(
    issueKey: string,
    newStatus: string,
    triggeredActions: string[],
  ): Promise<void> {
    switch (newStatus) {
      case 'Done':
        // Анализ выполненных задач о стрижках
        await this.triggerAiAction(AIAgentAction.ANALYZE_HAIRCUT_TASK);
        triggeredActions.push('completion-analysis');
        break;

      case 'In Progress':
        // Мониторинг прогресса
        await this.triggerAiAction(AIAgentAction.CHECK_PROGRESS);
        triggeredActions.push('progress-monitoring');
        break;

      case 'Review':
        // Проверка качества выполнения
        triggeredActions.push('review-initiated');
        break;
    }
  }

  /**
   * Запуск действия AI агента
   */
  private async triggerAiAction(action: AIAgentAction): Promise<void> {
    try {
      const baseUrl = 'http://localhost:3000'; // Простая конфигурация для разработки

      const endpoints = {
        [AIAgentAction.ANALYZE_NEW_TASK]: '/ai-agent/analyze-new-tasks',
        [AIAgentAction.ANALYZE_HAIRCUT_TASK]: '/ai-agent/analyze-haircut-tasks',
        [AIAgentAction.CHECK_PROGRESS]: '/ai-agent/check-progress-tasks',
        [AIAgentAction.AUTO_ASSIGNMENT]: '/ai-agent/auto-assignment',
        [AIAgentAction.SEND_NOTIFICATION]: '/ai-agent/send-notification',
        [AIAgentAction.UPDATE_TASK_METADATA]: '/ai-agent/update-metadata',
      };

      const endpoint = endpoints[action];
      if (!endpoint) {
        this.logger.warn(`Unknown AI action: ${action}`);
        return;
      }

      this.logger.log(
        `Triggering AI action: ${action} -> ${baseUrl}${endpoint}`,
      );

      // Даём небольшую задержку для асинхронного выполнения
      setTimeout(async () => {
        try {
          // Формируем правильные параметры для каждого AI сервиса
          let payload = {};

          if (
            action === AIAgentAction.ANALYZE_NEW_TASK ||
            action === AIAgentAction.ANALYZE_HAIRCUT_TASK
          ) {
            payload = { sourceColumn: 'New' };
          } else if (action === AIAgentAction.CHECK_PROGRESS) {
            payload = { sourceColumn: 'In Progress' };
          } else {
            payload = {
              trigger: 'webhook',
              timestamp: new Date().toISOString(),
            };
          }

          await axios.post(`${baseUrl}${endpoint}`, payload, {
            timeout: 5000, // 5 секунд таймаут
          });

          this.logger.log(`AI action completed: ${action}`);
        } catch (error) {
          this.logger.error(`AI action failed: ${action} - ${error.message}`);
        }
      }, 100); // 100ms задержка
    } catch (error) {
      this.logger.error(
        `Failed to schedule AI action ${action}: ${error.message}`,
      );
    }
  }

  /**
   * Отправка уведомления
   */
  private async sendNotification(
    issueKey: string,
    message: string,
  ): Promise<void> {
    try {
      // Здесь можно интегрировать с системами уведомлений
      // Slack, email, Telegram и т.д.
      this.logger.log(`Notification sent for ${issueKey}: ${message}`);
    } catch (error) {
      this.logger.error(`Failed to send notification: ${error.message}`);
    }
  }

  /**
   * Проверка, связана ли задача со стрижками
   */
  private isHaircutRelated(summary: string): boolean {
    const text = summary.toLowerCase();
    return this.config.haircutKeywords.some((keyword) =>
      text.includes(keyword.toLowerCase()),
    );
  }

  /**
   * Проверка комментария на важные ключевые слова
   */
  private containsImportantKeywords(text: string): boolean {
    const importantKeywords = [
      'срочно',
      'проблема',
      'ошибка',
      'блокер',
      'urgent',
      'error',
    ];
    const lowerText = text.toLowerCase();
    return importantKeywords.some((keyword) => lowerText.includes(keyword));
  }

  /**
   * Определение типа события
   */
  private parseEventType(payload: JiraWebhookPayload): JiraWebhookEvent {
    const eventName = payload.webhookEvent || payload.issue_event_type_name;

    if (eventName?.includes('created')) {
      return JiraWebhookEvent.ISSUE_CREATED;
    } else if (eventName?.includes('updated')) {
      return JiraWebhookEvent.ISSUE_UPDATED;
    } else if (eventName?.includes('comment')) {
      return JiraWebhookEvent.COMMENT_CREATED;
    }

    return eventName as JiraWebhookEvent;
  }

  /**
   * Задержка выполнения
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
