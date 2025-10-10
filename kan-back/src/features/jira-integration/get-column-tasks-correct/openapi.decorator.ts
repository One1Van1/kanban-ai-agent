import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiOkResponse,
} from '@nestjs/swagger';
import { GetColumnTasksResponseDto } from './get-column-tasks.response.dto';

export const ApiGetColumnTasks = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Получение задач из указанной колонки',
      description:
        'Возвращает список задач с определенным статусом (колонкой) с возможностью фильтрации',
    }),
    ApiParam({
      name: 'columnStatus',
      description: 'Статус колонки для получения задач',
      example: 'In Progress',
    }),
    ApiQuery({
      name: 'maxResults',
      description: 'Максимальное количество результатов',
      required: false,
      example: 20,
    }),
    ApiQuery({
      name: 'assignee',
      description: 'Фильтр по исполнителю',
      required: false,
      example: 'john.doe@company.com',
    }),
    ApiQuery({
      name: 'priority',
      description: 'Фильтр по приоритету',
      required: false,
      example: 'High',
    }),
    ApiOkResponse({
      description: 'Список задач из колонки',
      type: GetColumnTasksResponseDto,
    }),
  );
