import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProcessReportTaskResponseDto } from './process-report-task.response.dto';

export const ApiProcessReportTask = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Process report task assigned to AI-Report-maker',
      description:
        'Automatically process a Jira task assigned to AI-Report-maker to generate and post a report',
    }),
    ApiResponse({
      status: 200,
      description: 'Report task processed successfully',
      type: ProcessReportTaskResponseDto,
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid task or not assigned to AI-Report-maker',
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error during task processing',
    }),
  );
