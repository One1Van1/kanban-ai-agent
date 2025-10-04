import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { TimeValidationWebhookService } from './time-validation-webhook.service';
import { TimeValidationWebhookDto } from './time-validation-webhook.dto';
import { TimeValidationResponse } from './time-validation-webhook.interface';

@Controller('jira/webhook')
export class TimeValidationWebhookController {
  constructor(
    private readonly timeValidationWebhookService: TimeValidationWebhookService,
  ) {}

  /**
   * Webhook endpoint для проверки логирования времени
   * при переходе задач в статус Review
   */
  @Post('time-validation')
  @HttpCode(HttpStatus.OK)
  async handleTimeValidation(
    @Body() webhookData: TimeValidationWebhookDto,
  ): Promise<TimeValidationResponse> {
    return this.timeValidationWebhookService.validateAndProcess(webhookData);
  }
}
