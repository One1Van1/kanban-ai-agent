import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { DeleteTaskRequestDto } from './delete-task.request.dto';
import { DeleteTaskResponseDto } from './delete-task.response.dto';

export function DeleteTaskOpenApi() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete task',
      description:
        'Deletes a task with configurable deletion modes: soft delete, hard delete, or archive. Handles dependencies and related data cleanup.',
    }),
    ApiParam({
      name: 'id',
      description: 'Unique identifier of the task to delete',
      example: 'a8f5f167-aa89-4f26-a2b1-2b5e4b9b2c8a',
    }),
    ApiQuery({
      name: 'deleteMode',
      description: 'Type of deletion to perform',
      enum: ['soft_delete', 'hard_delete', 'archive'],
      required: false,
      example: 'soft_delete',
    }),
    ApiQuery({
      name: 'deletedBy',
      description: 'User performing the deletion',
      required: true,
      example: 'agent-001',
    }),
    ApiQuery({
      name: 'deleteReason',
      description: 'Reason for deleting the task',
      required: false,
      example: 'Task is no longer relevant due to requirement changes',
    }),
    ApiQuery({
      name: 'forceDelete',
      description: 'Whether to force delete even if task has dependencies',
      required: false,
      type: Boolean,
      example: false,
    }),
    ApiQuery({
      name: 'deleteRelatedData',
      description: 'Whether to delete related attachments and comments',
      required: false,
      type: Boolean,
      example: true,
    }),
    ApiQuery({
      name: 'notifyUsers',
      description: 'Whether to notify watchers and assignees about deletion',
      required: false,
      type: Boolean,
      example: true,
    }),
    ApiResponse({
      status: 200,
      description: 'Task deleted successfully',
      type: DeleteTaskResponseDto,
      examples: {
        softDelete: {
          summary: 'Soft Delete',
          value: {
            taskId: 'a8f5f167-aa89-4f26-a2b1-2b5e4b9b2c8a',
            taskKey: 'TASK-123',
            taskTitle: 'Implement user authentication',
            deleteMode: 'soft_delete',
            deletedBy: 'agent-001',
            deletedAt: '2024-01-15T10:30:00Z',
            deleteReason: 'Task is no longer relevant',
            originalStatus: 'in_progress',
            originalColumn: 'In Progress',
            assignee: 'agent-002',
            watchers: ['agent-003', 'agent-004'],
            relatedTasks: ['task-456'],
            attachmentsDeleted: 0,
            commentsDeleted: 0,
            historyEntriesArchived: 15,
            notifiedUsers: ['agent-002', 'agent-003', 'agent-004'],
            success: true,
            canBeRestored: true,
            restorationDeadline: '2024-02-15T10:30:00Z',
            historyLogId: 'b9f6f267-bb90-5f37-b3c2-3c6e5c0c3d9b',
          },
        },
        hardDelete: {
          summary: 'Hard Delete',
          value: {
            taskId: 'a8f5f167-aa89-4f26-a2b1-2b5e4b9b2c8a',
            taskKey: 'TASK-123',
            taskTitle: 'Implement user authentication',
            deleteMode: 'hard_delete',
            deletedBy: 'agent-001',
            deletedAt: '2024-01-15T10:30:00Z',
            deleteReason: 'Permanent cleanup of obsolete tasks',
            originalStatus: 'done',
            originalColumn: 'Done',
            assignee: 'agent-002',
            watchers: [],
            relatedTasks: [],
            attachmentsDeleted: 3,
            commentsDeleted: 7,
            historyEntriesArchived: 15,
            notifiedUsers: ['agent-002'],
            success: true,
            canBeRestored: false,
            historyLogId: 'b9f6f267-bb90-5f37-b3c2-3c6e5c0c3d9b',
          },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid deletion parameters or constraints violated',
      schema: {
        example: {
          statusCode: 400,
          message: 'Cannot hard delete completed tasks without force flag',
          error: 'Bad Request',
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Task not found',
      schema: {
        example: {
          statusCode: 404,
          message:
            'Task with ID a8f5f167-aa89-4f26-a2b1-2b5e4b9b2c8a not found',
          error: 'Not Found',
        },
      },
    }),
    ApiConflictResponse({
      description:
        'Task cannot be deleted due to dependencies or current state',
      schema: {
        example: {
          statusCode: 409,
          message:
            'Cannot delete task: 3 tasks depend on this task. Use forceDelete=true to override.',
          error: 'Conflict',
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error during task deletion',
      schema: {
        example: {
          statusCode: 500,
          message: 'Failed to delete task',
          error: 'Internal Server Error',
        },
      },
    }),
  );
}
