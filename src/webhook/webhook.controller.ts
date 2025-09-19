import {
  Controller,
  Post,
  Body,
  Headers,
  Logger,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebhookService } from './webhook.service';
import { JiraWebhookDto } from '../dto';

@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(
    private readonly webhookService: WebhookService,
    private readonly configService: ConfigService,
  ) {}

  @Post('jira')
  async handleJiraWebhook(
    @Body() payload: JiraWebhookDto,
    @Headers() headers: Record<string, string>,
  ) {
    this.logger.log(`Received Jira webhook: ${payload.webhookEvent}`);

    try {
      // Проверяем webhook secret (опционально) - ВРЕМЕННО ОТКЛЮЧЕНО ДЛЯ ТЕСТИРОВАНИЯ
      // this.validateWebhookSecret(headers);

      // Обрабатываем только события создания задач
      if (payload.webhookEvent === 'jira:issue_created') {
        this.logger.log(`Processing new issue: ${payload.issue.key}`);

        const result = await this.webhookService.processNewIssue(payload);

        return {
          status: 'success',
          message: 'Webhook processed successfully',
          issueKey: payload.issue.key,
          decision: result.decision,
        };
      }

      // Игнорируем другие типы событий
      this.logger.log(`Ignoring webhook event: ${payload.webhookEvent}`);
      return {
        status: 'ignored',
        message: 'Event type not processed',
        event: payload.webhookEvent,
      };
    } catch (error) {
      this.logger.error(
        `Error processing webhook: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to process webhook',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private validateWebhookSecret(headers: Record<string, string>) {
    const webhookSecret = this.configService.get<string>('app.webhook.secret');

    if (!webhookSecret) {
      // Если secret не настроен, пропускаем проверку
      return;
    }

    const receivedSecret =
      headers['x-webhook-secret'] || headers['authorization'];

    if (!receivedSecret || receivedSecret !== webhookSecret) {
      throw new HttpException(
        'Invalid webhook secret',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
