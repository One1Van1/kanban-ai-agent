import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetReportHealthResponseDto } from './get-report-health.response.dto';

export const ApiGetReportHealth = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Health check for report generation service',
      description: 'Check if the report generation service is operational',
    }),
    ApiResponse({
      status: 200,
      description: 'Service is healthy',
      type: GetReportHealthResponseDto,
    }),
  );
