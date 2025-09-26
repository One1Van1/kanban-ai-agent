import {
  Controller,
  Post,
  Get,
  Body,
  Headers,
  HttpStatus,
  HttpException,
  Logger,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiHeader,
  ApiQuery,
} from '@nestjs/swagger';
import { ProcessWebhookBeforeAfterService } from './process-webhook-before-after.service';
import {
  JiraWebhookPayloadDto,
  WebhookProcessingResultDto,
  WebhookStateDto,
  WebhookMetricsDto,
} from './process-webhook-before-after.dto';
import { JiraWebhookPayload } from './process-webhook-before-after.interface';

@ApiTags('Jira Webhooks - Before/After Processing')
@Controller('jira/process-webhook-before-after')
export class ProcessWebhookBeforeAfterController {
  private readonly logger = new Logger(
    ProcessWebhookBeforeAfterController.name,
  );

  constructor(
    private readonly webhookService: ProcessWebhookBeforeAfterService,
  ) {}

  /**
   * Основной endpoint для обработки Jira webhook'ов
   */
  @Post('/')
  @ApiOperation({
    summary: 'Обработка Jira webhook для анализа фото ДО/ПОСЛЕ',
    description: `
    Централизованный обработчик webhook'ов от Jira для новой системы анализа фото "ДО/ПОСЛЕ".
    
    **Автоматический workflow:**
    1. 📋 Проверка условий (ключевые слова, статус, фотографии)
    2. 📸 Анализ фотографий через Claude 3.5 Sonnet
    3. ⏱️ Анализ времени работы через Jira API  
    4. 🧠 Комбинированный анализ и оценка
    5. 💬 Автоматический комментарий в задачу
    
    **Условия запуска:**
    - Задача содержит ключевые слова стрижки
    - Статус: Review, Testing или Done
    - Минимум 1 прикрепленное фото
    - Размер фото до 10MB
    
    **Поддерживаемые события:**
    - jira:issue_updated (обновление задачи)
    - attachment_created (добавление фото)
    
    Процесс может занять до 2 минут в зависимости от размера фотографий.
    `,
  })
  @ApiHeader({
    name: 'X-Atlassian-Webhook-Signature',
    description: "Подпись webhook'а для проверки подлинности",
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook успешно обработан',
    type: WebhookProcessingResultDto,
  })
  @ApiResponse({
    status: 400,
    description: "Некорректный payload webhook'а",
  })
  @ApiResponse({
    status: 500,
    description: "Внутренняя ошибка при обработке webhook'а",
  })
  async processWebhook(
    @Body() payload: JiraWebhookPayloadDto,
    @Headers('x-atlassian-webhook-signature') signature?: string,
  ): Promise<WebhookProcessingResultDto> {
    const startTime = Date.now();
    const taskKey = payload.issue?.key || 'UNKNOWN';

    this.logger.log(
      `🎯 Получен webhook для задачи ${taskKey}, событие: ${payload.webhookEvent}`,
    );

    try {
      // Валидация базовых данных
      if (!payload.issue) {
        throw new HttpException(
          'Webhook payload не содержит информации о задаче',
          HttpStatus.BAD_REQUEST,
        );
      }

      // TODO: Проверка подписи webhook'а (если настроена)
      if (signature) {
        this.logger.debug(
          `Получена подпись webhook'а: ${signature.substring(0, 20)}...`,
        );
        // await this.validateWebhookSignature(payload, signature);
      }

      // Обработка webhook'а через сервис
      const result = await this.webhookService.processWebhook(
        payload as JiraWebhookPayload,
      );

      // Логирование результата
      if (result.success) {
        this.logger.log(
          `✅ ${taskKey}: Webhook обработан успешно за ${Date.now() - startTime}ms`,
        );
        this.logger.log(
          `🎯 ${taskKey}: Выполнены действия: ${result.triggeredActions.join(', ')}`,
        );
      } else {
        this.logger.warn(
          `⚠️ ${taskKey}: Webhook обработан с предупреждениями: ${result.message}`,
        );
      }

      return result as WebhookProcessingResultDto;
    } catch (error) {
      this.logger.error(
        `❌ ${taskKey}: Критическая ошибка обработки webhook: ${error.message}`,
        error.stack,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Не удалось обработать webhook для ${taskKey}: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Получение состояний обработки webhook'ов
   */
  @Get('/states')
  @ApiOperation({
    summary: "Получить состояния обработки webhook'ов",
    description:
      'Возвращает текущие состояния обработки для всех активных или указанных задач',
  })
  @ApiQuery({
    name: 'taskKeys',
    description:
      'Список ключей задач через запятую (например: HAIR-123,HAIR-124)',
    required: false,
    example: 'HAIR-123,HAIR-124',
  })
  @ApiResponse({
    status: 200,
    description: 'Состояния обработки получены успешно',
    type: [WebhookStateDto],
  })
  async getProcessingStates(
    @Query('taskKeys') taskKeys?: string,
  ): Promise<WebhookStateDto[]> {
    this.logger.log(
      `📊 Запрос состояний обработки${taskKeys ? ` для задач: ${taskKeys}` : ''}`,
    );

    try {
      const taskKeyList = taskKeys
        ? taskKeys.split(',').map((key) => key.trim())
        : undefined;
      const states = this.webhookService.getProcessingStates(taskKeyList);

      const stateDtos: WebhookStateDto[] = states.map((state) => ({
        taskKey: state.taskKey,
        webhookId: state.webhookId,
        status: state.status,
        startedAt: state.startedAt.toISOString(),
        completedAt: state.completedAt?.toISOString(),
        steps: {
          validation: state.steps.validation,
          photoAnalysis: state.steps.photoAnalysis,
          timeTracking: state.steps.timeTracking,
          combinedAnalysis: state.steps.combinedAnalysis,
          commentAdding: state.steps.commentAdding,
        },
        triggerConditions: state.triggerConditions,
        errors: state.errors,
      }));

      this.logger.log(`📊 Возвращаем ${stateDtos.length} состояний обработки`);
      return stateDtos;
    } catch (error) {
      this.logger.error(
        `Ошибка получения состояний обработки: ${error.message}`,
      );
      throw new HttpException(
        'Не удалось получить состояния обработки',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Получение состояния конкретной задачи
   */
  @Get('/states/:taskKey')
  @ApiOperation({
    summary: 'Получить состояние обработки конкретной задачи',
    description:
      "Возвращает детальное состояние обработки webhook'а для указанной задачи",
  })
  @ApiResponse({
    status: 200,
    description: 'Состояние обработки получено успешно',
    type: WebhookStateDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Состояние обработки для задачи не найдено',
  })
  async getTaskProcessingState(
    @Query('taskKey') taskKey: string,
  ): Promise<WebhookStateDto> {
    this.logger.log(`📋 Запрос состояния обработки для задачи ${taskKey}`);

    try {
      const states = this.webhookService.getProcessingStates([taskKey]);
      const state = states[0];

      if (!state || state.webhookId === 'not-found') {
        throw new HttpException(
          `Состояние обработки для задачи ${taskKey} не найдено`,
          HttpStatus.NOT_FOUND,
        );
      }

      const stateDto: WebhookStateDto = {
        taskKey: state.taskKey,
        webhookId: state.webhookId,
        status: state.status,
        startedAt: state.startedAt.toISOString(),
        completedAt: state.completedAt?.toISOString(),
        steps: {
          validation: state.steps.validation,
          photoAnalysis: state.steps.photoAnalysis,
          timeTracking: state.steps.timeTracking,
          combinedAnalysis: state.steps.combinedAnalysis,
          commentAdding: state.steps.commentAdding,
        },
        triggerConditions: state.triggerConditions,
        errors: state.errors,
      };

      return stateDto;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `Ошибка получения состояния для ${taskKey}: ${error.message}`,
      );
      throw new HttpException(
        `Не удалось получить состояние обработки для ${taskKey}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Получение метрик производительности
   */
  @Get('/metrics')
  @ApiOperation({
    summary: "Получить метрики производительности webhook'ов",
    description:
      "Возвращает детальные метрики производительности системы обработки webhook'ов",
  })
  @ApiResponse({
    status: 200,
    description: 'Метрики получены успешно',
    type: WebhookMetricsDto,
  })
  async getMetrics(): Promise<WebhookMetricsDto> {
    this.logger.log("📈 Запрос метрик производительности webhook'ов");

    try {
      const metrics = this.webhookService.getMetrics();

      const metricsDto: WebhookMetricsDto = {
        totalProcessed: metrics.totalProcessed,
        successfulProcessed: metrics.successfulProcessed,
        failedProcessed: metrics.failedProcessed,
        averageProcessingTimeMs: Math.round(metrics.averageProcessingTimeMs),
        triggerConditions: metrics.triggerConditions,
        processingResults: metrics.processingResults,
        errors: metrics.errors,
        lastProcessedAt: metrics.lastProcessedAt?.toISOString(),
      };

      return metricsDto;
    } catch (error) {
      this.logger.error(`Ошибка получения метрик: ${error.message}`);
      throw new HttpException(
        'Не удалось получить метрики производительности',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Проверка здоровья webhook сервиса
   */
  @Get('/health')
  @ApiOperation({
    summary: 'Проверка здоровья webhook сервиса',
    description: 'Возвращает статус здоровья сервиса и всех его зависимостей',
  })
  @ApiResponse({
    status: 200,
    description: 'Статус здоровья получен успешно',
  })
  async healthCheck(): Promise<any> {
    this.logger.log('🏥 Проверка здоровья webhook сервиса');

    try {
      const health = await this.webhookService.healthCheck();

      this.logger.log(`🏥 Статус здоровья: ${health.status}`);
      this.logger.log(
        `🔗 Внешние сервисы: ${Object.entries(health.services)
          .map(([name, status]) => `${name}=${status}`)
          .join(', ')}`,
      );

      return {
        ...health,
        timestamp: health.timestamp.toISOString(),
        recentActivity: {
          ...health.recentActivity,
          lastWebhookReceived:
            health.recentActivity.lastWebhookReceived?.toISOString(),
          lastSuccessfulProcessing:
            health.recentActivity.lastSuccessfulProcessing?.toISOString(),
        },
      };
    } catch (error) {
      this.logger.error(`Ошибка проверки здоровья: ${error.message}`);
      throw new HttpException(
        'Не удалось выполнить проверку здоровья сервиса',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Очистка старых состояний обработки
   */
  @Post('/cleanup')
  @ApiOperation({
    summary: 'Очистить старые состояния обработки',
    description:
      "Удаляет состояния обработки webhook'ов старше 24 часов для освобождения памяти",
  })
  @ApiResponse({
    status: 200,
    description: 'Очистка выполнена успешно',
  })
  async cleanupOldStates(): Promise<{ message: string; timestamp: string }> {
    this.logger.log("🧹 Запрос на очистку старых состояний webhook'ов");

    try {
      this.webhookService.cleanupOldStates();

      const result = {
        message: "Старые состояния обработки webhook'ов успешно очищены",
        timestamp: new Date().toISOString(),
      };

      this.logger.log('🧹 Очистка старых состояний завершена');
      return result;
    } catch (error) {
      this.logger.error(`Ошибка очистки состояний: ${error.message}`);
      throw new HttpException(
        'Не удалось выполнить очистку старых состояний',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Получение конфигурации webhook'ов
   */
  @Get('/config')
  @ApiOperation({
    summary: "Получить текущую конфигурацию webhook'ов",
    description: "Возвращает текущие настройки обработки webhook'ов",
  })
  @ApiResponse({
    status: 200,
    description: 'Конфигурация получена успешно',
  })
  async getConfiguration(): Promise<any> {
    this.logger.log("⚙️ Запрос конфигурации webhook'ов");

    try {
      const health = await this.webhookService.healthCheck();

      return {
        triggerStatuses: health.configuration.triggerStatuses,
        haircutKeywordsCount: health.configuration.haircutKeywords,
        photoRequirements: health.configuration.photoRequirements,
        features: {
          beforeAfterAnalysis: true,
          timeTracking: true,
          autoComments: true,
          claudeVisionAnalysis: true,
        },
        processingFlow: [
          '1. Валидация условий запуска',
          '2. Анализ фотографий (Claude 3.5 Sonnet)',
          '3. Анализ времени работы (Jira API)',
          '4. Комбинированный анализ',
          '5. Автоматический комментарий',
        ],
        supportedEvents: [
          'jira:issue_updated',
          'attachment_created',
          'status_changed',
        ],
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Ошибка получения конфигурации: ${error.message}`);
      throw new HttpException(
        "Не удалось получить конфигурацию webhook'ов",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
