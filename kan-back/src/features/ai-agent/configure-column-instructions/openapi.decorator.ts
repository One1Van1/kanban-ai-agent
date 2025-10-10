import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { ConfigureColumnInstructionsResponseDto } from './configure-column-instructions.response.dto';

export const ApiConfigureColumnInstructions = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Configure column-specific instructions for AI agent',
      description:
        'Sets up specific instructions and trigger conditions for an AI agent when tasks are in a particular Kanban column. This allows the agent to behave differently based on the task status/column.',
    }),
    ApiCreatedResponse({
      type: ConfigureColumnInstructionsResponseDto,
      description: 'Column instructions configured successfully',
    }),
    ApiBadRequestResponse({
      description: 'Invalid request data or agent/column validation failed',
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error occurred',
    }),
  );
