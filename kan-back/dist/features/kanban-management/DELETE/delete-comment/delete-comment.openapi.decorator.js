"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiDeleteComment = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const delete_comment_request_dto_1 = require("./delete-comment.request.dto");
const delete_comment_response_dto_1 = require("./delete-comment.response.dto");
const ApiDeleteComment = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Delete a comment',
    description: `
        Deletes a comment from a task with different deletion modes:
        - SOFT_DELETE: Mark comment as deleted but keep recoverable
        - HARD_DELETE: Permanently remove comment from system
        
        Only the original author or users with appropriate permissions 
        can delete comments. All deletions are tracked for audit purposes.
      `,
}), (0, swagger_1.ApiParam)({
    name: 'commentId',
    description: 'UUID of the comment to delete',
    type: 'string',
    format: 'uuid',
    example: 'comment-123e4567-e89b-12d3-a456-426614174000',
}), (0, swagger_1.ApiBody)({
    type: delete_comment_request_dto_1.DeleteCommentRequestDto,
    description: 'Comment deletion configuration',
    examples: {
        softDelete: {
            summary: 'Soft delete comment',
            description: 'Mark comment as deleted but keep recoverable',
            value: {
                deleteMode: delete_comment_request_dto_1.CommentDeleteMode.SOFT_DELETE,
                deletedBy: 'user-123',
                deleteReason: 'Comment no longer relevant',
            },
        },
        hardDelete: {
            summary: 'Hard delete comment',
            description: 'Permanently remove comment from system',
            value: {
                deleteMode: delete_comment_request_dto_1.CommentDeleteMode.HARD_DELETE,
                deletedBy: 'admin-456',
                deleteReason: 'Comment violates community guidelines',
            },
        },
    },
}), (0, swagger_1.ApiResponse)({
    status: 200,
    description: 'Comment successfully deleted',
    type: delete_comment_response_dto_1.DeleteCommentResponseDto,
    example: {
        commentId: 'comment-123e4567-e89b-12d3-a456-426614174000',
        taskId: 'task-456e7890-e89b-12d3-a456-426614174000',
        content: 'This comment has been deleted',
        deleteMode: delete_comment_request_dto_1.CommentDeleteMode.SOFT_DELETE,
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
}), (0, swagger_1.ApiBadRequestResponse)({
    description: 'Invalid comment deletion request',
    example: {
        statusCode: 400,
        message: ['deleteMode must be one of: SOFT_DELETE, HARD_DELETE'],
        error: 'Bad Request',
    },
}), (0, swagger_1.ApiNotFoundResponse)({
    description: 'Comment not found',
    example: {
        statusCode: 404,
        message: 'Comment with ID comment-123e4567-e89b-12d3-a456-426614174000 not found',
        error: 'Not Found',
    },
}), (0, swagger_1.ApiForbiddenResponse)({
    description: 'Insufficient permissions to delete comment',
    example: {
        statusCode: 403,
        message: 'You can only delete your own comments',
        error: 'Forbidden',
    },
}), (0, swagger_1.ApiInternalServerErrorResponse)({
    description: 'Internal server error during comment deletion',
    example: {
        statusCode: 500,
        message: 'Failed to delete comment',
        error: 'Internal Server Error',
    },
}));
exports.ApiDeleteComment = ApiDeleteComment;
//# sourceMappingURL=delete-comment.openapi.decorator.js.map