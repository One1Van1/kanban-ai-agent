import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { CreateTaskResponseDto } from './create-task.response.dto';

export const ApiCreateTask = () =>
  applyDecorators(
    ApiOperation({ summary: 'Create a new task in the kanban system' }),
    ApiCreatedResponse({
      description: 'Task created successfully',
      type: CreateTaskResponseDto,
    }),
    ApiConflictResponse({
      description: 'Task with the same key already exists',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 409 },
          message: {
            type: 'string',
            example: 'Task with key PROJ-123 already exists',
          },
          error: { type: 'string', example: 'Conflict' },
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
