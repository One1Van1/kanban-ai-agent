import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  storageSpaceFreed: number; // in bytes
}

export class DeleteTaskAttachmentResponseDto {
  @ApiProperty({
    description: 'UUID of the task containing the attachment',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  taskId: string;

  @ApiProperty({
    description: 'UUID of the deleted attachment',
    example: 'att-456e7890-e89b-12d3-a456-426614174000',
  })
  attachmentId: string;

  @ApiProperty({
    description: 'Name of the deleted attachment file',
    example: 'requirements-document.pdf',
  })
  fileName: string;

  @ApiProperty({
    description: 'MIME type of the deleted attachment',
    example: 'application/pdf',
  })
  mimeType: string;

  @ApiProperty({
    description: 'Size of the deleted file in bytes',
    example: 2048576,
  })
  fileSize: number;

  @ApiProperty({
    description: 'Deletion mode used',
    enum: AttachmentDeleteMode,
    enumName: 'AttachmentDeleteMode',
    example: AttachmentDeleteMode.SOFT_DELETE,
  })
  deleteMode: AttachmentDeleteMode;

  @ApiProperty({
    description: 'UUID of the user who deleted the attachment',
    example: 'user-123e4567-e89b-12d3-a456-426614174000',
  })
  deletedBy: string;

  @ApiProperty({
    description: 'Timestamp when the attachment was deleted',
    example: '2024-01-15T10:30:00.000Z',
  })
  deletedAt: Date;

  @ApiPropertyOptional({
    description: 'Reason for attachment deletion',
    example: 'File contains outdated information',
  })
  deleteReason?: string;

  @ApiProperty({
    description: 'Original upload timestamp of the attachment',
    example: '2024-01-10T08:15:00.000Z',
  })
  originalUploadDate: Date;

  @ApiProperty({
    description: 'UUID of the user who originally uploaded the attachment',
    example: 'user-789e4567-e89b-12d3-a456-426614174000',
  })
  originalUploader: string;

  @ApiProperty({
    description: 'Whether the physical file was deleted from storage',
    example: false,
  })
  physicalFileDeleted: boolean;

  @ApiProperty({
    description: 'Whether a backup was created before deletion',
    example: true,
  })
  backupCreated: boolean;

  @ApiPropertyOptional({
    description: 'Path to the backup file if created',
    example: '/backups/attachments/att-456_2024-01-15.pdf',
  })
  backupPath?: string;

  @ApiProperty({
    description: 'Amount of storage space freed in bytes',
    example: 2048576,
  })
  storageSpaceFreed: number;

  @ApiProperty({
    description: 'List of users who were notified about the deletion',
    type: 'array',
    items: { type: 'string' },
    example: ['user-456', 'user-789'],
  })
  notifiedWatchers: string[];

  @ApiProperty({
    description: 'Whether the operation was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Whether the attachment can be restored',
    example: true,
  })
  canBeRestored: boolean;

  @ApiProperty({
    description: 'Number of remaining attachments on the task',
    example: 3,
  })
  remainingAttachmentsCount: number;

  @ApiPropertyOptional({
    description: 'File checksum for verification purposes',
    example:
      'sha256:a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
  })
  fileChecksum?: string;

  @ApiProperty({
    description: 'History log entry ID for audit trail',
    example: 'hist-789e4567-e89b-12d3-a456-426614174000',
  })
  historyLogId: string;
}
