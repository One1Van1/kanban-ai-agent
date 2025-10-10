import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DeleteTaskLinkRequestDto } from './delete-task-link.request.dto';
import { DeleteTaskLinkResponseDto } from './delete-task-link.response.dto';

export function ApiDeleteTaskLink() {
  return applyDecorators(
    ApiTags('Kanban Management - Task Links'),
    ApiOperation({
      summary: 'Delete a link between tasks',
      description: `
        Removes a specific link/relationship between two tasks. This endpoint handles:
        - Deletion of task relationships (blocks, relates to, duplicates, etc.)
        - Removal of reciprocal links automatically
        - Audit trail creation for the deletion
        - Permission validation for link modifications
        
        Common use cases:
        - Remove blocking dependencies when tasks are completed
        - Correct incorrectly linked tasks
        - Clean up obsolete task relationships
        - Manage task dependency changes
      `,
      operationId: 'deleteTaskLink',
    }),
    ApiParam({
      name: 'taskId',
      description: 'UUID of the task containing the link to delete',
      example: '123e4567-e89b-12d3-a456-426614174000',
      format: 'uuid',
    }),
    ApiParam({
      name: 'linkId',
      description: 'UUID of the specific link to delete',
      example: 'link-456e7890-e89b-12d3-a456-426614174000',
      format: 'uuid',
    }),
    ApiBody({
      type: DeleteTaskLinkRequestDto,
      description: 'Optional metadata for the link deletion',
      required: false,
      examples: {
        basic: {
          summary: 'Basic deletion',
          description: 'Delete link without additional metadata',
          value: {},
        },
        withMetadata: {
          summary: 'Deletion with metadata',
          description: 'Delete link with user and reason tracking',
          value: {
            deletedBy: 'user-123e4567-e89b-12d3-a456-426614174000',
            deleteReason: 'Task dependencies changed after requirements update',
          },
        },
        systemDeletion: {
          summary: 'System-initiated deletion',
          description: 'Automatic cleanup when task is completed',
          value: {
            deleteReason: 'Automatic cleanup - blocking task completed',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Link successfully deleted with details',
      type: DeleteTaskLinkResponseDto,
      example: {
        taskId: '123e4567-e89b-12d3-a456-426614174000',
        linkId: 'link-456e7890-e89b-12d3-a456-426614174000',
        linkedTaskId: '789e1234-e89b-12d3-a456-426614174000',
        linkType: 'blocks',
        linkDirection: 'outbound',
        deletedBy: 'user-123e4567-e89b-12d3-a456-426614174000',
        deletedAt: '2024-01-15T10:30:00.000Z',
        deleteReason: 'Task dependencies changed after requirements update',
        linkedTaskTitle: 'Setup database configuration',
        remainingLinksCount: 2,
        success: true,
        historyLogId: 'hist-789e4567-e89b-12d3-a456-426614174000',
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid request parameters or malformed UUIDs',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: {
            type: 'string',
            example: 'Validation failed (uuid is expected)',
          },
          error: { type: 'string', example: 'Bad Request' },
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Task, link, or linked task not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: {
            oneOf: [
              {
                type: 'string',
                example:
                  'Task with ID 123e4567-e89b-12d3-a456-426614174000 not found',
              },
              {
                type: 'string',
                example:
                  'Link with ID link-456e7890-e89b-12d3-a456-426614174000 not found on task 123e4567-e89b-12d3-a456-426614174000',
              },
              {
                type: 'string',
                example:
                  'Linked task with ID 789e1234-e89b-12d3-a456-426614174000 not found',
              },
            ],
          },
          error: { type: 'string', example: 'Not Found' },
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'Insufficient permissions to delete task links',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 403 },
          message: {
            type: 'string',
            example: 'Insufficient permissions to delete task links',
          },
          error: { type: 'string', example: 'Forbidden' },
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error during link deletion',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 500 },
          message: { type: 'string', example: 'Internal server error' },
          error: { type: 'string', example: 'Internal Server Error' },
        },
      },
    }),
  );
}
