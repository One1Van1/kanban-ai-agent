import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiParam,
} from '@nestjs/swagger';
import { GetFlowResponseDto } from './get-flow.response.dto';

export const ApiGetFlow = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get flow by ID',
      description:
        'Retrieves a flow by its unique identifier with all associated data',
    }),
    ApiParam({
      name: 'id',
      description: 'Unique identifier of the flow',
      example: 'flow-123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiOkResponse({
      description: 'Flow retrieved successfully',
      type: GetFlowResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'Flow not found',
    }),
  );
