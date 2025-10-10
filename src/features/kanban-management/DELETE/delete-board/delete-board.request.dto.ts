import {
  IsEnum,
  IsOptional,
  IsString,
  IsBoolean,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum BoardDeleteMode {
  SOFT_DELETE = 'SOFT_DELETE',
  HARD_DELETE = 'HARD_DELETE',
  ARCHIVE = 'ARCHIVE',
  EXPORT_AND_DELETE = 'EXPORT_AND_DELETE',
}

export class DeleteBoardRequestDto {
  @ApiProperty({
    description: 'Mode of board deletion',
    enum: BoardDeleteMode,
    enumName: 'BoardDeleteMode',
    example: BoardDeleteMode.SOFT_DELETE,
  })
  @IsEnum(BoardDeleteMode)
  @IsOptional()
  deleteMode?: BoardDeleteMode = BoardDeleteMode.SOFT_DELETE;

  @ApiProperty({
    description: 'UUID of the user who is deleting the board',
    example: 'user-123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  deletedBy: string;

  @ApiPropertyOptional({
    description: 'Reason for deleting the board',
    example: 'Project completed, board no longer needed',
  })
  @IsString()
  @IsOptional()
  deleteReason?: string;

  @ApiPropertyOptional({
    description: 'Whether to force delete even if board has active tasks',
    default: false,
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  forceDelete?: boolean = false;

  @ApiPropertyOptional({
    description: 'Whether to notify board members about deletion',
    default: true,
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  notifyMembers?: boolean = true;

  @ApiPropertyOptional({
    description:
      'Target board ID for moving tasks when using EXPORT_AND_DELETE mode',
    example: '456e7890-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsOptional()
  targetBoardId?: string;

  @ApiPropertyOptional({
    description: 'Whether to backup board data before deletion',
    default: true,
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  createBackup?: boolean = true;

  @ApiPropertyOptional({
    description: 'Whether to delete associated files and attachments',
    default: false,
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  deleteFiles?: boolean = false;
}
