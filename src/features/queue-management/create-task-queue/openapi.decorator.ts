import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateTaskQueueResponseDto } from './create-task-queue.dto';

export const ApiCreateTaskQueue = () =>
  applyDecorators(
    ApiOperation({ summary: 'Add task to processing queue' }),
    ApiResponse({
      status: 201,
      description: 'Task successfully added to queue',
      type: CreateTaskQueueResponseDto,
    }),
    ApiResponse({ status: 400, description: 'Invalid request data' }),
    ApiResponse({ status: 500, description: 'Internal server error' }),
  );
