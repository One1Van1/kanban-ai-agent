import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { SearchTasksRequestDto } from './search-tasks.request.dto';
import { SearchTasksResponseDto } from './search-tasks.response.dto';

export const ApiSearchTasks = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Поиск задач по JQL запросу',
      description:
        'Выполняет поиск задач в Jira с помощью JQL (Jira Query Language)',
    }),
    ApiBody({ type: SearchTasksRequestDto }),
    ApiOkResponse({
      description: 'Список найденных задач',
      type: SearchTasksResponseDto,
    }),
  );
