import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiParam,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { MoveTaskResponseDto } from './move-task-response.dto';

export const ApiMoveTaskToColumn = () =>
  applyDecorators(
    ApiOperation({ summary: 'Move a task to a different column' }),
    ApiParam({
      name: 'id',
      type: 'string',
      description: 'Task ID',
      example: 'PROJ-123',
    }),
    ApiOkResponse({
      description: 'Task moved successfully',
      type: MoveTaskResponseDto,
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
