import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateAgentResponseDto } from './create-agent.response.dto';

export const ApiCreateAgent = () =>
  applyDecorators(
    ApiOperation({ summary: 'Create new AI agent' }),
    ApiResponse({
      status: 201,
      description: 'AI agent created successfully',
      type: CreateAgentResponseDto,
    }),
    ApiResponse({ status: 400, description: 'Invalid request data' }),
    ApiResponse({ status: 500, description: 'Internal server error' }),
  );
