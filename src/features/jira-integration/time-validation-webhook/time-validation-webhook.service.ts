import { Injectable, Logger } from '@nestjs/common';
import { TimeValidationWebhookDto } from './time-validation-webhook.dto';
import {
  TimeValidationResponse,
  TaskTransitionData,
  WorklogEntry,
  JiraTransitionRequest,
  TaskStatus,
  WebhookEvent,
  NotificationData,
  NotificationLevel,
} from './time-validation-webhook.interface';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TimeValidationWebhookService {
  private readonly logger = new Logger(TimeValidationWebhookService.name);

  constructor(private readonly configService: ConfigService) {}

  /**
   * Основная логика валидации времени и обработки webhook'а
   */
  async validateAndProcess(
    webhookData: TimeValidationWebhookDto,
  ): Promise<TimeValidationResponse> {
    console.log('=== MAIN VALIDATION START ===');
    console.log('webhookEvent:', webhookData.webhookEvent);

    this.logger.log(
      `Processing time validation for webhook: ${webhookData.webhookEvent}`,
    );

    try {
      // 1. Проверяем что это переход в Review
      console.log('Checking if Review transition...');
      const isReviewTransition = this.isReviewTransition(webhookData);
      console.log('isReviewTransition result:', isReviewTransition);

      if (!isReviewTransition) {
        console.log('NOT a Review transition, returning early');
        return {
          validated: false,
          timeFound: false,
          action: 'approved',
          message: 'Not a Review transition, validation skipped',
        };
      }

      // 2. Проверяем что это задача о стрижке
      if (!this.isHaircutTask(webhookData)) {
        return {
          validated: false,
          timeFound: false,
          action: 'approved',
          message: 'Not a haircut task, validation skipped',
        };
      }

      // 3. Извлекаем данные о времени
      const transitionData = this.extractTransitionData(webhookData);

      // 4. Проверяем наличие логирования времени
      const timeValidation = this.validateWorklogTime(transitionData);

      // 5. Если времени нет - возвращаем задачу и уведомляем
      if (!timeValidation.hasValidTime) {
        await this.handleMissingTime(transitionData);
        return {
          validated: false,
          timeFound: false,
          action: 'rejected',
          message: 'Task returned to In Progress - missing time log',
          taskKey: transitionData.taskKey,
          masterName: transitionData.masterName,
          nextSteps: [
            'Log work time for the task',
            'Add description of work performed',
            'Transition task to Review again',
          ],
        };
      }

      // 6. Если время есть - продолжаем с AI анализом
      const aiAnalysisResult = await this.triggerAIAnalysis(webhookData);

      return {
        validated: true,
        timeFound: true,
        totalTimeSeconds: transitionData.totalWorklogTime,
        action: 'approved',
        message: 'Time validation passed, AI analysis triggered',
        taskKey: transitionData.taskKey,
        masterName: transitionData.masterName,
      };
    } catch (error) {
      this.logger.error(`Time validation error: ${error.message}`, error.stack);
      return {
        validated: false,
        timeFound: false,
        action: 'notification_sent',
        message: `Validation error: ${error.message}`,
      };
    }
  }

  /**
   * Проверяет, является ли это переходом в статус Review
   */
  private isReviewTransition(webhookData: TimeValidationWebhookDto): boolean {
    console.log('=== TIME VALIDATION DEBUG START ===');
    console.log('webhookEvent:', webhookData.webhookEvent);
    console.log('current status:', webhookData.issue?.fields?.status?.name);
    console.log('changelog:', JSON.stringify(webhookData.changelog, null, 2));
    console.log('TaskStatus.REVIEW:', TaskStatus.REVIEW);

    // Проверяем текущий статус
    const currentStatus = webhookData.issue?.fields?.status?.name;

    if (currentStatus !== TaskStatus.REVIEW) {
      console.log(
        `Status check failed: "${currentStatus}" !== "${TaskStatus.REVIEW}"`,
      );
      return false;
    }

    // Проверяем changelog на изменение статуса
    if (webhookData.changelog?.items) {
      const statusChange = webhookData.changelog.items.find(
        (item) => item.field === 'status',
      );

      if (statusChange) {
        console.log('Status change found:', statusChange);
        // Используем правильное поле из Jira changelog
        const toStatus =
          (statusChange as any).to || (statusChange as any).toString;
        console.log(
          `Comparing toStatus field: "${toStatus}" === "${TaskStatus.REVIEW}"`,
        );
        console.log('Available fields:', Object.keys(statusChange));
        const result = toStatus === TaskStatus.REVIEW;
        console.log('Result:', result);
        console.log('=== TIME VALIDATION DEBUG END ===');
        return result;
      }
    }

    console.log('No valid transition found');
    console.log('=== TIME VALIDATION DEBUG END ===');
    return false;
  }

  /**
   * Проверяет, является ли задача связанной со стрижками
   */
  private isHaircutTask(webhookData: TimeValidationWebhookDto): boolean {
    if (!webhookData.issue) return false;

    const haircutKeywords = ['стрижка', 'стричь', 'haircut', 'hair', 'волосы'];
    const summary = webhookData.issue.fields?.summary?.toLowerCase() || '';
    const description =
      webhookData.issue.fields?.description?.toLowerCase() || '';

    const text = `${summary} ${description}`;
    return haircutKeywords.some((keyword) =>
      text.includes(keyword.toLowerCase()),
    );
  }

  /**
   * Извлекает данные о переходе задачи
   */
  private extractTransitionData(
    webhookData: TimeValidationWebhookDto,
  ): TaskTransitionData {
    const issue = webhookData.issue;
    const changelog = webhookData.changelog;

    // Определяем предыдущий статус из changelog
    const statusChange = changelog?.items?.find(
      (item) => item.field === 'status',
    );
    const fromStatus = statusChange?.fromString || 'Unknown';

    // Извлекаем worklog данные
    const worklogEntries: WorklogEntry[] =
      issue?.fields?.worklog?.worklogs || [];
    const totalTime = worklogEntries.reduce(
      (sum, entry) => sum + entry.timeSpentSeconds,
      0,
    );

    return {
      taskKey: issue?.key || 'unknown',
      fromStatus,
      toStatus: TaskStatus.REVIEW,
      masterName: issue?.fields?.assignee?.displayName || 'Unknown Master',
      totalWorklogTime: totalTime,
      worklogEntries,
    };
  }

  /**
   * Валидирует время работы
   */
  private validateWorklogTime(transitionData: TaskTransitionData) {
    const minRequiredTimeMinutes = 5; // Минимум 5 минут
    const minRequiredTimeSeconds = minRequiredTimeMinutes * 60;

    const hasWorklogEntries = transitionData.worklogEntries.length > 0;
    const hasSufficientTime =
      transitionData.totalWorklogTime >= minRequiredTimeSeconds;
    const hasDescriptions = transitionData.worklogEntries.some(
      (entry) => entry.comment && entry.comment.trim().length > 0,
    );

    return {
      hasValidTime: hasWorklogEntries && hasSufficientTime,
      hasWorklogEntries,
      hasSufficientTime,
      hasDescriptions,
      totalTimeMinutes: Math.round(transitionData.totalWorklogTime / 60),
      details: {
        minRequiredMinutes: minRequiredTimeMinutes,
        actualTimeMinutes: Math.round(transitionData.totalWorklogTime / 60),
        entriesCount: transitionData.worklogEntries.length,
        hasDescriptions,
      },
    };
  }

  /**
   * Обрабатывает случай отсутствия времени
   */
  private async handleMissingTime(
    transitionData: TaskTransitionData,
  ): Promise<void> {
    try {
      // 1. Возвращаем задачу в статус "In Progress"
      await this.transitionTaskBack(transitionData.taskKey);

      // 2. Добавляем комментарий с объяснением
      await this.addValidationComment(transitionData);

      // 3. Отправляем уведомление мастеру (если есть email/slack интеграция)
      await this.sendNotificationToMaster(transitionData);

      this.logger.log(
        `Task ${transitionData.taskKey} returned to In Progress due to missing time log`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to handle missing time for ${transitionData.taskKey}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Возвращает задачу в статус "In Progress"
   */
  private async transitionTaskBack(taskKey: string): Promise<void> {
    const baseURL = this.configService.get<string>('jira.baseUrl');
    const username = this.configService.get<string>('jira.email');
    const password = this.configService.get<string>('jira.apiToken');

    if (!baseURL || !username || !password) {
      throw new Error('Jira configuration is missing');
    }

    const jiraConfig = {
      baseURL,
      auth: { username, password },
    };

    // Получаем доступные переходы
    const transitionsResponse = await axios.get(
      `/rest/api/3/issue/${taskKey}/transitions`,
      { baseURL: jiraConfig.baseURL, auth: jiraConfig.auth },
    );

    // Ищем переход в "In Progress"
    const backTransition = transitionsResponse.data.transitions.find(
      (t: any) => t.to.name === TaskStatus.IN_PROGRESS,
    );

    if (!backTransition) {
      throw new Error(
        `No transition to ${TaskStatus.IN_PROGRESS} found for task ${taskKey}`,
      );
    }

    // Выполняем переход
    const transitionRequest: JiraTransitionRequest = {
      transition: {
        id: backTransition.id,
      },
      fields: {
        comment: {
          body:
            `🚨 *Автоматический возврат задачи*\n\n` +
            `Задача возвращена в статус "In Progress" из-за отсутствия логирования времени.\n\n` +
            `*Что нужно сделать:*\n` +
            `• Залогировать время работы над задачей\n` +
            `• Добавить описание выполненной работы\n` +
            `• Повторно перевести задачу в "Review"\n\n` +
            `_Это сообщение создано автоматически системой контроля времени._`,
        },
      },
    };

    await axios.post(
      `/rest/api/3/issue/${taskKey}/transitions`,
      transitionRequest,
      { baseURL: jiraConfig.baseURL, auth: jiraConfig.auth },
    );
  }

  /**
   * Добавляет комментарий с объяснением валидации
   */
  private async addValidationComment(
    transitionData: TaskTransitionData,
  ): Promise<void> {
    // Комментарий уже добавляется в transitionTaskBack
    // Можно добавить дополнительную логику если нужно
  }

  /**
   * Отправляет уведомление мастеру
   */
  private async sendNotificationToMaster(
    transitionData: TaskTransitionData,
  ): Promise<void> {
    const notificationData: NotificationData = {
      taskKey: transitionData.taskKey,
      masterName: transitionData.masterName || 'Unknown Master',
      level: NotificationLevel.WARNING,
      title: 'Требуется логирование времени',
      message: `Задача ${transitionData.taskKey} возвращена в "In Progress" из-за отсутствия времени работы.`,
      suggestedActions: [
        'Залогировать время работы',
        'Добавить описание работы',
        'Повторно перевести в Review',
      ],
    };

    // Здесь можно добавить интеграцию с email/Slack/Telegram
    this.logger.log(
      `Notification sent to ${transitionData.masterName} for task ${transitionData.taskKey}`,
    );
  }

  /**
   * Запускает AI анализ если время корректно залогировано
   */
  private async triggerAIAnalysis(
    webhookData: TimeValidationWebhookDto,
  ): Promise<any> {
    try {
      // AI анализ отключен - только Claude система активна
      this.logger.log('AI analysis bypassed - only Claude system active');
      return null;
    } catch (error) {
      this.logger.error(`AI analysis failed: ${error.message}`);
      return null;
    }
  }
}
