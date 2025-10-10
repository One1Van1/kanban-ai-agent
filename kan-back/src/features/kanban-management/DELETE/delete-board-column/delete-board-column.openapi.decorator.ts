import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  DeleteBoardColumnRequestDto,
  ColumnDeleteMode,
} from './delete-board-column.request.dto';
import { DeleteBoardColumnResponseDto } from './delete-board-column.response.dto';

export function ApiDeleteBoardColumn() {
  return applyDecorators(
    ApiTags('Kanban Management - DELETE'),
    ApiOperation({
      summary: 'Delete a board column',
      description: `
        Deletes a board column with various deletion modes:
        - SOFT_DELETE: Mark column as deleted but keep it recoverable
        - HARD_DELETE: Permanently remove column and handle tasks
        - MERGE_WITH_ANOTHER: Merge column with another column

        ⚠️ **IMPORTANT CONSIDERATIONS:**
        - Cannot delete the last column in a board
        - Columns with tasks require forceDelete=true or merge mode
        - Position adjustments are made for remaining columns
        - History is logged for audit trail

        📋 **DELETION MODES:**
        - **Soft Delete**: Column marked as deleted, can be restored
        - **Hard Delete**: Column permanently removed, tasks handled
        - **Merge Mode**: Tasks moved to target column, original deleted

        🔒 **VALIDATION RULES:**
        - Column must exist and be active
        - Cannot delete last column in board
        - Target column required for merge mode
        - Cannot merge column with itself
      `,
    }),
    ApiParam({
      name: 'columnId',
      description: 'UUID of the column to delete',
      type: 'string',
      format: 'uuid',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiBody({
      type: DeleteBoardColumnRequestDto,
      description: 'Column deletion configuration',
      examples: {
        softDelete: {
          summary: 'Soft delete column',
          description: 'Mark column as deleted but keep recoverable',
          value: {
            deleteMode: ColumnDeleteMode.SOFT_DELETE,
            deletedBy: 'user-123',
            deleteReason: 'Column no longer needed',
            notifyUsers: true,
          },
        },
        hardDelete: {
          summary: 'Hard delete with force',
          description: 'Permanently remove column with tasks',
          value: {
            deleteMode: ColumnDeleteMode.HARD_DELETE,
            deletedBy: 'admin-456',
            deleteReason: 'Board restructuring',
            forceDelete: true,
            notifyUsers: true,
          },
        },
        mergeWithAnother: {
          summary: 'Merge with another column',
          description: 'Move all tasks to target column',
          value: {
            deleteMode: ColumnDeleteMode.MERGE_WITH_ANOTHER,
            targetColumnId: '789e4567-e89b-12d3-a456-426614174999',
            deletedBy: 'user-789',
            deleteReason: 'Consolidating similar columns',
            notifyUsers: true,
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Column successfully deleted',
      type: DeleteBoardColumnResponseDto,
      example: {
        columnId: '123e4567-e89b-12d3-a456-426614174000',
        boardId: 'board-456',
        columnName: 'In Review',
        deleteMode: ColumnDeleteMode.SOFT_DELETE,
        deletedBy: 'user-123',
        deletedAt: '2024-01-15T10:30:00.000Z',
        deleteReason: 'Column no longer needed',
        originalPosition: 3,
        tasksInColumn: 5,
        tasksRelocated: 0,
        targetColumnId: null,
        targetColumnName: null,
        positionAdjustments: [
          {
            columnId: 'col-789',
            oldPosition: 4,
            newPosition: 3,
          },
          {
            columnId: 'col-101',
            oldPosition: 5,
            newPosition: 4,
          },
        ],
        notifiedUsers: ['user-456', 'user-789'],
        success: true,
        canBeRestored: true,
        remainingColumnsInBoard: 4,
        historyLogId: 'hist-123',
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid deletion request',
      example: {
        statusCode: 400,
        message: [
          'deleteMode must be one of: SOFT_DELETE, HARD_DELETE, MERGE_WITH_ANOTHER',
          'targetColumnId is required when merging with another column',
          'Cannot merge column with itself',
        ],
        error: 'Bad Request',
      },
    }),
    ApiNotFoundResponse({
      description: 'Column or target column not found',
      example: {
        statusCode: 404,
        message:
          'Column with ID 123e4567-e89b-12d3-a456-426614174000 not found',
        error: 'Not Found',
      },
    }),
    ApiConflictResponse({
      description: 'Deletion conflict',
      example: {
        statusCode: 409,
        message:
          'Cannot delete column: 5 tasks are in this column. Use forceDelete=true or merge with another column.',
        error: 'Conflict',
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error during deletion',
      example: {
        statusCode: 500,
        message: 'Failed to delete column due to database constraints',
        error: 'Internal Server Error',
      },
    }),
  );
}
