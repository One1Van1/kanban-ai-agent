import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiOkResponse } from '@nestjs/swagger';
import { GetTaskTransitionsResponseDto } from './get-task-transitions.response.dto';

export const ApiGetTaskTransitions = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Получение возможных переходов для задачи',
      description:
        'Возвращает список всех доступных переходов (смена статуса) для указанной задачи',
    }),
    ApiParam({
      name: 'taskKey',
      description: 'Ключ задачи для получения переходов',
      example: 'KAN-5',
    }),
    ApiOkResponse({
      description: 'Список доступных переходов',
      type: GetTaskTransitionsResponseDto,
    }),
  );
