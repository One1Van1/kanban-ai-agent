import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { SetFlowVariablesRequestDto } from './set-flow-variables.request.dto';
import { SetFlowVariablesResponseDto } from './set-flow-variables.response.dto';

export const ApiSetFlowVariables = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Set flow variables',
      description:
        'Create or update variables in a specific flow execution with advanced merging capabilities',
    }),
    ApiParam({
      name: 'flowId',
      description: 'Flow execution ID to set variables in',
      example: 'flow_exec_123',
      type: String,
    }),
    ApiBody({
      type: SetFlowVariablesRequestDto,
      description: 'Variables to set and configuration options',
      examples: {
        'Single Variable': {
          value: {
            variables: [
              {
                name: 'user_email',
                value: 'john.doe@company.com',
                type: 'string',
                scope: 'global',
                description: 'Current user email address',
                tags: ['user', 'email'],
              },
            ],
            updateMode: 'replace',
            createdBy: 'step_3',
          },
        },
        'Multiple Variables': {
          value: {
            variables: [
              {
                name: 'task_count',
                value: 42,
                type: 'number',
                scope: 'local',
                description: 'Number of processed tasks',
              },
              {
                name: 'processing_status',
                value: true,
                type: 'boolean',
                scope: 'shared',
                description: 'Current processing status',
              },
            ],
            updateMode: 'merge',
            validateTypes: true,
          },
        },
        'Object Merge': {
          value: {
            variables: [
              {
                name: 'task_data',
                value: { status: 'completed', assignee: 'john.doe' },
                type: 'object',
                scope: 'local',
                description: 'Task information object',
              },
            ],
            updateMode: 'merge',
            overwriteReadOnly: false,
          },
        },
      },
    }),
    ApiOkResponse({
      description: 'Flow variables set successfully',
      type: SetFlowVariablesResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Invalid request parameters or variable validation failed',
      schema: {
        examples: {
          'Missing Flow ID': {
            value: {
              statusCode: 400,
              message: 'Flow ID is required',
              error: 'Bad Request',
            },
          },
          'Type Validation Error': {
            value: {
              statusCode: 400,
              message: 'Variable user_age must be a number',
              error: 'Bad Request',
            },
          },
          'Empty Variables Array': {
            value: {
              statusCode: 400,
              message: 'variables must contain at least 1 elements',
              error: 'Bad Request',
            },
          },
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Flow execution not found',
      schema: {
        example: {
          statusCode: 404,
          message: 'Flow execution with ID flow_exec_123 not found',
          error: 'Not Found',
        },
      },
    }),
    ApiConflictResponse({
      description: 'Read-only variable conflict',
      schema: {
        example: {
          statusCode: 409,
          message:
            'Cannot overwrite read-only variable without overwriteReadOnly flag',
          error: 'Conflict',
        },
      },
    }),
  );
