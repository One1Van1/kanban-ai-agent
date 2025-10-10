import { ApiProperty } from '@nestjs/swagger';

export class AttachmentDataDto {
  @ApiProperty({
    description: 'Attachment identifier',
    example: 'file_1642248000000_abc123def',
  })
  id: string;

  @ApiProperty({
    description: 'Task ID this attachment belongs to',
    example: 'TASK-123',
  })
  taskId: string;

  @ApiProperty({
    description: 'Original file name',
    example: 'requirements.pdf',
  })
  fileName: string;

  @ApiProperty({
    description: 'File MIME type',
    example: 'application/pdf',
  })
  mimeType: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 1024000,
  })
  fileSize: number;

  @ApiProperty({
    description: 'Human-readable file size',
    example: '1000.00 KB',
  })
  fileSizeFormatted: string;

  @ApiProperty({
    description: 'File URL for viewing',
    example: '/files/tasks/TASK-123/1642248000000_requirements.pdf',
  })
  fileUrl: string;

  @ApiProperty({
    description: 'Download URL',
    example: '/files/tasks/TASK-123/1642248000000_requirements.pdf/download',
  })
  downloadUrl: string;

  @ApiProperty({
    description: 'User who uploaded the file',
    example: 'agent-001',
  })
  uploadedBy: string;

  @ApiProperty({
    description: 'Optional description of the attachment',
    example: 'Updated project requirements document',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'When the file was uploaded',
    example: '2024-01-15T10:30:00Z',
  })
  uploadedAt: Date;

  @ApiProperty({
    description: 'Whether the attachment is currently active',
    example: true,
  })
  isActive: boolean;
}

export class UploadAttachmentResponseDto {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    type: AttachmentDataDto,
    description: 'Uploaded attachment data',
  })
  data: AttachmentDataDto;

  @ApiProperty({
    description: 'Response message',
    example: 'File uploaded and attached to task successfully',
  })
  message: string;
}
