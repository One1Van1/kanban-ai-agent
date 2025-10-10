import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsEnum,
} from 'class-validator';

export enum ColumnType {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  IN_REVIEW = 'in_review',
  DONE = 'done',
  CUSTOM = 'custom',
}

export class CreateBoardColumnRequestDto {
  @ApiProperty({
    description: 'Board ID to add column to',
    example: 'board-001',
  })
  @IsString()
  boardId: string;

  @ApiProperty({
    description: 'Column name',
    example: 'Ready for Testing',
  })
  @IsString()
  name: string;

  @ApiProperty({
    enum: ColumnType,
    enumName: 'ColumnType',
    example: ColumnType.CUSTOM,
    description: 'Type of column',
  })
  @IsEnum(ColumnType)
  type: ColumnType;

  @ApiProperty({
    description: 'Position index in board (0-based)',
    example: 2,
    minimum: 0,
    maximum: 50,
  })
  @IsNumber()
  @Min(0)
  @Max(50)
  position: number;

  @ApiProperty({
    description: 'Column description',
    example: 'Tasks ready for QA testing',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Column color code',
    example: '#4CAF50',
    required: false,
  })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({
    description: 'Maximum number of tasks allowed in column (WIP limit)',
    example: 5,
    minimum: 1,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  wipLimit?: number;

  @ApiProperty({
    description: 'User creating the column',
    example: 'agent-001',
  })
  @IsString()
  createdBy: string;
}
