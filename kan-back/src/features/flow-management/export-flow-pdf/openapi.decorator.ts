import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiProduces,
} from '@nestjs/swagger';

export const ApiExportFlowPdf = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Export flow to PDF format',
      description:
        'Exports a flow with all its blocks and connections to a visual PDF document for documentation or presentation purposes',
    }),
    ApiParam({
      name: 'id',
      description: 'Flow ID to export',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiProduces('application/pdf'),
    ApiOkResponse({
      description: 'Flow exported successfully as PDF',
      schema: {
        type: 'string',
        format: 'binary',
      },
    }),
    ApiNotFoundResponse({
      description: 'Flow not found',
    }),
  );
