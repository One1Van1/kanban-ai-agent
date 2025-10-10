import { IsEnum, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum AttachmentDeleteMode {
  SOFT_DELETE = 'SOFT_DELETE',
  HARD_DELETE = 'HARD_DELETE',
  MOVE_TO_TRASH = 'MOVE_TO_TRASH',
}

export class DeleteTaskAttachmentRequestDto {
  @ApiProperty({
    description: 'Mode of attachment deletion',
    enum: AttachmentDeleteMode,
    enumName: 'AttachmentDeleteMode',
    example: AttachmentDeleteMode.SOFT_DELETE,
  })
  @IsEnum(AttachmentDeleteMode)
  @IsOptional()
  deleteMode?: AttachmentDeleteMode = AttachmentDeleteMode.SOFT_DELETE;

  @ApiProperty({
    description: 'UUID of the user who is deleting the attachment',
    example: 'user-123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  deletedBy: string;

  @ApiPropertyOptional({
    description: 'Reason for deleting the attachment',
    example: 'File contains outdated information',
  })
  @IsString()
  @IsOptional()
  deleteReason?: string;

  @ApiPropertyOptional({
    description: 'Whether to permanently delete the physical file from storage',
    default: false,
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  deletePhysicalFile?: boolean = false;

  @ApiPropertyOptional({
    description: 'Whether to create a backup of the file before deletion',
    default: true,
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  createBackup?: boolean = true;

  @ApiPropertyOptional({
    description: 'Whether to notify task watchers about attachment deletion',
    default: true,
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  notifyWatchers?: boolean = true;
}
