import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { GetTaskTimelogResponseDto } from './get-task-timelog.response.dto';

export const ApiGetTaskTimelog = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get task timelog entries',
      description:
        'Retrieves paginated timelog entries for a specific task with summary statistics',
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
      description: 'Number of timelog entries per page',
      example: 20,
    }),
    ApiQuery({
      name: 'fromDate',
      required: false,
      description: 'Filter entries from this date',
      example: '2024-01-01T00:00:00Z',
    }),
    ApiQuery({
      name: 'toDate',
      required: false,
      description: 'Filter entries to this date',
      example: '2024-01-31T23:59:59Z',
    }),
    ApiOkResponse({
      type: GetTaskTimelogResponseDto,
      description: 'Task timelog retrieved successfully',
    }),
    ApiBadRequestResponse({
      description: 'Invalid request parameters',
    }),
  );
