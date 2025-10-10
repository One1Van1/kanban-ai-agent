"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiDeleteTaskAttachment = ApiDeleteTaskAttachment;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const delete_task_attachment_request_dto_1 = require("./delete-task-attachment.request.dto");
const delete_task_attachment_response_dto_1 = require("./delete-task-attachment.response.dto");
function ApiDeleteTaskAttachment() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiTags)('Kanban Management - DELETE'), (0, swagger_1.ApiOperation)({
        summary: 'Delete a task attachment',
        description: `
        Deletes an attachment from a task with various deletion modes:
        - SOFT_DELETE: Mark attachment as deleted but keep file recoverable
        - HARD_DELETE: Permanently remove attachment and optionally delete file
        - MOVE_TO_TRASH: Move attachment to trash with optional physical file move

        📎 **ATTACHMENT HANDLING:**
        - Logical deletion: Remove attachment reference from task
        - Physical deletion: Delete actual file from storage (optional)
        - Backup creation: Create backup before deletion (recommended)
        - Restoration: Soft delete and trash modes allow restoration

        🔒 **PERMISSION VALIDATION:**
        - Users can delete their own uploaded attachments
        - Admin/moderator users can delete any attachment
        - Original uploader information is preserved in audit trail

        💾 **STORAGE MANAGEMENT:**
        - Physical file deletion is optional and separate from logical deletion
        - Backup creation helps prevent accidental data loss
        - Storage space tracking for cleanup operations
        - Checksum verification for data integrity

        🔔 **NOTIFICATIONS:**
        - Task watchers and assignees can be notified
        - Notification includes attachment details and deletion reason
        - Configurable notification settings per deletion
      `,
    }), (0, swagger_1.ApiParam)({
        name: 'taskId',
        description: 'UUID of the task containing the attachment',
        type: 'string',
        format: 'uuid',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }), (0, swagger_1.ApiParam)({
        name: 'attachmentId',
        description: 'UUID of the attachment to delete',
        type: 'string',
        format: 'uuid',
        example: 'att-456e7890-e89b-12d3-a456-426614174000',
    }), (0, swagger_1.ApiBody)({
        type: delete_task_attachment_request_dto_1.DeleteTaskAttachmentRequestDto,
        description: 'Attachment deletion configuration',
        examples: {
            softDelete: {
                summary: 'Soft delete attachment',
                description: 'Mark attachment as deleted but keep file recoverable',
                value: {
                    deleteMode: delete_task_attachment_request_dto_1.AttachmentDeleteMode.SOFT_DELETE,
                    deletedBy: 'user-123',
                    deleteReason: 'File contains outdated information',
                    deletePhysicalFile: false,
                    createBackup: true,
                    notifyWatchers: true,
                },
            },
            moveToTrash: {
                summary: 'Move attachment to trash',
                description: 'Move attachment to trash with physical file handling',
                value: {
                    deleteMode: delete_task_attachment_request_dto_1.AttachmentDeleteMode.MOVE_TO_TRASH,
                    deletedBy: 'user-456',
                    deleteReason: 'Duplicate file uploaded',
                    deletePhysicalFile: true,
                    createBackup: true,
                    notifyWatchers: false,
                },
            },
            hardDelete: {
                summary: 'Permanently delete attachment',
                description: 'Permanently remove attachment and file',
                value: {
                    deleteMode: delete_task_attachment_request_dto_1.AttachmentDeleteMode.HARD_DELETE,
                    deletedBy: 'admin-789',
                    deleteReason: 'Security policy violation',
                    deletePhysicalFile: true,
                    createBackup: false,
                    notifyWatchers: true,
                },
            },
        },
    }), (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Attachment successfully deleted',
        type: delete_task_attachment_response_dto_1.DeleteTaskAttachmentResponseDto,
        example: {
            taskId: '123e4567-e89b-12d3-a456-426614174000',
            attachmentId: 'att-456e7890-e89b-12d3-a456-426614174000',
            fileName: 'requirements-document.pdf',
            mimeType: 'application/pdf',
            fileSize: 2048576,
            deleteMode: delete_task_attachment_request_dto_1.AttachmentDeleteMode.SOFT_DELETE,
            deletedBy: 'user-123',
            deletedAt: '2024-01-15T10:30:00.000Z',
            deleteReason: 'File contains outdated information',
            originalUploadDate: '2024-01-10T08:15:00.000Z',
            originalUploader: 'user-789',
            physicalFileDeleted: false,
            backupCreated: true,
            backupPath: '/backups/attachments/att-456_2024-01-15_requirements-document.pdf',
            storageSpaceFreed: 0,
            notifiedWatchers: ['user-456', 'user-101'],
            success: true,
            canBeRestored: true,
            remainingAttachmentsCount: 3,
            fileChecksum: 'sha256:a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
            historyLogId: 'hist-789',
        },
    }), (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid deletion request',
        example: {
            statusCode: 400,
            message: [
                'deleteMode must be one of: SOFT_DELETE, HARD_DELETE, MOVE_TO_TRASH',
                'deletedBy must be a valid user ID',
            ],
            error: 'Bad Request',
        },
    }), (0, swagger_1.ApiNotFoundResponse)({
        description: 'Task or attachment not found',
        example: {
            statusCode: 404,
            message: 'Attachment with ID att-456e7890-e89b-12d3-a456-426614174000 not found in task 123e4567-e89b-12d3-a456-426614174000',
            error: 'Not Found',
        },
    }), (0, swagger_1.ApiForbiddenResponse)({
        description: 'Insufficient permissions to delete attachment',
        example: {
            statusCode: 403,
            message: 'You do not have permission to delete this attachment',
            error: 'Forbidden',
        },
    }), (0, swagger_1.ApiInternalServerErrorResponse)({
        description: 'Internal server error during deletion',
        example: {
            statusCode: 500,
            message: 'Failed to delete attachment due to storage system error',
            error: 'Internal Server Error',
        },
    }));
}
//# sourceMappingURL=delete-task-attachment.openapi.decorator.js.map