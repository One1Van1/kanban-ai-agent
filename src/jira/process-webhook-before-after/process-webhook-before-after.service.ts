import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { timeout, retry, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import * as crypto from 'crypto';
import {
  JiraWebhookPayload,
  WebhookProcessingConfig,
  WebhookProcessingResult,
  ProcessingTriggerConditions,
  WebhookProcessingState,
  WebhookMetrics,
  WebhookHealthCheck,
  ProcessingAction,
  WebhookEventType,
} from './process-webhook-before-after.interface';

@Injectable()
export class ProcessWebhookBeforeAfterService {
  private readonly logger = new Logger(ProcessWebhookBeforeAfterService.name);

  // Конфигурация обработки webhook'ов
  private readonly config: WebhookProcessingConfig;

  // Состояния активных обработок
  private processingStates = new Map<string, WebhookProcessingState>();

  // Метрики производительности
  private metrics: WebhookMetrics = {
    totalProcessed: 0,
    successfulProcessed: 0,
    failedProcessed: 0,
    averageProcessingTimeMs: 0,
    triggerConditions: {
      haircutTasksDetected: 0,
      statusTriggersMatched: 0,
      photoRequirementsMet: 0,
      skippedTasks: 0,
    },
    processingResults: {
      photoAnalysisSuccess: 0,
      timeTrackingSuccess: 0,
      combinedAnalysisSuccess: 0,
      jiraCommentsAdded: 0,
    },
    errors: {
      validationErrors: 0,
      processingErrors: 0,
      externalServiceErrors: 0,
      timeoutErrors: 0,
    },
  };

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    // Инициализация конфигурации
    this.config = {
      enableBeforeAfterAnalysis: true,
      enableTimeTracking: true,
      enableAutoComments: true,

      // Статусы для обработки - когда задача переходит в Review или Done
      triggerStatuses: ['Review', 'Testing', 'Done'],
      completionStatuses: ['Done', 'Closed'],

      // Ключевые слова для определения задач стрижки
      haircutKeywords: [
        'стрижка',
        'стрижку',
        'стрижки',
        'haircut',
        'окрашивание',
        'покраска',
        'окраска',
        'укладка',
        'укладки',
        'маникюр',
        'педикюр',
        'косметология',
        'массаж',
        'эпиляция',
        'депиляция',
        'брови',
        'ресницы',
        'мелирование',
        'колорирование',
      ],

      processingDelayMs: 3000, // 3 секунды задержки
      timeoutMs: 120000, // 2 минуты на обработку

      photoAnalysis: {
        minPhotos: 1, // Минимум 1 фото
        maxPhotos: 10, // Максимум 10 фото
        supportedFormats: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'],
        maxFileSize: 10 * 1024 * 1024, // 10 MB
      },
    };

    this.logger.log('ProcessWebhookBeforeAfterService инициализирован');
    this.logger.log(
      `Активные статусы: ${this.config.triggerStatuses.join(', ')}`,
    );
    this.logger.log(`Ключевых слов: ${this.config.haircutKeywords.length}`);
  }

  /**
   * Главный метод обработки webhook'а от Jira
   */
  async processWebhook(
    payload: JiraWebhookPayload,
  ): Promise<WebhookProcessingResult> {
    const startTime = Date.now();
    const webhookId = this.generateWebhookId(payload);
    const taskKey = payload.issue?.key || 'UNKNOWN';

    this.logger.log(
      `🔔 Получен webhook для задачи ${taskKey}, событие: ${payload.webhookEvent}`,
    );

    // Создаем состояние обработки
    const state: WebhookProcessingState = {
      taskKey,
      webhookId,
      status: 'pending',
      startedAt: new Date(),
      steps: {
        validation: 'pending',
        photoAnalysis: 'pending',
        timeTracking: 'pending',
        combinedAnalysis: 'pending',
        commentAdding: 'pending',
      },
      triggerConditions: {
        hasHaircutKeywords: false,
        hasRequiredStatus: false,
        hasPhotos: false,
        hasMinimumPhotos: false,
        isValidTask: false,
      },
      errors: [],
    };
    this.processingStates.set(webhookId, state);

    try {
      this.metrics.totalProcessed++;
      state.status = 'processing';

      // Шаг 1: Валидация и проверка условий
      this.logger.log(`📋 ${taskKey}: Проверка условий обработки`);
      state.steps.validation = 'processing';

      const triggerConditions = await this.checkProcessingConditions(payload);
      state.triggerConditions = triggerConditions;
      state.steps.validation = 'completed';

      // Обновляем метрики по условиям
      if (triggerConditions.hasHaircutKeywords)
        this.metrics.triggerConditions.haircutTasksDetected++;
      if (triggerConditions.hasRequiredStatus)
        this.metrics.triggerConditions.statusTriggersMatched++;
      if (triggerConditions.hasMinimumPhotos)
        this.metrics.triggerConditions.photoRequirementsMet++;

      // Проверяем, нужно ли обрабатывать эту задачу
      if (!triggerConditions.isValidTask) {
        this.logger.log(
          `⏭️ ${taskKey}: Пропускаем обработку - условия не выполнены`,
        );
        this.metrics.triggerConditions.skippedTasks++;

        return this.createSkippedResult(taskKey, triggerConditions, startTime);
      }

      // Шаг 2: Задержка перед обработкой
      this.logger.log(
        `⏳ ${taskKey}: Ожидание ${this.config.processingDelayMs}ms перед обработкой`,
      );
      await this.delay(this.config.processingDelayMs);

      // Шаг 3: Запуск полной обработки через process-before-after-task
      this.logger.log(`🚀 ${taskKey}: Запуск полной обработки задачи`);
      const processingResult = await this.triggerFullProcessing(taskKey, state);

      // Обновляем состояние
      state.status = 'completed';
      state.completedAt = new Date();
      state.result = processingResult;

      // Обновляем метрики
      this.metrics.successfulProcessed++;
      this.updateProcessingMetrics(processingResult);
      this.updateAverageProcessingTime(Date.now() - startTime);
      this.metrics.lastProcessedAt = new Date();

      this.logger.log(
        `✅ ${taskKey}: Webhook успешно обработан за ${Date.now() - startTime}ms`,
      );
      return processingResult;
    } catch (error) {
      state.status = 'failed';
      state.completedAt = new Date();
      state.errors.push(`Критическая ошибка: ${error.message}`);

      this.metrics.failedProcessed++;
      this.metrics.errors.processingErrors++;

      this.logger.error(
        `❌ ${taskKey}: Ошибка обработки webhook: ${error.message}`,
        error.stack,
      );

      return this.createErrorResult(taskKey, error.message, startTime);
    }
  }

  /**
   * Проверка условий для запуска обработки
   */
  private async checkProcessingConditions(
    payload: JiraWebhookPayload,
  ): Promise<ProcessingTriggerConditions> {
    const issue = payload.issue;
    if (!issue) {
      return {
        hasHaircutKeywords: false,
        hasRequiredStatus: false,
        hasPhotos: false,
        hasMinimumPhotos: false,
        isValidTask: false,
      };
    }

    // Проверка ключевых слов
    const summary = issue.fields.summary || '';
    const description = issue.fields.description || '';
    const textToCheck = `${summary} ${description}`.toLowerCase();

    const hasHaircutKeywords = this.config.haircutKeywords.some((keyword) =>
      textToCheck.includes(keyword.toLowerCase()),
    );

    // Проверка статуса
    const currentStatus = issue.fields.status?.name;
    const hasRequiredStatus =
      this.config.triggerStatuses.includes(currentStatus);

    // Проверка изменения статуса через changelog
    let statusChanged = false;
    if (payload.changelog?.items) {
      statusChanged = payload.changelog.items.some(
        (item) =>
          item.field === 'status' &&
          this.config.triggerStatuses.includes(item.toString || ''),
      );
    }

    // Проверка фотографий
    const attachments = issue.fields.attachment || [];
    const photoAttachments = attachments.filter(
      (att) =>
        this.isImageAttachment(att.mimeType) &&
        att.size <= this.config.photoAnalysis.maxFileSize,
    );

    const hasPhotos = photoAttachments.length > 0;
    const hasMinimumPhotos =
      photoAttachments.length >= this.config.photoAnalysis.minPhotos;

    // Общая валидность задачи
    const isValidTask =
      hasHaircutKeywords &&
      (hasRequiredStatus || statusChanged) &&
      hasMinimumPhotos;

    return {
      hasHaircutKeywords,
      hasRequiredStatus: hasRequiredStatus || statusChanged,
      hasPhotos,
      hasMinimumPhotos,
      isValidTask,
    };
  }

  /**
   * Запуск полной обработки через process-before-after-task сервис
   */
  private async triggerFullProcessing(
    taskKey: string,
    state: WebhookProcessingState,
  ): Promise<WebhookProcessingResult> {
    try {
      const baseUrl = this.configService.get<string>(
        'app.baseUrl',
        'http://localhost:3000',
      );
      const url = `${baseUrl}/ai-agent/process-before-after-task/${taskKey}`;

      this.logger.log(
        `📞 ${taskKey}: Вызываем process-before-after-task: ${url}`,
      );

      const response = await firstValueFrom(
        this.httpService
          .post(
            url,
            {},
            {
              params: {
                addComment: true,
                forcePhoto: false,
                forceTime: false,
              },
              timeout: this.config.timeoutMs,
            },
          )
          .pipe(
            timeout(this.config.timeoutMs + 5000), // +5 секунд буферного времени
            retry(2), // Попробовать 2 раза при ошибке
            catchError((error) => {
              this.logger.error(
                `${taskKey}: Ошибка вызова process-before-after-task: ${error.message}`,
              );
              throw error;
            }),
          ),
      );

      const processResult = response.data;

      // Обновляем состояние шагов на основе результата
      this.updateStepsFromProcessResult(state, processResult);

      // Формируем результат для webhook'а
      return {
        success: processResult.success,
        message: `Webhook обработан для задачи ${taskKey}: ${processResult.success ? 'успешно' : 'с ошибками'}`,
        taskKey,
        triggeredActions: this.getTriggeredActions(processResult),
        processingTimeMs: Date.now() - state.startedAt.getTime(),
        timestamp: new Date().toISOString(),

        photoAnalysis: processResult.photoAnalysis
          ? {
              processed: processResult.photoAnalysis.success,
              photosFound: 0, // TODO: получить из результата
              analysisResult: processResult.photoAnalysis.success
                ? {
                    category: processResult.photoAnalysis.category,
                    qualityScore: processResult.photoAnalysis.qualityScore,
                    description: processResult.photoAnalysis.description,
                  }
                : undefined,
              error: processResult.photoAnalysis.error,
            }
          : undefined,

        timeTracking: processResult.timeAnalysis
          ? {
              processed: processResult.timeAnalysis.success,
              totalMinutes: processResult.timeAnalysis.totalMinutes,
              efficiency: processResult.timeAnalysis.efficiency,
              error: processResult.timeAnalysis.error,
            }
          : undefined,

        combinedAnalysis: processResult.combinedAnalysis
          ? {
              processed: true,
              overallScore: processResult.combinedAnalysis.overallScore,
              summary: processResult.combinedAnalysis.summary,
            }
          : undefined,

        jiraComment: processResult.commentId
          ? {
              added: true,
              commentId: processResult.commentId,
            }
          : {
              added: false,
              error: 'Комментарий не был добавлен',
            },

        errors: processResult.errors || [],
      };
    } catch (error) {
      this.metrics.errors.externalServiceErrors++;
      throw new Error(
        `Не удалось выполнить полную обработку: ${error.message}`,
      );
    }
  }

  /**
   * Обновление состояния шагов на основе результата обработки
   */
  private updateStepsFromProcessResult(
    state: WebhookProcessingState,
    processResult: any,
  ): void {
    if (processResult.photoAnalysis) {
      state.steps.photoAnalysis = processResult.photoAnalysis.success
        ? 'completed'
        : 'failed';
    } else {
      state.steps.photoAnalysis = 'skipped';
    }

    if (processResult.timeAnalysis) {
      state.steps.timeTracking = processResult.timeAnalysis.success
        ? 'completed'
        : 'failed';
    } else {
      state.steps.timeTracking = 'skipped';
    }

    if (processResult.combinedAnalysis) {
      state.steps.combinedAnalysis = 'completed';
    } else {
      state.steps.combinedAnalysis = 'skipped';
    }

    if (processResult.commentId) {
      state.steps.commentAdding = 'completed';
    } else {
      state.steps.commentAdding = 'failed';
    }
  }

  /**
   * Извлечение списка выполненных действий
   */
  private getTriggeredActions(processResult: any): string[] {
    const actions: string[] = [];

    if (processResult.photoAnalysis?.success)
      actions.push(ProcessingAction.ANALYZE_PHOTOS);
    if (processResult.timeAnalysis?.success)
      actions.push(ProcessingAction.TRACK_TIME);
    if (processResult.combinedAnalysis)
      actions.push(ProcessingAction.COMBINED_ANALYSIS);
    if (processResult.commentId) actions.push(ProcessingAction.ADD_COMMENT);

    return actions;
  }

  /**
   * Проверка, является ли вложение изображением
   */
  private isImageAttachment(mimeType: string): boolean {
    const imageMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp',
    ];
    return imageMimeTypes.includes(mimeType.toLowerCase());
  }

  /**
   * Создание результата для пропущенной задачи
   */
  private createSkippedResult(
    taskKey: string,
    conditions: ProcessingTriggerConditions,
    startTime: number,
  ): WebhookProcessingResult {
    const reasons = [];
    if (!conditions.hasHaircutKeywords)
      reasons.push('не содержит ключевые слова стрижки');
    if (!conditions.hasRequiredStatus) reasons.push('не в нужном статусе');
    if (!conditions.hasMinimumPhotos) reasons.push('недостаточно фотографий');

    return {
      success: false,
      message: `Задача ${taskKey} пропущена: ${reasons.join(', ')}`,
      taskKey,
      triggeredActions: [ProcessingAction.SKIP_PROCESSING],
      processingTimeMs: Date.now() - startTime,
      timestamp: new Date().toISOString(),
      errors: [`Обработка пропущена: ${reasons.join(', ')}`],
    };
  }

  /**
   * Создание результата с ошибкой
   */
  private createErrorResult(
    taskKey: string,
    errorMessage: string,
    startTime: number,
  ): WebhookProcessingResult {
    return {
      success: false,
      message: `Ошибка обработки задачи ${taskKey}: ${errorMessage}`,
      taskKey,
      triggeredActions: [],
      processingTimeMs: Date.now() - startTime,
      timestamp: new Date().toISOString(),
      errors: [errorMessage],
    };
  }

  /**
   * Обновление метрик обработки
   */
  private updateProcessingMetrics(result: WebhookProcessingResult): void {
    if (result.photoAnalysis?.processed) {
      this.metrics.processingResults.photoAnalysisSuccess++;
    }
    if (result.timeTracking?.processed) {
      this.metrics.processingResults.timeTrackingSuccess++;
    }
    if (result.combinedAnalysis?.processed) {
      this.metrics.processingResults.combinedAnalysisSuccess++;
    }
    if (result.jiraComment?.added) {
      this.metrics.processingResults.jiraCommentsAdded++;
    }
  }

  /**
   * Обновление среднего времени обработки
   */
  private updateAverageProcessingTime(processingTimeMs: number): void {
    const totalSuccessful = this.metrics.successfulProcessed;
    if (totalSuccessful === 1) {
      this.metrics.averageProcessingTimeMs = processingTimeMs;
    } else {
      this.metrics.averageProcessingTimeMs =
        (this.metrics.averageProcessingTimeMs * (totalSuccessful - 1) +
          processingTimeMs) /
        totalSuccessful;
    }
  }

  /**
   * Генерация уникального ID для webhook'а
   */
  private generateWebhookId(payload: JiraWebhookPayload): string {
    const data = `${payload.webhookEvent}_${payload.issue?.key}_${payload.timestamp}`;
    return crypto.createHash('md5').update(data).digest('hex').substring(0, 16);
  }

  /**
   * Задержка выполнения
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Получение состояний обработки
   */
  getProcessingStates(taskKeys?: string[]): WebhookProcessingState[] {
    if (!taskKeys) {
      return Array.from(this.processingStates.values());
    }

    return taskKeys.map((taskKey) => {
      const state = Array.from(this.processingStates.values()).find(
        (s) => s.taskKey === taskKey,
      );
      return (
        state || {
          taskKey,
          webhookId: 'not-found',
          status: 'pending' as const,
          startedAt: new Date(),
          steps: {
            validation: 'pending',
            photoAnalysis: 'pending',
            timeTracking: 'pending',
            combinedAnalysis: 'pending',
            commentAdding: 'pending',
          },
          triggerConditions: {
            hasHaircutKeywords: false,
            hasRequiredStatus: false,
            hasPhotos: false,
            hasMinimumPhotos: false,
            isValidTask: false,
          },
          errors: ['Состояние обработки не найдено'],
        }
      );
    });
  }

  /**
   * Получение метрик производительности
   */
  getMetrics(): WebhookMetrics {
    return { ...this.metrics };
  }

  /**
   * Проверка здоровья webhook сервиса
   */
  async healthCheck(): Promise<WebhookHealthCheck> {
    const timestamp = new Date();

    // Проверка доступности внешних сервисов
    const services = {
      jiraApi: await this.checkJiraHealth(),
      photoAnalysis: await this.checkPhotoAnalysisHealth(),
      timeTracking: await this.checkTimeTrackingHealth(),
      processBeforeAfter: await this.checkProcessBeforeAfterHealth(),
    };

    // Определение общего статуса
    const healthyServices = Object.values(services).filter(Boolean).length;
    const totalServices = Object.keys(services).length;

    let status: 'healthy' | 'degraded' | 'unhealthy';
    if (healthyServices === totalServices) {
      status = 'healthy';
    } else if (healthyServices >= totalServices * 0.5) {
      status = 'degraded';
    } else {
      status = 'unhealthy';
    }

    return {
      status,
      timestamp,
      services,
      metrics: this.metrics,
      configuration: {
        triggerStatuses: this.config.triggerStatuses,
        haircutKeywords: this.config.haircutKeywords.length,
        photoRequirements: {
          minPhotos: this.config.photoAnalysis.minPhotos,
          maxFileSize: `${Math.round(this.config.photoAnalysis.maxFileSize / 1024 / 1024)}MB`,
        },
      },
      recentActivity: {
        lastWebhookReceived: this.getLastWebhookTime(),
        lastSuccessfulProcessing: this.metrics.lastProcessedAt,
        activeProcessingCount: this.getActiveProcessingCount(),
        queuedWebhooksCount: 0, // Пока не реализовано
      },
      errors: [],
    };
  }

  /**
   * Очистка старых состояний обработки
   */
  cleanupOldStates(): void {
    const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 часа назад
    let cleanedCount = 0;

    for (const [webhookId, state] of this.processingStates.entries()) {
      if (state.completedAt && state.completedAt < cutoffTime) {
        this.processingStates.delete(webhookId);
        cleanedCount++;
      }
    }

    this.logger.log(`🧹 Очищено ${cleanedCount} старых состояний webhook'ов`);
  }

  // Приватные методы для проверки здоровья сервисов
  private async checkJiraHealth(): Promise<boolean> {
    try {
      const baseUrl = this.configService.get<string>('jira.baseUrl');
      await firstValueFrom(
        this.httpService
          .get(`${baseUrl}/jira/health-check`)
          .pipe(timeout(5000)),
      );
      return true;
    } catch {
      return false;
    }
  }

  private async checkPhotoAnalysisHealth(): Promise<boolean> {
    try {
      const baseUrl = this.configService.get<string>(
        'app.baseUrl',
        'http://localhost:3000',
      );
      await firstValueFrom(
        this.httpService
          .get(`${baseUrl}/photo-analysis-agent/health`)
          .pipe(timeout(5000)),
      );
      return true;
    } catch {
      return false;
    }
  }

  private async checkTimeTrackingHealth(): Promise<boolean> {
    try {
      const baseUrl = this.configService.get<string>(
        'app.baseUrl',
        'http://localhost:3000',
      );
      await firstValueFrom(
        this.httpService
          .get(`${baseUrl}/ai-agent/track-work-time/health`)
          .pipe(timeout(5000)),
      );
      return true;
    } catch {
      return false;
    }
  }

  private async checkProcessBeforeAfterHealth(): Promise<boolean> {
    try {
      const baseUrl = this.configService.get<string>(
        'app.baseUrl',
        'http://localhost:3000',
      );
      await firstValueFrom(
        this.httpService
          .get(`${baseUrl}/ai-agent/process-before-after-task/health`)
          .pipe(timeout(5000)),
      );
      return true;
    } catch {
      return false;
    }
  }

  private getLastWebhookTime(): Date | undefined {
    let lastTime: Date | undefined;
    for (const state of this.processingStates.values()) {
      if (!lastTime || state.startedAt > lastTime) {
        lastTime = state.startedAt;
      }
    }
    return lastTime;
  }

  private getActiveProcessingCount(): number {
    return Array.from(this.processingStates.values()).filter(
      (state) => state.status === 'processing',
    ).length;
  }
}
