import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { GetTasksByColumnResponseDto } from './get-tasks-by-column.response.dto';

export const ApiGetTasksByColumn = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get all tasks in a specific column with pagination',
    }),
    ApiParam({
      name: 'column',
      type: 'string',
      description: 'Column name',
      example: 'In Progress',
    }),
    ApiQuery({
      name: 'limit',
      type: 'number',
      required: false,
      description: 'Number of tasks to return (1-100)',
      example: 10,
    }),
    ApiQuery({
      name: 'offset',
      type: 'number',
      required: false,
      description: 'Number of tasks to skip',
      example: 0,
    }),
    ApiOkResponse({
      description: 'Tasks retrieved successfully',
      type: GetTasksByColumnResponseDto,
    }),
  );
