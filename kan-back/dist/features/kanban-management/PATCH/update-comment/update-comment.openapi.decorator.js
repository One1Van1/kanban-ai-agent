"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiUpdateComment = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const update_comment_request_dto_1 = require("./update-comment.request.dto");
const update_comment_response_dto_1 = require("./update-comment.response.dto");
const ApiUpdateComment = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Update a comment',
    description: `
        Updates the content of an existing comment on a task.
        
        Only the original author or users with appropriate permissions 
        can edit comments. All edits are tracked for audit purposes.
      `,
}), (0, swagger_1.ApiParam)({
    name: 'commentId',
    description: 'UUID of the comment to update',
    type: 'string',
    format: 'uuid',
    example: 'comment-123e4567-e89b-12d3-a456-426614174000',
}), (0, swagger_1.ApiBody)({
    type: update_comment_request_dto_1.UpdateCommentRequestDto,
    description: 'Comment update data',
    examples: {
        updateComment: {
            summary: 'Update comment content',
            description: 'Update comment with new content and reason',
            value: {
                content: 'Updated: This is the corrected analysis of the issue. The problem was in the validation logic.',
                updatedBy: 'user-123',
                updateReason: 'Fixed typo and added clarification',
            },
        },
    },
}), (0, swagger_1.ApiResponse)({
    status: 200,
    description: 'Comment successfully updated',
    type: update_comment_response_dto_1.UpdateCommentResponseDto,
    example: {
        commentId: 'comment-123e4567-e89b-12d3-a456-426614174000',
        taskId: 'task-456e7890-e89b-12d3-a456-426614174000',
        content: 'Updated: This is the corrected analysis of the issue. The problem was in the validation logic.',
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
}), (0, swagger_1.ApiBadRequestResponse)({
    description: 'Invalid comment update request',
    example: {
        statusCode: 400,
        message: [
            'content must be longer than or equal to 1 characters',
            'content must be shorter than or equal to 2000 characters',
        ],
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
    description: 'Insufficient permissions to edit comment',
    example: {
        statusCode: 403,
        message: 'You can only edit your own comments',
        error: 'Forbidden',
    },
}), (0, swagger_1.ApiInternalServerErrorResponse)({
    description: 'Internal server error during comment update',
    example: {
        statusCode: 500,
        message: 'Failed to update comment',
        error: 'Internal Server Error',
    },
}));
exports.ApiUpdateComment = ApiUpdateComment;
//# sourceMappingURL=update-comment.openapi.decorator.js.map