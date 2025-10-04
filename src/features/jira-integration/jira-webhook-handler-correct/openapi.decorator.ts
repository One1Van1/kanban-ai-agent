import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { JiraWebhookHandlerRequestDto } from './jira-webhook-handler.request.dto';
import { JiraWebhookHandlerResponseDto } from './jira-webhook-handler.response.dto';

export const ApiJiraWebhookHandler = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Обработка вебхуков от Jira',
      description: 'Принимает и обрабатывает события от Jira через webhook',
    }),
    ApiBody({ type: JiraWebhookHandlerRequestDto }),
    ApiOkResponse({
      description: 'Статус обработки вебхука',
      type: JiraWebhookHandlerResponseDto,
    }),
  );
