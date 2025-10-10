import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { GetTaskCommentsResponseDto } from './get-task-comments.response.dto';

export const ApiGetTaskComments = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get task comments with pagination',
      description:
        'Retrieves all comments for a specific task with pagination support',
    }),
    ApiParam({
      name: 'id',
      description: 'Task ID',
      example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    }),
    ApiQuery({
      name: 'page',
      required: false,
      description: 'Page number for pagination',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      description: 'Number of comments per page',
      example: 20,
    }),
    ApiQuery({
      name: 'sortOrder',
      required: false,
      description: 'Sort order by creation date',
      example: 'DESC',
    }),
    ApiOkResponse({
      type: GetTaskCommentsResponseDto,
      description: 'Task comments retrieved successfully',
    }),
    ApiBadRequestResponse({
      description: 'Invalid request parameters',
    }),
  );
