import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { TimeValidationWebhookRequestDto } from './time-validation-webhook.request.dto';
import { TimeValidationWebhookResponseDto } from './time-validation-webhook.response.dto';

export const ApiTimeValidationWebhook = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Валидация временных затрат по вебхуку',
      description:
        'Обрабатывает webhook события и валидирует временные затраты на задачу',
    }),
    ApiBody({ type: TimeValidationWebhookRequestDto }),
    ApiOkResponse({
      description: 'Результат валидации временных затрат',
      type: TimeValidationWebhookResponseDto,
    }),
  );
