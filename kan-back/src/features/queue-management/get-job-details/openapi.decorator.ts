import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

export const ApiGetJobDetails = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get specific job details' }),
    ApiParam({ name: 'jobId', description: 'Job ID to retrieve' }),
    ApiResponse({
      status: 200,
      description: 'Job details retrieved successfully',
    }),
    ApiResponse({ status: 404, description: 'Job not found' }),
  );
