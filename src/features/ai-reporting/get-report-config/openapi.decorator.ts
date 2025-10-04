import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetReportConfigResponseDto } from './get-report-config.response.dto';

export const ApiGetReportConfig = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get current configuration for report generation',
      description:
        'Display current configuration settings for the report generation service',
    }),
    ApiResponse({
      status: 200,
      description: 'Configuration retrieved successfully',
      type: GetReportConfigResponseDto,
    }),
  );
