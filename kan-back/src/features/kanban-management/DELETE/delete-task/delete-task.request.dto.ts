import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';

export enum DeleteMode {
  SOFT_DELETE = 'soft_delete',
  HARD_DELETE = 'hard_delete',
  ARCHIVE = 'archive',
}

export class DeleteTaskRequestDto {
  @ApiProperty({
    enum: DeleteMode,
    enumName: 'DeleteMode',
    example: DeleteMode.SOFT_DELETE,
    description: 'Type of deletion to perform',
    required: false,
    default: DeleteMode.SOFT_DELETE,
  })
  @IsOptional()
  @IsEnum(DeleteMode)
  deleteMode?: DeleteMode = DeleteMode.SOFT_DELETE;

  @ApiProperty({
    description: 'User performing the deletion',
    example: 'agent-001',
  })
  @IsString()
  deletedBy: string;

  @ApiProperty({
    description: 'Reason for deleting the task',
    example: 'Task is no longer relevant due to requirement changes',
    required: false,
  })
  @IsOptional()
  @IsString()
  deleteReason?: string;

  @ApiProperty({
    description: 'Whether to force delete even if task has dependencies',
    example: false,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  forceDelete?: boolean = false;

  @ApiProperty({
    description: 'Whether to delete related attachments and comments',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  deleteRelatedData?: boolean = true;

  @ApiProperty({
    description: 'Whether to notify watchers and assignees about deletion',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  notifyUsers?: boolean = true;
}
