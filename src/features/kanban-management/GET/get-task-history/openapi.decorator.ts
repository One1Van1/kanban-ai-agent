import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { GetTaskHistoryResponseDto } from './get-task-history.response.dto';

export const ApiGetTaskHistory = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get task history records by task ID',
      description: 'Retrieves all task history records for a specific task',
    }),
    ApiParam({
      name: 'taskId',
      description: 'ID of the task to get history for',
      example: 'TASK-123',
    }),
    ApiOkResponse({
      type: GetTaskHistoryResponseDto,
      description: 'Task history records retrieved successfully',
    }),
  );
