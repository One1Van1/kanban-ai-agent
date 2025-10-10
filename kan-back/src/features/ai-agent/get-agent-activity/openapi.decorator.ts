import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { GetAgentActivityResponseDto } from './get-agent-activity.response.dto';
import { ActivityResultFilter } from './get-agent-activity.request.dto';

export const ApiGetAgentActivity = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get AI agent activity history',
      description:
        'Retrieves the execution history and activity log for a specific AI agent. Supports filtering by result status, task ID, date range and pagination.',
    }),
    ApiParam({
      name: 'agentId',
      description: 'ID of the AI agent to get activity for',
      example: 'agent_123',
    }),
    ApiQuery({
      name: 'limit',
      description: 'Number of activities to return (1-100)',
      required: false,
      example: 10,
    }),
    ApiQuery({
      name: 'offset',
      description: 'Number of activities to skip for pagination',
      required: false,
      example: 0,
    }),
    ApiQuery({
      name: 'result',
      enum: ActivityResultFilter,
      enumName: 'ActivityResultFilter',
      description: 'Filter by activity result status',
      required: false,
      example: ActivityResultFilter.ALL,
    }),
    ApiQuery({
      name: 'taskId',
      description: 'Filter activities by specific task ID',
      required: false,
      example: 'task_456',
    }),
    ApiQuery({
      name: 'fromDate',
      description: 'Filter activities from this date (YYYY-MM-DD)',
      required: false,
      example: '2023-12-01',
    }),
    ApiQuery({
      name: 'toDate',
      description: 'Filter activities to this date (YYYY-MM-DD)',
      required: false,
      example: '2023-12-07',
    }),
    ApiOkResponse({
      type: GetAgentActivityResponseDto,
      description: 'Agent activity retrieved successfully',
    }),
    ApiBadRequestResponse({
      description: 'Invalid request parameters or agent ID',
    }),
  );
