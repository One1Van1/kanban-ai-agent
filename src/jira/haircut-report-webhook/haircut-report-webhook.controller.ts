import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { HaircutReportWebhookService } from './haircut-report-webhook.service';
import { HaircutReportWebhookDto } from './haircut-report-webhook.dto';
import { WebhookResponse } from './haircut-report-webhook.interface';

@ApiTags('Jira Webhook - Haircut Reports')
@Controller('jira/webhook/haircut-report')
export class HaircutReportWebhookController {
  constructor(
    private readonly haircutReportWebhookService: HaircutReportWebhookService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Webhook для анализа выполненных стрижек',
    description:
      'Обрабатывает события Jira и автоматически анализирует задачи по стрижкам, которые переведены в статус Review',
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook успешно обработан',
    schema: {
      example: {
        success: true,
        message: 'Webhook processed successfully',
        data: {
          processed: true,
          taskKey: 'HAIR-123',
          analysisTriggered: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректные данные webhook',
  })
  @ApiBody({
    type: HaircutReportWebhookDto,
    description: 'Данные webhook от Jira',
  })
  async handleHaircutReportWebhook(
    @Body() webhookData: HaircutReportWebhookDto,
  ): Promise<WebhookResponse> {
    try {
      const result =
        await this.haircutReportWebhookService.processWebhook(webhookData);

      return {
        success: true,
        message: 'Webhook processed successfully',
        data: result,
      };
    } catch (error) {
      console.error('Error processing haircut report webhook:', error);

      return {
        success: false,
        message: 'Error processing webhook',
        error: error.message,
      };
    }
  }
}
