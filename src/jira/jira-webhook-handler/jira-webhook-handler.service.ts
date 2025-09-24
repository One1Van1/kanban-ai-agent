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
        'стрижку',
        'стрижки',
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

      const eventType = payload.webhookEvent as JiraWebhookEvent;
      const currentStatus = payload.issue?.fields?.status?.name;

      this.logger.log(
        `Processing haircut task: ${payload.issue?.key} with status: ${currentStatus}, event: ${eventType}`,
      );

      // Простая логика: запускаем нужный эндпоинт агента в зависимости от статуса
      switch (currentStatus) {
        case 'New':
        case 'To Do':
        case 'Questions':
          // Задача в New/Questions -> запускаем анализ задач на стрижку
          this.logger.log(
            `Triggering haircut analysis for status: ${currentStatus}`,
          );
          await this.triggerAiAction(
            AIAgentAction.ANALYZE_HAIRCUT_TASK,
            currentStatus,
          );
          triggeredActions.push('haircut-analysis');
          break;

        case 'In Progress':
          // Задача в In Progress -> запускаем выполнение стрижки
          this.logger.log(
            `Triggering haircut execution for status: ${currentStatus}`,
          );
          await this.triggerAiAction(
            AIAgentAction.EXECUTE_HAIRCUT_TASK,
            currentStatus,
          );
          triggeredActions.push('haircut-execution');
          break;

        case 'Review':
          // Задача в Review -> пока только логируем
          this.logger.log(
            `Haircut task ${payload.issue?.key} moved to Review for quality check`,
          );
          triggeredActions.push('review-initiated');
          break;

        default:
          this.logger.log(
            `No specific action for haircut task status: ${currentStatus}`,
          );
          triggeredActions.push('status-logged');
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
      const currentStatus = issue.fields.status?.name || 'New';
      await this.triggerAiAction(
        AIAgentAction.ANALYZE_HAIRCUT_TASK,
        currentStatus,
      );
      triggeredActions.push('haircut-analysis');
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
        issue.fields.summary,
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
      const currentStatus = issue.fields?.status?.name || 'New';
      await this.triggerAiAction(AIAgentAction.ANALYZE_NEW_TASK, currentStatus);
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
    issueSummary: string,
    triggeredActions: string[],
  ): Promise<void> {
    this.logger.log(`Handling status change for ${issueKey} to: ${newStatus}`);

    switch (newStatus) {
      case 'Done':
        // Анализ выполненных задач о стрижках
        await this.triggerAiAction(
          AIAgentAction.ANALYZE_HAIRCUT_TASK,
          newStatus,
        );
        triggeredActions.push('haircut-completion-analysis');
        break;

      case 'In Progress':
        // Выполнение стрижки
        await this.triggerAiAction(
          AIAgentAction.EXECUTE_HAIRCUT_TASK,
          newStatus,
        );
        triggeredActions.push('haircut-execution');
        break;

      case 'Review':
        // Проверка качества выполнения
        triggeredActions.push('review-initiated');
        break;

      case 'Questions':
        // Анализ задач в статусе Questions
        await this.triggerAiAction(
          AIAgentAction.ANALYZE_HAIRCUT_TASK,
          newStatus,
        );
        triggeredActions.push('haircut-questions-analysis');
        break;

      case 'To Do':
      case 'New':
        // Анализ новых задач стрижек
        await this.triggerAiAction(
          AIAgentAction.ANALYZE_HAIRCUT_TASK,
          newStatus,
        );
        triggeredActions.push('haircut-analysis');
        break;

      default:
        this.logger.log(`No specific action for status: ${newStatus}`);
        triggeredActions.push('status-change-logged');
        break;
    }
  } /**
   * Запуск действия AI агента
   */
  private async triggerAiAction(
    action: AIAgentAction,
    targetStatus?: string,
  ): Promise<void> {
    try {
      this.logger.log(
        `Triggering AI action: ${action} for status: ${targetStatus}`,
      );

      // Просто вызываем соответствующий AI сервис напрямую
      if (action === AIAgentAction.ANALYZE_HAIRCUT_TASK) {
        // Вызываем анализ задач на стрижку через внутренний HTTP-клиент
        const baseUrl = 'http://localhost:3000';
        const response = await axios.post(
          `${baseUrl}/ai-agent/analyze-haircut-tasks`,
          {},
          {
            timeout: 30000, // 30 секунд для AI операций
          },
        );

        this.logger.log(
          `Haircut analysis completed: ${JSON.stringify(response.data)}`,
        );
      } else if (action === AIAgentAction.EXECUTE_HAIRCUT_TASK) {
        // Вызываем выполнение задач на стрижку
        const baseUrl = 'http://localhost:3000';
        const response = await axios.post(
          `${baseUrl}/ai-agent/execute-haircut-tasks`,
          {},
          {
            timeout: 30000,
          },
        );

        this.logger.log(
          `Haircut execution completed: ${JSON.stringify(response.data)}`,
        );
      } else {
        this.logger.warn(`AI action ${action} not implemented for direct call`);
      }
    } catch (error) {
      this.logger.error(`AI action ${action} failed: ${error.message}`);
      if (error.response) {
        this.logger.error(`Response status: ${error.response.status}`);
        this.logger.error(
          `Response data: ${JSON.stringify(error.response.data)}`,
        );
      }
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
    const isHaircut = this.config.haircutKeywords.some((keyword) =>
      text.includes(keyword.toLowerCase()),
    );
    this.logger.log(`Checking haircut: "${summary}" -> ${isHaircut}`);
    return isHaircut;
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
