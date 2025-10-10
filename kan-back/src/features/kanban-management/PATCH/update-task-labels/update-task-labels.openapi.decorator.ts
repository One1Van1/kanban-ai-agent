import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import {
  UpdateTaskLabelsRequestDto,
  LabelOperation,
} from './update-task-labels.request.dto';
import { UpdateTaskLabelsResponseDto } from './update-task-labels.response.dto';

export const ApiUpdateTaskLabels = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Update task labels',
      description: `
        Updates labels on a task with different operations:
        - ADD: Add new labels to existing ones
        - REMOVE: Remove specific labels from task
        - REPLACE: Replace all labels with new set
        
        Labels are used for categorization, filtering, and organization.
      `,
    }),
    ApiParam({
      name: 'taskId',
      description: 'UUID of the task to update labels for',
      type: 'string',
      format: 'uuid',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiBody({
      type: UpdateTaskLabelsRequestDto,
      description: 'Label update configuration',
      examples: {
        addLabels: {
          summary: 'Add labels',
          description: 'Add new labels to existing ones',
          value: {
            operation: LabelOperation.ADD,
            labels: ['bug', 'high-priority'],
            updatedBy: 'user-123',
            updateReason: 'Added priority after triage',
          },
        },
        removeLabels: {
          summary: 'Remove labels',
          description: 'Remove specific labels from task',
          value: {
            operation: LabelOperation.REMOVE,
            labels: ['low-priority', 'draft'],
            updatedBy: 'user-456',
            updateReason: 'Removed outdated labels',
          },
        },
        replaceLabels: {
          summary: 'Replace all labels',
          description: 'Replace all existing labels with new set',
          value: {
            operation: LabelOperation.REPLACE,
            labels: ['feature', 'backend', 'ready-for-review'],
            updatedBy: 'user-789',
            updateReason: 'Updated labels after implementation',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Labels successfully updated',
      type: UpdateTaskLabelsResponseDto,
      example: {
        taskId: '123e4567-e89b-12d3-a456-426614174000',
        operation: LabelOperation.ADD,
        currentLabels: ['bug', 'high-priority', 'backend', 'in-review'],
        addedLabels: ['high-priority', 'backend'],
        removedLabels: [],
        totalLabelsCount: 4,
        updatedAt: '2024-01-15T10:30:00.000Z',
        updatedBy: 'user-123',
        updateReason: 'Added priority after triage',
        success: true,
        labelChanges: [
          {
            labelName: 'high-priority',
            operation: 'added',
            timestamp: '2024-01-15T10:30:00.000Z',
          },
          {
            labelName: 'backend',
            operation: 'added',
            timestamp: '2024-01-15T10:30:00.000Z',
          },
        ],
        historyLogId: 'hist-789',
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid label update request',
      example: {
        statusCode: 400,
        message: [
          'operation must be one of: ADD, REMOVE, REPLACE',
          'labels must be an array of strings',
        ],
        error: 'Bad Request',
      },
    }),
    ApiNotFoundResponse({
      description: 'Task not found',
      example: {
        statusCode: 404,
        message: 'Task with ID 123e4567-e89b-12d3-a456-426614174000 not found',
        error: 'Not Found',
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error during label update',
      example: {
        statusCode: 500,
        message: 'Failed to update task labels',
        error: 'Internal Server Error',
      },
    }),
  );
