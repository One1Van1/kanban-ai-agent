import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GenerateReportResponseDto } from './generate-report.response.dto';

export const ApiGenerateReport = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Generate haircut report for specified date range',
      description:
        'Generate comprehensive report of all haircuts performed within the specified date range',
    }),
    ApiResponse({
      status: 200,
      description: 'Report generated successfully',
      type: GenerateReportResponseDto,
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid request parameters',
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error during report generation',
    }),
  );
