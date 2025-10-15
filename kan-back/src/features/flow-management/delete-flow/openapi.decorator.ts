import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiParam,
} from '@nestjs/swagger';
import { DeleteFlowResponseDto } from './delete-flow.response.dto';

export const ApiDeleteFlow = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Delete flow by ID',
      description: 'Permanently deletes a flow and all its associated data',
    }),
    ApiParam({
      name: 'id',
      description: 'Unique identifier of the flow to delete',
      example: 'flow-123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiOkResponse({
      description: 'Flow deleted successfully',
      type: DeleteFlowResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'Flow not found',
    }),
  );
