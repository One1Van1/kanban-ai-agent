import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ExecuteFlowRequestDto } from './execute-flow.request.dto';
import { ExecuteFlowResponseDto } from './execute-flow.response.dto';

export const ApiExecuteFlow = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Execute a flow',
      description:
        'Executes an active flow and generates agent instructions based on the flow definition',
    }),
    ApiParam({
      name: 'id',
      description: 'Unique identifier of the flow to execute',
      example: 'flow-123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiBody({ type: ExecuteFlowRequestDto }),
    ApiCreatedResponse({
      description: 'Flow execution started successfully',
      type: ExecuteFlowResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'Flow not found',
    }),
    ApiBadRequestResponse({
      description: 'Flow is not active or has invalid definition',
    }),
  );
