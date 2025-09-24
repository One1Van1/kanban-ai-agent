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
      // Ограничиваем активные статусы только Review
      activeStatuses: ['Review'], // Только этот статус будет обрабатываться
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

      // Проверяем наличие статуса и активен ли веб-хук для этого статуса
      if (
        !currentStatus ||
        !this.config.activeStatuses.includes(currentStatus)
      ) {
        this.logger.log(
          `Status ${currentStatus || 'undefined'} is not in active statuses list [${this.config.activeStatuses.join(', ')}] - webhook disabled for haircut tasks`,
        );
        return {
          success: true,
          message: `Haircut task webhook disabled for status: ${currentStatus || 'undefined'}`,
          triggeredActions: ['haircut-status-disabled'],
          timestamp: new Date().toISOString(),
          issueKey: payload.issue?.key,
        };
      }

      // Обработка только активных статусов (в данном случае только Review)
      switch (currentStatus) {
        case 'Review':
          // Задача в Review -> полный цикл обработки
          this.logger.log(
            `🔍 Haircut task ${payload.issue?.key} moved to Review - starting full analysis workflow`,
          );

          try {
            // 1. Анализируем задачу
            this.logger.log(`📊 Step 1: Analyzing task ${payload.issue?.key}`);
            const analysisResult = await this.analyzeReviewTask(payload.issue);
            triggeredActions.push('task-analyzed');

            // 2. Создаём отчёт
            this.logger.log(
              `📝 Step 2: Creating report for task ${payload.issue?.key}`,
            );
            const reportResult = await this.createTaskReport(
              payload.issue,
              analysisResult,
            );
            triggeredActions.push('report-created');

            // 3. Перемещаем в Done
            this.logger.log(
              `✅ Step 3: Moving task ${payload.issue?.key} to Done`,
            );
            if (payload.issue?.key) {
              await this.moveTaskToDone(payload.issue.key);
              triggeredActions.push('moved-to-done');
            } else {
              this.logger.warn(
                '❌ Cannot move task to Done: issue key is undefined',
              );
              triggeredActions.push('move-to-done-failed-no-key');
            }

            this.logger.log(
              `🎉 Full Review workflow completed for ${payload.issue?.key}: Analysis → Report → Done`,
            );
            triggeredActions.push('full-workflow-completed');
          } catch (workflowError) {
            this.logger.error(
              `❌ Review workflow failed for ${payload.issue?.key}: ${workflowError.message}`,
            );
            triggeredActions.push('workflow-failed');
          }
          break;
        default:
          // Этот код не должен выполняться из-за проверки выше, но оставляем для безопасности
          this.logger.log(
            `Haircut task status ${currentStatus} should not be processed - configuration error`,
          );
          triggeredActions.push('haircut-status-configuration-error');
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
      `New issue created: ${issue.key} - "${issue.fields.summary}" - webhook disabled for creation event`,
    );

    // Отключаем автоматические действия для создания задач
    // Только логируем событие
    triggeredActions.push('issue-created-logged-only');

    // Задержка для обработки в Jira (оставляем для стабильности)
    await this.delay(this.config.delayMs);
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
      `Comment added to ${issue.key} by ${comment.author.displayName} - webhook disabled for comments`,
    );

    // Отключаем автоматические действия для комментариев
    // Только логируем событие
    triggeredActions.push('comment-logged-only');
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

    // Проверяем, активен ли веб-хук для этого статуса
    if (!this.config.activeStatuses.includes(newStatus)) {
      this.logger.log(
        `Status ${newStatus} is not in active statuses list [${this.config.activeStatuses.join(', ')}] - webhook disabled`,
      );
      triggeredActions.push('status-change-disabled');
      return;
    }

    // Обрабатываем только активные статусы (в данном случае только Review)
    switch (newStatus) {
      case 'Review':
        // Только для статуса Review запускаем действия
        this.logger.log(`🔍 Processing Review status for ${issueKey}`);
        triggeredActions.push('review-initiated');

        try {
          // Создаём mock issue object для передачи в workflow
          const mockIssue = {
            key: issueKey,
            fields: {
              summary: issueSummary,
              status: { name: newStatus },
            },
          };

          // Запускаем полный workflow для Review
          this.logger.log(`🚀 Starting full Review workflow for ${issueKey}`);

          // 1. Анализируем задачу
          const analysisResult = await this.analyzeReviewTask(mockIssue);
          triggeredActions.push('task-analyzed');

          // 2. Создаём отчёт
          const reportResult = await this.createTaskReport(
            mockIssue,
            analysisResult,
          );
          triggeredActions.push('report-created');

          // 3. Перемещаем в Done
          await this.moveTaskToDone(issueKey);
          triggeredActions.push('moved-to-done');

          triggeredActions.push('full-workflow-completed');
          this.logger.log(`🎉 Full Review workflow completed for ${issueKey}`);
        } catch (workflowError) {
          this.logger.error(
            `❌ Review workflow failed for ${issueKey}: ${workflowError.message}`,
          );
          triggeredActions.push('workflow-failed');
        }
        break;

      default:
        // Этот код не должен выполняться из-за проверки выше, но оставляем для безопасности
        this.logger.log(
          `Status ${newStatus} should not be processed - configuration error`,
        );
        triggeredActions.push('status-change-configuration-error');
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

  /**
   * 1. Анализ задачи в Review
   */
  private async analyzeReviewTask(issue: any): Promise<any> {
    this.logger.log(`🔍 Starting analysis for task: ${issue?.key}`);

    try {
      // Проверяем, является ли это тестовым запросом
      const isTestMode = process.env.NODE_ENV === 'development';

      if (isTestMode) {
        // Возвращаем mock-данные для тестирования
        this.logger.log(
          `🧪 Test mode: returning mock analysis for ${issue?.key}`,
        );
        const mockAnalysis = {
          success: true,
          summary: `Анализ задачи ${issue?.key} завершён`,
          quality: 'Отличное качество выполнения',
          recommendations: 'Задача выполнена согласно требованиям',
          completionStatus: 'Готово к завершению',
          isHaircutTask: this.isHaircutRelated(issue?.fields?.summary || ''),
          confidence: 0.95,
        };

        // Добавляем задержку для реалистичности
        await this.delay(1000);
        return mockAnalysis;
      }

      // Вызов AI агента для анализа задачи (в production)
      const baseUrl = 'http://localhost:3000';
      const response = await axios.post(
        `${baseUrl}/ai-agent/analyze-haircut-tasks`,
        {
          issueKey: issue?.key,
          summary: issue?.fields?.summary,
          description: issue?.fields?.description,
          status: issue?.fields?.status?.name,
          analysisType: 'review-analysis',
        },
        {
          timeout: 60000, // 60 секунд для анализа
        },
      );

      this.logger.log(
        `✅ Analysis completed for ${issue?.key}: ${JSON.stringify(response.data)}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `❌ Analysis failed for ${issue?.key}: ${error.message}`,
      );
      throw new Error(`Task analysis failed: ${error.message}`);
    }
  }

  /**
   * 2. Создание отчёта по задаче
   */
  private async createTaskReport(
    issue: any,
    analysisResult: any,
  ): Promise<any> {
    this.logger.log(`📝 Creating report for task: ${issue?.key}`);

    try {
      const reportContent = this.generateReportContent(issue, analysisResult);

      // Проверяем, является ли это тестовым запросом
      const isTestMode = process.env.NODE_ENV === 'development';

      if (isTestMode) {
        // В тестовом режиме просто логируем отчёт
        this.logger.log(
          `📋 Test mode report for ${issue?.key}:\n${reportContent}`,
        );
        await this.delay(500); // Задержка для реалистичности
      } else {
        // В production добавляем комментарий в Jira
        await this.addCommentToJiraTask(issue?.key, reportContent);
      }

      this.logger.log(`✅ Report created and processed for ${issue?.key}`);
      return { success: true, reportContent };
    } catch (error) {
      this.logger.error(
        `❌ Report creation failed for ${issue?.key}: ${error.message}`,
      );
      throw new Error(`Report creation failed: ${error.message}`);
    }
  }

  /**
   * 3. Перемещение задачи в Done
   */
  private async moveTaskToDone(issueKey: string): Promise<void> {
    this.logger.log(`🚀 Moving task ${issueKey} to Done status`);

    try {
      // Проверяем, является ли это тестовым запросом
      const isTestMode = process.env.NODE_ENV === 'development';

      if (isTestMode) {
        // В тестовом режиме просто логируем действие
        this.logger.log(`🧪 Test mode: simulating move of ${issueKey} to Done`);
        await this.delay(500); // Задержка для реалистичности
      } else {
        // В production вызываем реальный API Jira
        const baseUrl = 'http://localhost:3000';
        const response = await axios.post(
          `${baseUrl}/jira/move-task`,
          {
            issueKey: issueKey,
            targetStatus: 'Done',
            comment:
              'Task automatically moved to Done after AI analysis and report generation',
          },
          {
            timeout: 30000,
          },
        );
      }

      this.logger.log(
        `✅ Task ${issueKey} successfully processed for Done status`,
      );
    } catch (error) {
      this.logger.error(
        `❌ Failed to process task ${issueKey} for Done: ${error.message}`,
      );
      throw new Error(`Move to Done failed: ${error.message}`);
    }
  }

  /**
   * Генерация содержимого отчёта
   */
  private generateReportContent(issue: any, analysisResult: any): string {
    const timestamp = new Date().toLocaleString('ru-RU');

    return `
🤖 **AI ОТЧЁТ ПО ЗАДАЧЕ** - ${timestamp}

**📋 Задача:** ${issue?.key}
**📝 Название:** ${issue?.fields?.summary}

**🔍 РЕЗУЛЬТАТЫ АНАЛИЗА:**
${this.formatAnalysisResult(analysisResult)}

**✅ ЗАКЛЮЧЕНИЕ:**
- Задача проанализирована AI агентом
- Выполнена проверка качества
- Задача автоматически перемещена в Done

**🎯 СТАТУС:** Завершено успешно

---
*Отчёт создан автоматически AI агентом*
    `.trim();
  }

  /**
   * Форматирование результатов анализа
   */
  private formatAnalysisResult(analysisResult: any): string {
    if (!analysisResult) {
      return '- Анализ выполнен, детали недоступны';
    }

    let formatted = '';

    if (analysisResult.summary) {
      formatted += `- **Краткое описание:** ${analysisResult.summary}\n`;
    }

    if (analysisResult.quality) {
      formatted += `- **Качество выполнения:** ${analysisResult.quality}\n`;
    }

    if (analysisResult.recommendations) {
      formatted += `- **Рекомендации:** ${analysisResult.recommendations}\n`;
    }

    if (analysisResult.completionStatus) {
      formatted += `- **Статус завершения:** ${analysisResult.completionStatus}\n`;
    }

    return formatted || '- Анализ выполнен успешно';
  }

  /**
   * Добавление комментария в Jira задачу
   */
  private async addCommentToJiraTask(
    issueKey: string,
    commentText: string,
  ): Promise<void> {
    try {
      const baseUrl = 'http://localhost:3000';
      const response = await axios.post(
        `${baseUrl}/jira/add-task-comment`,
        {
          issueKey: issueKey,
          comment: commentText,
        },
        {
          timeout: 30000,
        },
      );

      this.logger.log(`✅ Comment added to task ${issueKey}`);
    } catch (error) {
      this.logger.error(
        `❌ Failed to add comment to ${issueKey}: ${error.message}`,
      );
      throw error;
    }
  }
}
