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
  DeleteBoardRequestDto,
  BoardDeleteMode,
} from './delete-board.request.dto';
import { DeleteBoardResponseDto } from './delete-board.response.dto';

export function ApiDeleteBoard() {
  return applyDecorators(
    ApiTags('Kanban Management - DELETE'),
    ApiOperation({
      summary: 'Delete a kanban board',
      description: `
        Deletes a kanban board with various deletion modes:
        - SOFT_DELETE: Mark board as deleted but keep it recoverable
        - HARD_DELETE: Permanently remove board and handle tasks/columns
        - ARCHIVE: Archive board for long-term storage
        - EXPORT_AND_DELETE: Move all tasks to target board then delete

        ⚠️ **CRITICAL CONSIDERATIONS:**
        - Cannot hard delete the last active board
        - Boards with tasks require forceDelete=true or EXPORT_AND_DELETE mode
        - All columns and associated data will be affected
        - Board members will be notified if enabled

        📋 **DELETION MODES:**
        - **Soft Delete**: Board marked as deleted, fully recoverable
        - **Hard Delete**: Board permanently removed, minimal recovery
        - **Archive**: Board archived for compliance/audit purposes
        - **Export & Delete**: Tasks moved to target board, original deleted

        🔒 **VALIDATION RULES:**
        - Board must exist and be accessible
        - Cannot hard delete last active board
        - Target board required for EXPORT_AND_DELETE mode
        - Cannot export to the same board being deleted
        - Force delete required if board has active tasks (except export mode)

        💾 **DATA HANDLING:**
        - Backup creation optional but recommended
        - File deletion optional and separate from board deletion
        - Task relocation tracked with full audit trail
        - Member notifications sent if enabled
      `,
    }),
    ApiParam({
      name: 'boardId',
      description: 'UUID of the board to delete',
      type: 'string',
      format: 'uuid',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiBody({
      type: DeleteBoardRequestDto,
      description: 'Board deletion configuration',
      examples: {
        softDelete: {
          summary: 'Soft delete board',
          description: 'Mark board as deleted but keep recoverable',
          value: {
            deleteMode: BoardDeleteMode.SOFT_DELETE,
            deletedBy: 'user-123',
            deleteReason: 'Project completed',
            notifyMembers: true,
            createBackup: true,
          },
        },
        hardDeleteWithForce: {
          summary: 'Hard delete with force',
          description: 'Permanently remove board with all data',
          value: {
            deleteMode: BoardDeleteMode.HARD_DELETE,
            deletedBy: 'admin-456',
            deleteReason: 'Board cleanup - obsolete project',
            forceDelete: true,
            notifyMembers: true,
            createBackup: true,
            deleteFiles: true,
          },
        },
        archiveBoard: {
          summary: 'Archive board',
          description: 'Archive board for long-term storage',
          value: {
            deleteMode: BoardDeleteMode.ARCHIVE,
            deletedBy: 'user-789',
            deleteReason: 'End of fiscal year archival',
            notifyMembers: false,
            createBackup: true,
          },
        },
        exportAndDelete: {
          summary: 'Export tasks and delete board',
          description: 'Move all tasks to target board then delete',
          value: {
            deleteMode: BoardDeleteMode.EXPORT_AND_DELETE,
            targetBoardId: '456e7890-e89b-12d3-a456-426614174000',
            deletedBy: 'user-101',
            deleteReason: 'Consolidating boards',
            notifyMembers: true,
            createBackup: true,
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Board successfully deleted',
      type: DeleteBoardResponseDto,
      example: {
        boardId: '123e4567-e89b-12d3-a456-426614174000',
        boardName: 'Sprint Planning Board',
        deleteMode: BoardDeleteMode.SOFT_DELETE,
        deletedBy: 'user-123',
        deletedAt: '2024-01-15T10:30:00.000Z',
        deleteReason: 'Project completed',
        columnsDeleted: 5,
        tasksInBoard: 23,
        tasksRelocated: 0,
        targetBoardId: null,
        targetBoardName: null,
        taskRelocations: [],
        notifiedMembers: ['user-456', 'user-789', 'user-101'],
        success: true,
        canBeRestored: true,
        backupPath: '/backups/boards/board-123_2024-01-15.json',
        filesDeletion: {
          totalFiles: 12,
          deletedFiles: 10,
          failedDeletions: ['file1.pdf'],
          totalSizeDeleted: 2048576,
        },
        historyLogId: 'hist-123',
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid deletion request',
      example: {
        statusCode: 400,
        message: [
          'deleteMode must be one of: SOFT_DELETE, HARD_DELETE, ARCHIVE, EXPORT_AND_DELETE',
          'targetBoardId is required when using EXPORT_AND_DELETE mode',
          'Cannot export to the same board being deleted',
        ],
        error: 'Bad Request',
      },
    }),
    ApiNotFoundResponse({
      description: 'Board or target board not found',
      example: {
        statusCode: 404,
        message: 'Board with ID 123e4567-e89b-12d3-a456-426614174000 not found',
        error: 'Not Found',
      },
    }),
    ApiConflictResponse({
      description: 'Deletion conflict',
      example: {
        statusCode: 409,
        message:
          'Cannot delete board: 23 tasks are in this board. Use forceDelete=true or EXPORT_AND_DELETE mode.',
        error: 'Conflict',
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error during deletion',
      example: {
        statusCode: 500,
        message: 'Failed to delete board due to database constraints',
        error: 'Internal Server Error',
      },
    }),
  );
}
