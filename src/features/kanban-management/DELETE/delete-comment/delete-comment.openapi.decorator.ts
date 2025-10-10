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
} from '@nestjs/swagger';
import {
  DeleteCommentRequestDto,
  CommentDeleteMode,
} from './delete-comment.request.dto';
import { DeleteCommentResponseDto } from './delete-comment.response.dto';

export const ApiDeleteComment = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Delete a comment',
      description: `
        Deletes a comment from a task with different deletion modes:
        - SOFT_DELETE: Mark comment as deleted but keep recoverable
        - HARD_DELETE: Permanently remove comment from system
        
        Only the original author or users with appropriate permissions 
        can delete comments. All deletions are tracked for audit purposes.
      `,
    }),
    ApiParam({
      name: 'commentId',
      description: 'UUID of the comment to delete',
      type: 'string',
      format: 'uuid',
      example: 'comment-123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiBody({
      type: DeleteCommentRequestDto,
      description: 'Comment deletion configuration',
      examples: {
        softDelete: {
          summary: 'Soft delete comment',
          description: 'Mark comment as deleted but keep recoverable',
          value: {
            deleteMode: CommentDeleteMode.SOFT_DELETE,
            deletedBy: 'user-123',
            deleteReason: 'Comment no longer relevant',
          },
        },
        hardDelete: {
          summary: 'Hard delete comment',
          description: 'Permanently remove comment from system',
          value: {
            deleteMode: CommentDeleteMode.HARD_DELETE,
            deletedBy: 'admin-456',
            deleteReason: 'Comment violates community guidelines',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Comment successfully deleted',
      type: DeleteCommentResponseDto,
      example: {
        commentId: 'comment-123e4567-e89b-12d3-a456-426614174000',
        taskId: 'task-456e7890-e89b-12d3-a456-426614174000',
        content: 'This comment has been deleted',
        deleteMode: CommentDeleteMode.SOFT_DELETE,
        originalAuthor: 'user-789',
        deletedBy: 'user-123',
        originalCreatedAt: '2024-01-10T08:15:00.000Z',
        deletedAt: '2024-01-15T10:30:00.000Z',
        deleteReason: 'Comment no longer relevant',
        canBeRestored: true,
        remainingCommentsCount: 5,
        success: true,
        historyLogId: 'hist-789',
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid comment deletion request',
      example: {
        statusCode: 400,
        message: ['deleteMode must be one of: SOFT_DELETE, HARD_DELETE'],
        error: 'Bad Request',
      },
    }),
    ApiNotFoundResponse({
      description: 'Comment not found',
      example: {
        statusCode: 404,
        message:
          'Comment with ID comment-123e4567-e89b-12d3-a456-426614174000 not found',
        error: 'Not Found',
      },
    }),
    ApiForbiddenResponse({
      description: 'Insufficient permissions to delete comment',
      example: {
        statusCode: 403,
        message: 'You can only delete your own comments',
        error: 'Forbidden',
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error during comment deletion',
      example: {
        statusCode: 500,
        message: 'Failed to delete comment',
        error: 'Internal Server Error',
      },
    }),
  );
