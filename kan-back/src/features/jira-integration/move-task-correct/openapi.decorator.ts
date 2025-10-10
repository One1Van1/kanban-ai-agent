import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiOkResponse,
} from '@nestjs/swagger';
import { MoveTaskRequestDto } from './move-task.request.dto';
import { MoveTaskResponseDto } from './move-task.response.dto';

export const ApiMoveTask = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Переместить задачу между колонками',
      description: 'Перемещает задачу в указанную колонку (статус) в Jira',
    }),
    ApiParam({
      name: 'taskKey',
      description: 'Ключ задачи в Jira',
      example: 'KAN-5',
    }),
    ApiBody({ type: MoveTaskRequestDto }),
    ApiOkResponse({
      description: 'Задача успешно перемещена',
      type: MoveTaskResponseDto,
    }),
  );
