import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { timeout, retry, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  ProcessTaskConfig,
  ProcessTaskResult,
  TaskProcessState,
  PhotoAnalysisResult,
  TimeAnalysisResult,
  CombinedAnalysis,
  CommentCreationParams,
  FormattedComment,
  AnalysisWeights,
  AnalysisThresholds,
  ProcessingMetrics,
  ProcessServiceHealthCheck,
  RetryConfig,
} from './process-before-after-task.interface';

@Injectable()
export class ProcessBeforeAfterTaskService {
  private readonly logger = new Logger(ProcessBeforeAfterTaskService.name);
  private processingStates = new Map<string, TaskProcessState>();
  private metrics: ProcessingMetrics = {
    totalProcessed: 0,
    successfulProcessed: 0,
    failedProcessed: 0,
    averageProcessingTimeMs: 0,
    photoAnalysisSuccessRate: 0,
    timeAnalysisSuccessRate: 0,
    errors: {
      photoAnalysisErrors: 0,
      timeAnalysisErrors: 0,
      jiraCommentErrors: 0,
      otherErrors: 0,
    },
  };

  // Конфигурация весов для сводного анализа
  private readonly analysisWeights: AnalysisWeights = {
    quality: 0.6, // 60% - качество фотографий
    time: 0.4, // 40% - эффективность времени
  };

  // Пороговые значения для категоризации
  private readonly analysisThresholds: AnalysisThresholds = {
    excellent: { min: 8.5, max: 10 },
    good: { min: 7, max: 8.5 },
    average: { min: 5, max: 7 },
    poor: { min: 0, max: 5 },
  };

