import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { ExecuteAgentActionResponseDto } from './execute-agent-action.response.dto';

export const ApiExecuteAgentAction = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Execute AI agent action based on task events',
      description:
        'Triggers the AI agent to perform actions based on task events like moving to a column, assignment changes, etc. The agent will analyze the task context and execute appropriate actions according to its configured instructions.',
    }),
    ApiOkResponse({
      type: ExecuteAgentActionResponseDto,
      description: 'Agent action executed successfully',
    }),
    ApiBadRequestResponse({
      description: 'Invalid request data or missing required fields',
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error during agent execution',
    }),
  );
