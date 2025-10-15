import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { UpdateFlowRequestDto } from './update-flow.request.dto';
import { UpdateFlowResponseDto } from './update-flow.response.dto';

export const ApiUpdateFlow = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Update flow by ID',
      description:
        'Updates an existing flow with new data. Only provided fields will be updated.',
    }),
    ApiParam({
      name: 'id',
      description: 'Unique identifier of the flow to update',
      example: 'flow-123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiBody({ type: UpdateFlowRequestDto }),
    ApiOkResponse({
      description: 'Flow updated successfully',
      type: UpdateFlowResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'Flow not found',
    }),
    ApiBadRequestResponse({
      description: 'Invalid flow definition or missing required fields',
    }),
  );
