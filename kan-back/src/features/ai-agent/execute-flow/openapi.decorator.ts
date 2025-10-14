import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { ExecuteFlowResponseDto } from './execute-flow.response.dto';

export const ApiExecuteFlow = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Execute AI Flow',
      description:
        'Executes a Flow Builder definition by converting it to AI agent instructions and running them through the existing agent execution system',
    }),
    ApiResponse({
      status: 200,
      description: 'Flow execution started successfully',
      type: ExecuteFlowResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Invalid flow definition or missing required fields',
    }),
  );
