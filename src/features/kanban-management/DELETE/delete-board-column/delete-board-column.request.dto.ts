import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';

export enum ColumnDeleteMode {
  SOFT_DELETE = 'soft_delete',
  HARD_DELETE = 'hard_delete',
  MERGE_WITH_ANOTHER = 'merge_with_another',
}

export class DeleteBoardColumnRequestDto {
  @ApiProperty({
    enum: ColumnDeleteMode,
    enumName: 'ColumnDeleteMode',
    example: ColumnDeleteMode.SOFT_DELETE,
    description: 'Type of column deletion to perform',
    required: false,
    default: ColumnDeleteMode.SOFT_DELETE,
  })
  @IsOptional()
  @IsEnum(ColumnDeleteMode)
  deleteMode?: ColumnDeleteMode = ColumnDeleteMode.SOFT_DELETE;

  @ApiProperty({
    description: 'User performing the column deletion',
    example: 'agent-001',
  })
  @IsString()
  deletedBy: string;

  @ApiProperty({
    description: 'Reason for deleting the column',
    example: 'Column is redundant after workflow optimization',
    required: false,
  })
  @IsOptional()
  @IsString()
  deleteReason?: string;

  @ApiProperty({
    description:
      'Target column ID for merging tasks (required if deleteMode is merge_with_another)',
    example: 'col-b8f5f167-aa89-4f26-a2b1-2b5e4b9b2c8b',
    required: false,
  })
  @IsOptional()
  @IsString()
  targetColumnId?: string;

  @ApiProperty({
    description: 'Whether to force delete even if column contains tasks',
    example: false,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  forceDelete?: boolean = false;

  @ApiProperty({
    description: 'Whether to notify users whose tasks are affected',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  notifyUsers?: boolean = true;
}
