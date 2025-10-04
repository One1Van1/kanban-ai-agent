import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ConfigureAgentResponseDto } from './configure-agent.response.dto';

export const ApiConfigureAgent = () =>
  applyDecorators(
    ApiOperation({ summary: 'Configure existing AI agent' }),
    ApiParam({ name: 'agentId', description: 'Agent ID to configure' }),
    ApiResponse({
      status: 200,
      description: 'AI agent configured successfully',
      type: ConfigureAgentResponseDto,
    }),
    ApiResponse({ status: 400, description: 'Invalid request data' }),
    ApiResponse({ status: 404, description: 'Agent not found' }),
    ApiResponse({ status: 500, description: 'Internal server error' }),
  );
