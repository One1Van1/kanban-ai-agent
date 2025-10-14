import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { GetBoardColumnsResponseDto } from './get-board-columns.response.dto';

export const ApiGetBoardColumns = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get Jira board columns',
      description:
        'Retrieves all columns and their configuration for a specific Jira board, including status mappings and column ordering',
    }),
    ApiResponse({
      status: 200,
      description: 'Board columns retrieved successfully',
      type: GetBoardColumnsResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'Board not found with the specified ID',
    }),
    ApiBadRequestResponse({
      description: 'Invalid board ID format',
    }),
  );
