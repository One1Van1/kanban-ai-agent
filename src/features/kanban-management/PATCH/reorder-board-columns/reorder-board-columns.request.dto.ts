import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ColumnOrderDto {
  @ApiProperty({
    description: 'UUID of the column',
    example: 'col-123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  columnId: string;

  @ApiProperty({
    description: 'New position index for the column (0-based)',
    example: 0,
    minimum: 0,
  })
  @IsNotEmpty()
  position: number;

  @ApiPropertyOptional({
    description: 'Column name for reference (optional)',
    example: 'To Do',
  })
  @IsString()
  @IsOptional()
  columnName?: string;
}

export class ReorderBoardColumnsRequestDto {
  @ApiProperty({
    description: 'UUID of the board to reorder columns for',
    example: 'board-123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  boardId: string;

  @ApiProperty({
    type: [ColumnOrderDto],
    description: 'Array of columns with their new positions',
    example: [
      { columnId: 'col-1', position: 0, columnName: 'Backlog' },
      { columnId: 'col-2', position: 1, columnName: 'To Do' },
      { columnId: 'col-3', position: 2, columnName: 'In Progress' },
      { columnId: 'col-4', position: 3, columnName: 'Done' },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ColumnOrderDto)
  columnOrder: ColumnOrderDto[];

  @ApiProperty({
    description: 'UUID of the user performing the reorder',
    example: 'user-123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiPropertyOptional({
    description: 'Reason for reordering columns',
    example: 'Reorganizing workflow to match new process',
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  reorderReason?: string;

  @ApiPropertyOptional({
    description: 'Whether to validate that all board columns are included',
    example: true,
    default: true,
  })
  @IsOptional()
  validateComplete?: boolean = true;
}
