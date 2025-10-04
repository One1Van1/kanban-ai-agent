import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiTags,
} from '@nestjs/swagger';
import { TrackAgentInTaskRequestDto } from './track-agent-in-task.request.dto';
import { TrackAgentInTaskResponseDto } from './track-agent-in-task.response.dto';

export function TrackAgentInTaskOpenApiDecorator() {
  return applyDecorators(
    ApiTags('AI Agent'),
    ApiOperation({
      summary: 'Track AI agent in specific task',
      description:
        'Assigns an AI agent to track and work on a specific Jira task in a kanban board',
    }),
    ApiParam({
      name: 'agentId',
      description: 'Unique identifier of the AI agent',
      type: 'string',
      example: 'agent-123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiBody({
      type: TrackAgentInTaskRequestDto,
      description: 'Task tracking configuration',
    }),
    ApiResponse({
      status: 200,
      description: 'Agent successfully assigned to track the task',
      type: TrackAgentInTaskResponseDto,
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - invalid agent ID or agent not active',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: {
            type: 'string',
            example: 'Agent agent-123 is not active and cannot track tasks',
          },
          error: { type: 'string', example: 'Bad Request' },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Agent not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: {
            type: 'string',
            example: 'Agent with ID agent-123 not found',
          },
          error: { type: 'string', example: 'Not Found' },
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 500 },
          message: {
            type: 'string',
            example: 'Internal server error while tracking agent in task',
          },
          error: { type: 'string', example: 'Internal Server Error' },
        },
      },
    }),
  );
}
