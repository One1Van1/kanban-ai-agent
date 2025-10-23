import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ExportFlowJsonResponseDto } from './export-flow-json.response.dto';

export const ApiExportFlowJson = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Export flow to JSON format',
      description:
        'Exports a flow with all its blocks, connections, and metadata to JSON format for backup or migration purposes',
    }),
    ApiParam({
      name: 'id',
      description: 'Flow ID to export',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiOkResponse({
      description: 'Flow exported successfully',
      type: ExportFlowJsonResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'Flow not found',
    }),
  );
