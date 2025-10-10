import { IsArray, IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum LabelOperation {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
  REPLACE = 'REPLACE',
}

export class UpdateTaskLabelsRequestDto {
  @ApiProperty({
    description: 'Operation to perform on labels',
    enum: LabelOperation,
    enumName: 'LabelOperation',
    example: LabelOperation.ADD,
  })
  @IsEnum(LabelOperation)
  operation: LabelOperation;

  @ApiProperty({
    description: 'Array of label names to apply',
    type: [String],
    example: ['bug', 'high-priority', 'backend'],
  })
  @IsArray()
  @IsString({ each: true })
  labels: string[];

  @ApiPropertyOptional({
    description: 'User performing the label update',
    example: 'user-123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsOptional()
  updatedBy?: string;

  @ApiPropertyOptional({
    description: 'Reason for label update',
    example: 'Added priority labels after triage',
  })
  @IsString()
  @IsOptional()
  updateReason?: string;
}
