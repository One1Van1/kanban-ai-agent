import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CloneFlowRequestDto } from './clone-flow.request.dto';
import { CloneFlowResponseDto } from './clone-flow.response.dto';

export const ApiCloneFlow = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Clone an existing flow',
      description:
        'Creates a copy of an existing flow with new IDs for all blocks and edges',
    }),
    ApiParam({
      name: 'id',
      description: 'Unique identifier of the flow to clone',
      example: 'flow-123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiBody({ type: CloneFlowRequestDto }),
    ApiCreatedResponse({
      description: 'Flow cloned successfully',
      type: CloneFlowResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'Original flow not found',
    }),
  );
