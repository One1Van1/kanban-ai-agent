import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { HealthCheckResponseDto } from './health-check.response.dto';

export const ApiHealthCheck = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Проверка состояния соединения с Jira',
      description:
        'Проверяет доступность Jira API и возвращает статус соединения',
    }),
    ApiOkResponse({
      description: 'Статус соединения с Jira',
      type: HealthCheckResponseDto,
    }),
  );
