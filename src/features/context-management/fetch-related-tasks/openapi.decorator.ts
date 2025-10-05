import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { FetchRelatedTasksResponseDto } from './fetch-related-tasks.response.dto';
import { RelationshipType } from './fetch-related-tasks.query.dto';

export const ApiFetchRelatedTasks = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Получить связанные задачи',
      description:
        'Находит все задачи, связанные с указанной задачей различными типами связей (блокирует, заблокирована, зависит от, и т.д.)',
    }),
    ApiParam({
      name: 'taskId',
      description: 'Уникальный идентификатор основной задачи',
      example: 'task-uuid-123',
    }),
    ApiQuery({
      name: 'relationshipType',
      enum: RelationshipType,
      description: 'Фильтр по типу связи между задачами',
      required: false,
    }),
    ApiQuery({
      name: 'limit',
      description: 'Максимальное количество возвращаемых связанных задач',
      example: 10,
      required: false,
    }),
    ApiQuery({
      name: 'includeSubtasks',
      description: 'Включить подзадачи в результат',
      example: true,
      required: false,
    }),
    ApiQuery({
      name: 'includeParents',
      description: 'Включить родительские задачи в результат',
      example: true,
      required: false,
    }),
    ApiOkResponse({
      description: 'Связанные задачи успешно найдены',
      type: FetchRelatedTasksResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Некорректный формат параметров запроса',
    }),
    ApiNotFoundResponse({
      description: 'Основная задача не найдена',
    }),
  );
