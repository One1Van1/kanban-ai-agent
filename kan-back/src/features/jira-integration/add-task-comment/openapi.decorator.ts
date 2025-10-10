import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { AddTaskCommentRequestDto } from './add-task-comment.request.dto';
import { AddTaskCommentResponseDto } from './add-task-comment.response.dto';

export const ApiAddTaskComment = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Добавить комментарий к задаче',
      description: 'Добавляет текстовый комментарий к указанной задаче в Jira',
    }),
    ApiParam({
      name: 'taskKey',
      description: 'Ключ задачи в Jira',
      example: 'KAN-5',
    }),
    ApiBody({ type: AddTaskCommentRequestDto }),
    ApiOkResponse({
      description: 'Комментарий успешно добавлен',
      type: AddTaskCommentResponseDto,
    }),
  );
