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

export class UpdateBoardColumnRequestDto {
  @ApiProperty({
    description: 'Updated column name',
    example: 'Ready for QA Testing',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    enum: ColumnType,
    enumName: 'ColumnType',
    example: ColumnType.CUSTOM,
    description: 'Updated column type',
    required: false,
  })
  @IsOptional()
  @IsEnum(ColumnType)
  type?: ColumnType;

  @ApiProperty({
    description: 'Updated position index in board (0-based)',
    example: 3,
    minimum: 0,
    maximum: 50,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(50)
  position?: number;

  @ApiProperty({
    description: 'Updated column description',
    example: 'Tasks that are ready for quality assurance testing',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Updated column color code',
    example: '#2196F3',
    required: false,
  })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({
    description: 'Updated WIP (Work In Progress) limit',
    example: 8,
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
    description: 'Whether column is active',
    example: true,
    required: false,
  })
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: 'User performing the update',
    example: 'agent-001',
  })
  @IsString()
  updatedBy: string;

  @ApiProperty({
    description: 'Comment about the column update',
    example: 'Updated WIP limit to improve flow efficiency',
    required: false,
  })
  @IsOptional()
  @IsString()
  updateComment?: string;
}
