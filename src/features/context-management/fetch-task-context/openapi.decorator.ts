import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { FetchTaskContextResponseDto } from './fetch-task-context.response.dto';

export const ApiFetchTaskContext = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Получить контекст задачи',
      description:
        'Собирает полный контекст задачи включая комментарии, вложения, записи времени и дополнительные поля',
    }),
    ApiParam({
      name: 'taskId',
      description: 'Уникальный идентификатор задачи',
      example: 'task-uuid-123',
    }),
    ApiOkResponse({
      description: 'Контекст задачи успешно получен',
      type: FetchTaskContextResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Некорректный формат идентификатора задачи',
    }),
    ApiNotFoundResponse({
      description: 'Задача не найдена',
    }),
  );