  private readonly retryConfig: RetryConfig = {
    maxRetries: 3,
    delayMs: 1000,
    exponentialBackoff: true,
    retryableErrors: ['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND'],
  };

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Главный метод для полной обработки задачи "до и после"
   */
  async processBeforeAfterTask(
    taskKey: string,
    config: ProcessTaskConfig,
  ): Promise<ProcessTaskResult> {
    const startTime = Date.now();
    this.logger.log(`Начинаем обработку задачи ${taskKey}`);

    // Инициализируем состояние обработки
    const state: TaskProcessState = {
      taskKey,
      status: 'in_progress',
      startedAt: new Date(),
      processSteps: {
        photoAnalysis: 'pending',
        timeAnalysis: 'pending',
        combinedAnalysis: 'pending',
        commentAdding: config.addCommentToTask ? 'pending' : 'skipped',
      },
      errors: [],
    };
    this.processingStates.set(taskKey, state);

    try {
      // Шаг 1: Анализ фотографий
      this.logger.log(`${taskKey}: Запускаем анализ фотографий`);
      state.processSteps.photoAnalysis = 'in_progress';
      const photoAnalysis = await this.analyzePhotos(
        taskKey,
        config.forcePhotoAnalysis,
      );
      state.processSteps.photoAnalysis = photoAnalysis.success
        ? 'completed'
        : 'failed';

      if (!photoAnalysis.success) {
        state.errors.push(`Ошибка анализа фотографий: ${photoAnalysis.error}`);
        this.metrics.errors.photoAnalysisErrors++;
      }

      // Шаг 2: Анализ времени работы
      this.logger.log(`${taskKey}: Запускаем анализ времени работы`);
      state.processSteps.timeAnalysis = 'in_progress';
      const timeAnalysis = await this.analyzeWorkTime(
        taskKey,
        config.forceTimeUpdate,
      );
      state.processSteps.timeAnalysis = timeAnalysis.success
        ? 'completed'
        : 'failed';

      if (!timeAnalysis.success) {
        state.errors.push(`Ошибка анализа времени: ${timeAnalysis.error}`);
        this.metrics.errors.timeAnalysisErrors++;
      }

      // Шаг 3: Сводный анализ
      this.logger.log(`${taskKey}: Создаем сводный анализ`);
      state.processSteps.combinedAnalysis = 'in_progress';
      const combinedAnalysis = this.createCombinedAnalysis(
        photoAnalysis,
        timeAnalysis,
      );
      state.processSteps.combinedAnalysis = 'completed';

      // Шаг 4: Добавление комментария в Jira (опционально)
      let commentId: string | undefined;
      if (config.addCommentToTask) {
        try {
          this.logger.log(`${taskKey}: Добавляем комментарий в Jira`);
          state.processSteps.commentAdding = 'in_progress';
          commentId = await this.addCommentToJiraTask({
            taskKey,
            photoAnalysis,
            timeAnalysis,
            combinedAnalysis,
          });
          state.processSteps.commentAdding = 'completed';
        } catch (error) {
          state.processSteps.commentAdding = 'failed';
          state.errors.push(`Ошибка добавления комментария: ${error.message}`);
          this.metrics.errors.jiraCommentErrors++;
          this.logger.warn(
            `${taskKey}: Не удалось добавить комментарий: ${error.message}`,
          );
        }
      }

      // Формируем результат
      const processingTimeMs = Date.now() - startTime;
      const success = photoAnalysis.success || timeAnalysis.success; // Хотя бы один анализ должен быть успешным

      const result: ProcessTaskResult = {
        taskKey,
        processedAt: new Date(),
        success,
        photoAnalysis,
        timeAnalysis,
        combinedAnalysis,
        commentId,
        processingTimeMs,
        errors: state.errors,
      };

      // Обновляем состояние и метрики
      state.status = success ? 'completed' : 'failed';
      state.completedAt = new Date();
      state.result = result;
      this.updateMetrics(result);

      this.logger.log(
        `${taskKey}: Обработка завершена за ${processingTimeMs}ms, успех: ${success}`,
      );
      return result;
    } catch (error) {
      state.status = 'failed';
      state.completedAt = new Date();
      state.errors.push(`Общая ошибка обработки: ${error.message}`);
      this.metrics.errors.otherErrors++;
      this.metrics.failedProcessed++;

      this.logger.error(
        `${taskKey}: Критическая ошибка обработки: ${error.message}`,
        error.stack,
      );

      throw new HttpException(
        `Ошибка обработки задачи ${taskKey}: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Получить статус обработки задач
   */
  getProcessingStatus(taskKeys: string[]): TaskProcessState[] {
    return taskKeys.map((taskKey) => {
      const state = this.processingStates.get(taskKey);
      if (!state) {
        return {
          taskKey,
          status: 'not_processed',
          processSteps: {
            photoAnalysis: 'pending',
            timeAnalysis: 'pending',
            combinedAnalysis: 'pending',
            commentAdding: 'pending',
          },
          errors: [],
        };
      }
      return state;
    });
  }

  /**
   * Анализ фотографий через PhotoAnalysisAgent
   */
  private async analyzePhotos(
    taskKey: string,
    force: boolean = false,
  ): Promise<PhotoAnalysisResult> {
    try {
      const baseUrl = this.configService.get<string>(
        'photoAnalysisService.baseUrl',
        'http://localhost:3000',
      );
      const url = `${baseUrl}/photo-analysis-agent/analyze-before-after-photos/${taskKey}`;

      const response = await firstValueFrom(
        this.httpService
          .get(url, {
            params: { force },
            timeout: 30000, // 30 секунд для анализа фотографий
          })
          .pipe(
            timeout(35000),
            retry(this.retryConfig.maxRetries),
            catchError((error) => {
              this.logger.error(
                `Ошибка вызова анализа фотографий: ${error.message}`,
              );
              return of({
                data: {
                  success: false,
                  error: error.message,
                  category: 'unknown',
                  qualityScore: 0,
                  description: 'Ошибка анализа фотографий',
                  recommendations: [
                    'Проверьте подключение к сервису анализа фотографий',
                  ],
                  confidence: 0,
                  processingTimeMs: 0,
                },
              });
            }),
          ),
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        `Критическая ошибка анализа фотографий для ${taskKey}: ${error.message}`,
      );
      return {
        success: false,
        error: error.message,
        category: 'unknown',
        qualityScore: 0,
        description: 'Критическая ошибка анализа фотографий',
        recommendations: ['Обратитесь к администратору системы'],
        confidence: 0,
        processingTimeMs: 0,
      };
    }
  }

  /**
   * Анализ времени работы через TrackWorkTimeService
   */
  private async analyzeWorkTime(
    taskKey: string,
    force: boolean = false,
  ): Promise<TimeAnalysisResult> {
    try {
      const baseUrl = this.configService.get<string>(
        'app.baseUrl',
        'http://localhost:3000',
      );
      const url = `${baseUrl}/ai-agent/track-work-time/${taskKey}`;

      const response = await firstValueFrom(
        this.httpService
          .get(url, {
            params: { force },
            timeout: 15000, // 15 секунд для анализа времени
          })
          .pipe(
            timeout(20000),
            retry(this.retryConfig.maxRetries),
            catchError((error) => {
              this.logger.error(
                `Ошибка вызова анализа времени: ${error.message}`,
              );
              return of({
                data: {
                  success: false,
                  error: error.message,
                  taskKey,
                  totalMinutes: 0,
                  efficiency: 'average' as const,
                  efficiencyPercentage: 0,
                  expectedRange: 'неизвестно',
                  recommendations: [
                    'Проверьте подключение к сервису анализа времени',
                  ],
                  statusHistory: [],
                  worklogEntries: [],
                },
              });
            }),
          ),
      );

      return {
        success: true,
        taskKey: response.data.taskKey,
        totalMinutes: response.data.totalMinutes,
        efficiency: response.data.efficiency.efficiency,
        efficiencyPercentage: response.data.efficiency.efficiencyPercentage,
        expectedRange: response.data.efficiency.expectedRange,
        recommendations: response.data.efficiency.recommendations,
        statusHistory: response.data.statusHistory,
        worklogEntries: response.data.worklogEntries,
      };
    } catch (error) {
      this.logger.error(
        `Критическая ошибка анализа времени для ${taskKey}: ${error.message}`,
      );
      return {
        success: false,
        error: error.message,
        taskKey,
        totalMinutes: 0,
        efficiency: 'average',
        efficiencyPercentage: 0,
        expectedRange: 'неизвестно',
        recommendations: ['Обратитесь к администратору системы'],
        statusHistory: [],
        worklogEntries: [],
      };
    }
  }

  /**
   * Создание сводного анализа на основе результатов фото и времени
   */
  private createCombinedAnalysis(
    photoAnalysis: PhotoAnalysisResult,
    timeAnalysis: TimeAnalysisResult,
  ): CombinedAnalysis {
    // Расчет общей оценки с учетом весов
    const qualityScore = photoAnalysis.success ? photoAnalysis.qualityScore : 0;
    const timeScore = this.convertEfficiencyToScore(timeAnalysis.efficiency);

    const overallScore =
      qualityScore * this.analysisWeights.quality +
      timeScore * this.analysisWeights.time;

    // Определение категорий
    const qualityCategory = this.getScoreCategory(qualityScore);
    const timeCategory = this.getScoreCategory(timeScore);
    const combinedCategory = this.getScoreCategory(overallScore);

    // Формирование рекомендаций
    const recommendations = this.generateCombinedRecommendations(
      photoAnalysis,
      timeAnalysis,
      overallScore,
    );

    // Создание краткого резюме
    const summary = this.generateSummary(
      photoAnalysis,
      timeAnalysis,
      overallScore,
    );

    return {
      overallScore: Math.round(overallScore * 100) / 100, // Округляем до 2 знаков
      summary,
      recommendations,
      qualityWeight: this.analysisWeights.quality,
      timeWeight: this.analysisWeights.time,
      categories: {
        photoQuality: qualityCategory,
        timeEfficiency: timeCategory,
        combined: combinedCategory,
      },
    };
  }

  /**
   * Конвертация эффективности времени в числовую оценку
   */
  private convertEfficiencyToScore(efficiency: string): number {
    const efficiencyScores: Record<string, number> = {
      excellent: 10,
      good: 8,
      average: 6,
      slow: 4,
      very_slow: 2,
    };
    return efficiencyScores[efficiency] || 5;
  }

  /**
   * Определение категории по числовой оценке
   */
  private getScoreCategory(score: number): string {
    if (score >= this.analysisThresholds.excellent.min) return 'excellent';
    if (score >= this.analysisThresholds.good.min) return 'good';
    if (score >= this.analysisThresholds.average.min) return 'average';
    return 'poor';
  }

  /**
   * Генерация сводных рекомендаций
   */
  private generateCombinedRecommendations(
    photoAnalysis: PhotoAnalysisResult,
    timeAnalysis: TimeAnalysisResult,
    overallScore: number,
  ): string[] {
    const recommendations: string[] = [];

    // Рекомендации на основе общей оценки
    if (overallScore >= 9) {
      recommendations.push(
        '🏆 Превосходная работа! Высокое качество и отличная эффективность',
      );
    } else if (overallScore >= 7.5) {
      recommendations.push(
        '✅ Хорошая работа в целом, небольшие улучшения помогут достичь отличного результата',
      );
    } else if (overallScore >= 6) {
      recommendations.push(
        '⚠️ Средний результат - есть возможности для улучшения качества и/или времени',
      );
    } else {
      recommendations.push(
        '🔄 Требуется значительное улучшение как качества, так и эффективности работы',
      );
    }

    // Специфичные рекомендации по фотографиям
    if (photoAnalysis.success) {
      if (photoAnalysis.qualityScore >= 8) {
        recommendations.push(
          `📸 Отличное качество стрижки (${photoAnalysis.qualityScore}/10)`,
        );
      } else if (photoAnalysis.qualityScore >= 6) {
        recommendations.push(
          `📸 Неплохое качество стрижки (${photoAnalysis.qualityScore}/10), можно улучшить детали`,
        );
      } else {
        recommendations.push(
          `📸 Качество стрижки требует улучшения (${photoAnalysis.qualityScore}/10)`,
        );
      }
      // Добавляем рекомендации из анализа фотографий
      recommendations.push(...photoAnalysis.recommendations.slice(0, 2));
    } else {
      recommendations.push(
        '📸 Не удалось проанализировать фотографии - убедитесь, что они загружены корректно',
      );
    }

    // Специфичные рекомендации по времени
    if (timeAnalysis.success) {
      if (
        timeAnalysis.efficiency === 'excellent' ||
        timeAnalysis.efficiency === 'good'
      ) {
        recommendations.push(
          `⏱️ Отличная эффективность времени: ${timeAnalysis.totalMinutes} мин (${timeAnalysis.expectedRange})`,
        );
      } else if (timeAnalysis.efficiency === 'average') {
        recommendations.push(
          `⏱️ Среднее время выполнения: ${timeAnalysis.totalMinutes} мин - можно оптимизировать`,
        );
      } else {
        recommendations.push(
          `⏱️ Время выполнения выше нормы: ${timeAnalysis.totalMinutes} мин (ожидалось ${timeAnalysis.expectedRange})`,
        );
      }
      // Добавляем рекомендации из анализа времени
      recommendations.push(...timeAnalysis.recommendations.slice(0, 2));
    } else {
      recommendations.push(
        '⏱️ Не удалось проанализировать время работы - проверьте данные в Jira',
      );
    }

    return recommendations.slice(0, 6); // Ограничиваем до 6 рекомендаций
  }

  /**
   * Генерация краткого резюме
   */
  private generateSummary(
    photoAnalysis: PhotoAnalysisResult,
    timeAnalysis: TimeAnalysisResult,
    overallScore: number,
  ): string {
    const qualityPart = photoAnalysis.success
      ? `качество ${photoAnalysis.qualityScore}/10`
      : 'анализ фото недоступен';

    const timePart = timeAnalysis.success
      ? `эффективность ${timeAnalysis.efficiency === 'good' || timeAnalysis.efficiency === 'excellent' ? 'хорошая' : 'требует улучшения'} (${timeAnalysis.totalMinutes} мин)`
      : 'анализ времени недоступен';

    const overallCategory = this.getScoreCategory(overallScore);
    const categoryEmoji =
      {
        excellent: '🏆',
        good: '✅',
        average: '⚠️',
        poor: '🔄',
      }[overallCategory] || '📊';

    return `${categoryEmoji} Общая оценка ${overallScore.toFixed(1)}/10: ${qualityPart}, ${timePart}`;
  }

  /**
   * Добавление комментария в задачу Jira
   */
  private async addCommentToJiraTask(
    params: CommentCreationParams,
  ): Promise<string> {
    const comment = this.formatJiraComment(params);

    try {
      const jiraBaseUrl = this.configService.get<string>('jira.baseUrl');
      const url = `${jiraBaseUrl}/jira/add-task-comment`;

      const response = await firstValueFrom(
        this.httpService
          .post(url, {
            taskKey: params.taskKey,
            comment: comment.body,
          })
          .pipe(timeout(10000), retry(2)),
      );

      return response.data.id || response.data.commentId;
    } catch (error) {
      this.logger.error(
        `Ошибка добавления комментария в ${params.taskKey}: ${error.message}`,
      );
      throw new Error(`Не удалось добавить комментарий: ${error.message}`);
    }
  }

  /**
   * Форматирование комментария для Jira
   */
  private formatJiraComment(params: CommentCreationParams): FormattedComment {
    const { photoAnalysis, timeAnalysis, combinedAnalysis } = params;

    const body = `
🤖 *Автоматический анализ результатов стрижки*

📊 *Общая оценка: ${combinedAnalysis.overallScore}/10*
${combinedAnalysis.summary}

📸 *Анализ фотографий:*
${
  photoAnalysis.success
    ? `
• Категория: ${photoAnalysis.category}
• Качество: ${photoAnalysis.qualityScore}/10
• Описание: ${photoAnalysis.description}
• Основные рекомендации: ${photoAnalysis.recommendations.slice(0, 2).join(', ')}
`
    : `
• ❌ Анализ фотографий недоступен: ${photoAnalysis.error}
`
}

⏱️ *Анализ времени работы:*
${
  timeAnalysis.success
    ? `
• Время выполнения: ${timeAnalysis.totalMinutes} мин
• Эффективность: ${timeAnalysis.efficiency}
• Ожидаемый диапазон: ${timeAnalysis.expectedRange}
• Эффективность: ${timeAnalysis.efficiencyPercentage}%
`
    : `
• ❌ Анализ времени недоступен: ${timeAnalysis.error}
`
}

💡 *Рекомендации:*
${combinedAnalysis.recommendations
  .slice(0, 4)
  .map((rec, i) => `${i + 1}. ${rec}`)
  .join('\n')}

---
_Анализ выполнен AI-агентом ${new Date().toLocaleString('ru-RU')}_
    `.trim();

    return { body };
  }

  /**
   * Обновление метрик производительности
   */
  private updateMetrics(result: ProcessTaskResult): void {
    this.metrics.totalProcessed++;

    if (result.success) {
      this.metrics.successfulProcessed++;
    } else {
      this.metrics.failedProcessed++;
    }

    // Обновляем среднее время обработки
    this.metrics.averageProcessingTimeMs =
      (this.metrics.averageProcessingTimeMs *
        (this.metrics.totalProcessed - 1) +
        result.processingTimeMs) /
      this.metrics.totalProcessed;

    // Обновляем показатели успешности
    this.metrics.photoAnalysisSuccessRate =
      (this.metrics.totalProcessed - this.metrics.errors.photoAnalysisErrors) /
      this.metrics.totalProcessed;

    this.metrics.timeAnalysisSuccessRate =
      (this.metrics.totalProcessed - this.metrics.errors.timeAnalysisErrors) /
      this.metrics.totalProcessed;

    this.metrics.lastProcessedAt = new Date();
  }

  /**
   * Проверка здоровья сервиса
   */
  async healthCheck(): Promise<ProcessServiceHealthCheck> {
    const timestamp = new Date();

    // Проверяем доступность внешних сервисов
    const services = {
      photoAnalysis: await this.checkPhotoAnalysisService(),
      timeTracking: await this.checkTimeTrackingService(),
      jira: await this.checkJiraService(),
    };

    // Определяем общий статус
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
      cache: {
        size: this.processingStates.size,
        hitRate: 0, // Пока не реализовано кэширование
      },
      errors: [],
    };
  }

  /**
   * Проверка доступности сервиса анализа фотографий
   */
  private async checkPhotoAnalysisService(): Promise<boolean> {
    try {
      const baseUrl = this.configService.get<string>(
        'photoAnalysisService.baseUrl',
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

  /**
   * Проверка доступности сервиса анализа времени
   */
  private async checkTimeTrackingService(): Promise<boolean> {
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

  /**
   * Проверка доступности Jira
   */
  private async checkJiraService(): Promise<boolean> {
    try {
      const jiraBaseUrl = this.configService.get<string>('jira.baseUrl');
      await firstValueFrom(
        this.httpService
          .get(`${jiraBaseUrl}/jira/health-check`)
          .pipe(timeout(5000)),
      );
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Очистка старых состояний обработки (для предотвращения утечек памяти)
   */
  cleanupOldStates(): void {
    const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 часа назад

    for (const [taskKey, state] of this.processingStates.entries()) {
      if (state.completedAt && state.completedAt < cutoffTime) {
        this.processingStates.delete(taskKey);
      }
    }

    this.logger.log(
      `Очищено ${this.processingStates.size} старых состояний обработки`,
    );
  }
}
