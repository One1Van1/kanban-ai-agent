import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TimeValidationWebhookService } from './time-validation-webhook.service';
import { TimeValidationWebhookRequestDto } from './time-validation-webhook.request.dto';
import { TimeValidationWebhookResponseDto } from './time-validation-webhook.response.dto';
import { ApiTimeValidationWebhook } from './openapi.decorator';

@Controller('jira/webhook')
@ApiTags('TimeValidationWebhook')
export class TimeValidationWebhookController {
  constructor(private readonly service: TimeValidationWebhookService) {}

  @Post('time-validation')
  @ApiTimeValidationWebhook()
  async handle(
    @Body() requestDto: TimeValidationWebhookRequestDto,
  ): Promise<TimeValidationWebhookResponseDto> {
    return this.service.execute(requestDto);
  }
}
