import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { GetTaskStatisticsResponseDto } from './get-task-statistics.response.dto';

export const ApiGetTaskStatistics = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get task processing statistics',
      description:
        'Retrieves aggregated statistics about task processing, optionally filtered by agent',
    }),
    ApiQuery({
      name: 'agentId',
      description: 'UUID of agent to filter statistics (optional)',
      required: false,
      example: 'd5a9adec-daa3-48e2-a563-107f13ae2bcd',
    }),
    ApiOkResponse({
      type: GetTaskStatisticsResponseDto,
      description: 'Task processing statistics retrieved successfully',
    }),
  );
