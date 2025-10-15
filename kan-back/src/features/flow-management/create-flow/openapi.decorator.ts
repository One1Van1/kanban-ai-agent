import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiBody,
} from '@nestjs/swagger';
import { CreateFlowRequestDto } from './create-flow.request.dto';
import { CreateFlowResponseDto } from './create-flow.response.dto';

export const ApiCreateFlow = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Create a new flow',
      description:
        'Creates a new flow with blocks, edges, and configuration. The flow can be associated with an agent and contains metadata for organization.',
    }),
    ApiBody({ type: CreateFlowRequestDto }),
    ApiCreatedResponse({
      description: 'Flow created successfully',
      type: CreateFlowResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Invalid flow definition or missing required fields',
    }),
    ApiNotFoundResponse({
      description: 'Agent not found (if agentId provided)',
    }),
  );
