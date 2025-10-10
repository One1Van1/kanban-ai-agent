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
import { UpdateCommentRequestDto } from './update-comment.request.dto';
import { UpdateCommentResponseDto } from './update-comment.response.dto';

export const ApiUpdateComment = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Update a comment',
      description: `
        Updates the content of an existing comment on a task.
        
        Only the original author or users with appropriate permissions 
        can edit comments. All edits are tracked for audit purposes.
      `,
    }),
    ApiParam({
      name: 'commentId',
      description: 'UUID of the comment to update',
      type: 'string',
      format: 'uuid',
      example: 'comment-123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiBody({
      type: UpdateCommentRequestDto,
      description: 'Comment update data',
      examples: {
        updateComment: {
          summary: 'Update comment content',
          description: 'Update comment with new content and reason',
          value: {
            content:
              'Updated: This is the corrected analysis of the issue. The problem was in the validation logic.',
            updatedBy: 'user-123',
            updateReason: 'Fixed typo and added clarification',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Comment successfully updated',
      type: UpdateCommentResponseDto,
      example: {
        commentId: 'comment-123e4567-e89b-12d3-a456-426614174000',
        taskId: 'task-456e7890-e89b-12d3-a456-426614174000',
        content:
          'Updated: This is the corrected analysis of the issue. The problem was in the validation logic.',
        originalContent: 'This is the analysis of the issue.',
        originalAuthor: 'user-789',
        updatedBy: 'user-123',
        originalCreatedAt: '2024-01-10T08:15:00.000Z',
        updatedAt: '2024-01-15T10:30:00.000Z',
        updateReason: 'Fixed typo and added clarification',
        isEdited: true,
        editCount: 2,
        contentLength: 97,
        success: true,
        historyLogId: 'hist-789',
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid comment update request',
      example: {
        statusCode: 400,
        message: [
          'content must be longer than or equal to 1 characters',
          'content must be shorter than or equal to 2000 characters',
        ],
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
      description: 'Insufficient permissions to edit comment',
      example: {
        statusCode: 403,
        message: 'You can only edit your own comments',
        error: 'Forbidden',
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error during comment update',
      example: {
        statusCode: 500,
        message: 'Failed to update comment',
        error: 'Internal Server Error',
      },
    }),
  );
