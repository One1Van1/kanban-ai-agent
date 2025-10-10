import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiParam,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { AddTaskCommentResponseDto } from './add-task-comment.response.dto';

export const ApiAddTaskComment = () =>
  applyDecorators(
    ApiOperation({ summary: 'Add a comment to a task' }),
    ApiParam({
      name: 'id',
      type: 'string',
      description: 'Task ID',
      example: 'PROJ-123',
    }),
    ApiCreatedResponse({
      description: 'Comment added successfully',
      type: AddTaskCommentResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'Task not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: {
            type: 'string',
            example: 'Task with ID PROJ-123 not found',
          },
          error: { type: 'string', example: 'Not Found' },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid request data',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: { type: 'array', items: { type: 'string' } },
          error: { type: 'string', example: 'Bad Request' },
        },
      },
    }),
  );
