import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { GetBoardSummaryResponseDto } from './get-board-summary.response.dto';

export const ApiGetBoardSummary = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get kanban board summary statistics',
      description:
        'Retrieves comprehensive statistics for the kanban board including column counts, priorities, and optional detailed metrics',
    }),
    ApiQuery({
      name: 'boardId',
      required: false,
      description: 'Board ID to get summary for',
      example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    }),
    ApiQuery({
      name: 'includeDetails',
      required: false,
      description: 'Include detailed statistics',
      example: true,
    }),
    ApiOkResponse({
      type: GetBoardSummaryResponseDto,
      description: 'Board summary retrieved successfully',
    }),
  );
