import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiParam,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { GetTaskDetailsResponseDto } from './get-task-details.response.dto';

export const ApiGetTaskDetails = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get detailed task information by ID' }),
    ApiParam({
      name: 'id',
      type: 'number',
      description: 'Task ID',
      example: 123,
    }),
    ApiOkResponse({
      description: 'Task details retrieved successfully',
      type: GetTaskDetailsResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'Task not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Task with ID 123 not found' },
          error: { type: 'string', example: 'Not Found' },
        },
      },
    }),
  );
