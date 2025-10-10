import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { ConfigureContextSourcesResponseDto } from './configure-context-sources.response.dto';

export const ApiConfigureContextSources = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Configure context sources for AI agent',
      description:
        'Creates and configures a new context source for an AI agent. Context sources define how the agent gathers information about tasks and their environment.',
    }),
    ApiCreatedResponse({
      type: ConfigureContextSourcesResponseDto,
      description: 'Context source configured successfully',
    }),
    ApiBadRequestResponse({
      description: 'Invalid request data or configuration',
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error occurred',
    }),
  );
