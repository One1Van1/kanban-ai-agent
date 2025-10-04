import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const ApiGetQueueStatus = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get queue status and statistics' }),
    ApiResponse({
      status: 200,
      description: 'Queue status retrieved successfully',
    }),
  );
