import { AttachmentDeleteMode } from './delete-task-attachment.request.dto';
export interface AttachmentMetadata {
    fileName: string;
    fileSize: number;
    mimeType: string;
    uploadedAt: Date;
    uploadedBy: string;
    filePath: string;
    checksum?: string;
}
export interface AttachmentDeletionSummary {
    physicalFileDeleted: boolean;
    backupCreated: boolean;
    backupPath?: string;
    storageSpaceFreed: number;
}
export declare class DeleteTaskAttachmentResponseDto {
    taskId: string;
    attachmentId: string;
    fileName: string;
    mimeType: string;
    fileSize: number;
    deleteMode: AttachmentDeleteMode;
    deletedBy: string;
    deletedAt: Date;
    deleteReason?: string;
    originalUploadDate: Date;
    originalUploader: string;
    physicalFileDeleted: boolean;
    backupCreated: boolean;
    backupPath?: string;
    storageSpaceFreed: number;
    notifiedWatchers: string[];
    success: boolean;
    canBeRestored: boolean;
    remainingAttachmentsCount: number;
    fileChecksum?: string;
    historyLogId: string;
}
