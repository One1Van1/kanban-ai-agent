import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiCreatedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { SendEmailResponseDto } from './send-email.response.dto';

export const ApiSendEmail = () =>
  applyDecorators(
    ApiOperation({ 
      summary: 'Send email notification',
      description: 'Send an email notification to specified recipient with optional CC and BCC'
    }),
    ApiCreatedResponse({
      description: 'Email sent successfully',
      type: SendEmailResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Invalid email data or configuration error',
    }),
  );