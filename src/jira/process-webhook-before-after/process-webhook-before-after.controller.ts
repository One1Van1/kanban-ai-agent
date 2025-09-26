import {
  Controller,
  Post,
  Body,
  Get,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ProcessWebhookBeforeAfterService } from './process-webhook-before-after.service';
import {
  ProcessWebhookBeforeAfterDto,
  ProcessWebhookBeforeAfterResponseDto,
} from './process-webhook-before-after.dto';

@ApiTags('Jira Webhook - Claude Before/After Analysis')
@Controller('jira/process-webhook-before-after')
export class ProcessWebhookBeforeAfterController {
  private readonly logger = new Logger(
    ProcessWebhookBeforeAfterController.name,
  );

  constructor(
    private readonly processWebhookBeforeAfterService: ProcessWebhookBeforeAfterService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Новый Claude webhook для анализа фотографий ДО/ПОСЛЕ',
    description:
      'Автоматически анализирует задачи по стрижкам с помощью Claude 3.5 Sonnet Vision API',
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook успешно обработан',
    type: ProcessWebhookBeforeAfterResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректные данные webhook',
  })
  @ApiResponse({
    status: 500,
    description: 'Внутренняя ошибка при обработке webhook',
  })
  @ApiBody({
    type: ProcessWebhookBeforeAfterDto,
    description: 'Данные webhook от Jira для Claude анализа',
    examples: {
      'webhook-example': {
        summary: 'Пример Jira webhook для стрижки',
        value: {
          webhookEvent: 'jira:issue_updated',
          timestamp: 1695454800000,
          issue: {
            key: 'KAN-123',
            id: '10001',
            fields: {
              summary: 'Женская стрижка каскад',
              description: 'Стрижка для постоянной клиентки',
              status: {
                name: 'Review',
                id: '3',
              },
              assignee: {
                displayName: 'Мария Иванова',
                accountId: 'acc-123',
              },
            },
          },
        },
      },
    },
  })
  async processWebhookBeforeAfter(
    @Body() webhookDto: ProcessWebhookBeforeAfterDto,
  ): Promise<ProcessWebhookBeforeAfterResponseDto> {
    const taskKey = webhookDto.issue?.key;

    this.logger.log(
      `🎯 Claude webhook received: ${webhookDto.webhookEvent} for task ${taskKey}`,
    );

    try {
      const result =
        await this.processWebhookBeforeAfterService.processWebhookBeforeAfter(
          webhookDto,
        );

      if (result.success && result.processed) {
        this.logger.log(
          `✅ Claude analysis completed for ${taskKey}: Score ${result.analysis?.quality?.overallScore}/10`,
        );
      } else {
        this.logger.log(
          `⏩ Skipped processing for ${taskKey}: ${result.message}`,
        );
      }

      return result;
    } catch (error) {
      this.logger.error(
        `❌ Claude webhook failed for ${taskKey}:`,
        error.message,
      );

      return {
        success: false,
        message: 'Webhook processing failed',
        processed: false,
        taskKey,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get('health')
  @ApiOperation({
    summary: 'Проверка состояния Claude webhook сервиса',
    description: 'Возвращает статус сервиса и доступность зависимостей',
  })
  @ApiResponse({
    status: 200,
    description: 'Статус сервиса',
    schema: {
      example: {
        status: 'healthy',
        claudeEndpoint:
          'http://localhost:3000/photo-analysis-agent/analyze-before-after-photos',
        timestamp: '2025-09-26T17:30:00.000Z',
      },
    },
  })
  async getHealth(): Promise<any> {
    try {
      const healthStatus =
        await this.processWebhookBeforeAfterService.getServiceHealth();
      this.logger.log('🏥 Health check requested');
      return healthStatus;
    } catch (error) {
      this.logger.error('❌ Health check failed:', error.message);
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get('config')
  @ApiOperation({
    summary: 'Получить конфигурацию Claude webhook',
    description:
      'Возвращает текущую конфигурацию: статусы-триггеры, ключевые слова и настройки',
  })
  @ApiResponse({
    status: 200,
    description: 'Конфигурация webhook',
    schema: {
      example: {
        triggerStatuses: ['Review', 'Testing', 'Done'],
        haircutKeywords: ['стрижк', 'haircut', 'причёск', 'парикмахер'],
        maxPhotoSize: '10MB',
        allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'],
      },
    },
  })
  async getConfig(): Promise<any> {
    return {
      triggerStatuses: ['Review', 'Testing', 'Done'],
      haircutKeywords: [
        'стрижк',
        'haircut',
        'причёск',
        'парикмахер',
        'hair',
        'волос',
        'укладк',
        'стиль',
        'подстриг',
        'окрашивание',
        'маникюр',
      ],
      maxPhotoSize: '10MB',
      allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'],
      analysisTimeout: '60 seconds',
      endpointVersion: 'Claude 3.5 Sonnet Vision API',
    };
  }
}
