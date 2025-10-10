import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { SendTelegramResponseDto } from './send-telegram.response.dto';

export const ApiSendTelegram = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Send Telegram notification',
      description: 'Send a message notification to specified Telegram chat',
    }),
    ApiCreatedResponse({
      description: 'Telegram message sent successfully',
      type: SendTelegramResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Invalid telegram data or bot configuration error',
    }),
  );
