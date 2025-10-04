import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiOkResponse } from '@nestjs/swagger';
import { GetTaskResponseDto } from './get-task.response.dto';

export const ApiGetTask = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Получить информацию о задаче',
      description: 'Возвращает подробную информацию о задаче по её ключу',
    }),
    ApiParam({
      name: 'taskKey',
      description: 'Ключ задачи в Jira',
      example: 'KAN-5',
    }),
    ApiOkResponse({
      description: 'Информация о задаче получена',
      type: GetTaskResponseDto,
    }),
  );
