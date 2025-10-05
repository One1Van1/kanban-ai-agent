import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { GetAgentTaskHistoryResponseDto } from './get-agent-task-history.response.dto';

export const ApiGetAgentTaskHistory = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get task history records by agent ID',
      description:
        'Retrieves task history records for a specific agent with optional limit',
    }),
    ApiParam({
      name: 'agentId',
      description: 'UUID of the agent to get history for',
      example: 'd5a9adec-daa3-48e2-a563-107f13ae2bcd',
    }),
    ApiQuery({
      name: 'limit',
      description: 'Maximum number of records to return (1-1000)',
      required: false,
      type: Number,
      example: 50,
    }),
    ApiOkResponse({
      type: GetAgentTaskHistoryResponseDto,
      description: 'Task history records retrieved successfully',
    }),
  );
