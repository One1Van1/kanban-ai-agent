import {
  Controller,
  Post,
  Body,
  Headers,
  Logger,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JiraWebhookHandlerService } from './jira-webhook-handler.service';
import {
  JiraWebhookPayload,
  WebhookResponse,
} from './jira-webhook-handler.interface';

@ApiTags('jira-webhooks')
@Controller('jira/webhook')
export class JiraWebhookHandlerController {
  private readonly logger = new Logger(JiraWebhookHandlerController.name);

  constructor(
    private readonly jiraWebhookHandlerService: JiraWebhookHandlerService,
  ) {}

  /**
   * Обработчик всех Jira вебхуков
   */
  @Post()
  @ApiOperation({
    summary: 'Обработка Jira вебхуков',
    description: `
    Централизованный обработчик для всех типов событий Jira.
    
    ВАЖНО: Веб-хук настроен на работу только с колонкой "Review".
    
    При переходе задачи в статус "Review" выполняется полный цикл обработки:
    1. 🔍 AI анализ задачи
    2. 📝 Создание отчёта 
    3. ✅ Автоматическое перемещение в "Done"
    
    Обрабатываемые события:
    - issue_updated: Задача обновлена (только при переходе в статус Review)
    
    Отключенные события:
    - issue_created: Создание новой задачи
    - comment_created: Добавление комментария
    - Изменение статуса на любой кроме Review
    
    Полный workflow: Review → AI анализ → Отчёт → Done
    `,
  })
  @ApiBody({
    description: 'Полезная нагрузка вебхука от Jira',
    schema: {
      type: 'object',
      properties: {
        webhookEvent: { type: 'string', example: 'jira:issue_created' },
        issue_event_type_name: { type: 'string', example: 'issue_created' },
        user: {
          type: 'object',
          properties: {
            accountId: { type: 'string' },
            displayName: { type: 'string' },
            emailAddress: { type: 'string' },
          },
        },
        issue: {
          type: 'object',
          properties: {
            key: { type: 'string', example: 'PROJ-123' },
            fields: {
              type: 'object',
              properties: {
                summary: { type: 'string' },
                status: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', example: 'To Do' },
                  },
                },
                assignee: {
                  type: 'object',
                  properties: {
                    displayName: { type: 'string' },
                  },
                },
              },
            },
          },
        },
        changelog: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  fromString: { type: 'string' },
                  toString: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Вебхук успешно обработан',
    schema: {
      example: {
        success: true,
        message: 'Webhook processed successfully',
        triggeredActions: ['ai-analysis', 'notification'],
        timestamp: '2025-09-23T10:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Неверный формат вебхука',
  })
  @ApiResponse({
    status: 401,
    description: 'Неавторизованный запрос',
  })
  async handleWebhook(
    @Body() payload: JiraWebhookPayload,
    @Headers() headers: Record<string, string>,
  ): Promise<WebhookResponse> {
    try {
      this.logger.log(
        `Received webhook: ${payload.webhookEvent} for issue ${payload.issue?.key}`,
      );

      // Валидация подписи (безопасность)
      await this.jiraWebhookHandlerService.validateWebhookSignature(
        headers,
        payload,
      );

      // Обработка вебхука
      const result =
        await this.jiraWebhookHandlerService.processWebhook(payload);

      this.logger.log(
        `Webhook processed successfully. Triggered actions: ${result.triggeredActions.join(', ')}`,
      );

      return result;
    } catch (error) {
      this.logger.error(
        `Webhook processing failed: ${error.message}`,
        error.stack,
      );

      if (error.message.includes('Invalid signature')) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      throw new HttpException(
        'Webhook processing failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Специализированный обработчик для задач о стрижках
   */
  @Post('haircut-tasks')
  @ApiOperation({
    summary: 'Обработка вебхуков для задач о стрижках',
    description: `
    Специальный эндпойнт для обработки задач, связанных со стрижками.
    
    ВАЖНО: Активен только для статуса "Review".
    
    При переходе задачи о стрижке в статус "Review" запускается полный цикл:
    1. 🔍 AI анализ задачи о стрижке
    2. 📝 Создание подробного отчёта
    3. ✅ Автоматическое перемещение в "Done"
    
    Workflow: Review → AI анализ → Отчёт → Done (автоматически)
    `,
  })
  async handleHaircutTaskWebhook(
    @Body() payload: JiraWebhookPayload,
  ): Promise<WebhookResponse> {
    try {
      this.logger.log('=== HAIRCUT WEBHOOK RECEIVED ===');
      this.logger.log(`Event: ${payload.webhookEvent}`);
      this.logger.log(`Issue: ${payload.issue?.key}`);
      this.logger.log(`Summary: ${payload.issue?.fields?.summary}`);
      this.logger.log(`Status: ${payload.issue?.fields?.status?.name}`);

      if (payload.changelog?.items) {
        this.logger.log('Changelog items:');
        payload.changelog.items.forEach((item) => {
          this.logger.log(
            `  ${item.field}: ${item.fromString} -> ${item.toString}`,
          );
        });
      }

      const result =
        await this.jiraWebhookHandlerService.processHaircutTaskWebhook(payload);

      this.logger.log(
        `=== HAIRCUT WEBHOOK PROCESSED: ${result.triggeredActions.join(', ')} ===`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Haircut task webhook processing failed: ${error.message}`,
      );
      throw new HttpException(
        'Haircut task webhook processing failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
