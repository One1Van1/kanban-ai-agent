import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LabelOperation } from './update-task-labels.request.dto';

export interface LabelChange {
  labelName: string;
  operation: 'added' | 'removed';
  timestamp: Date;
}

export class UpdateTaskLabelsResponseDto {
  @ApiProperty({
    description: 'UUID of the updated task',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  taskId: string;

  @ApiProperty({
    description: 'Operation that was performed',
    enum: LabelOperation,
    enumName: 'LabelOperation',
    example: LabelOperation.ADD,
  })
  operation: LabelOperation;

  @ApiProperty({
    description: 'Current list of all labels on the task',
    type: [String],
    example: ['bug', 'high-priority', 'backend', 'in-review'],
  })
  currentLabels: string[];

  @ApiProperty({
    description: 'Labels that were added in this operation',
    type: [String],
    example: ['high-priority', 'backend'],
  })
  addedLabels: string[];

  @ApiProperty({
    description: 'Labels that were removed in this operation',
    type: [String],
    example: ['low-priority'],
  })
  removedLabels: string[];

  @ApiProperty({
    description: 'Total number of labels after update',
    example: 4,
  })
  totalLabelsCount: number;

  @ApiProperty({
    description: 'Timestamp when labels were updated',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'User who performed the update',
    example: 'user-123e4567-e89b-12d3-a456-426614174000',
  })
  updatedBy?: string;

  @ApiPropertyOptional({
    description: 'Reason for the label update',
    example: 'Added priority labels after triage',
  })
  updateReason?: string;

  @ApiProperty({
    description: 'Whether the operation was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Detailed changes made to labels',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        labelName: { type: 'string' },
        operation: { type: 'string', enum: ['added', 'removed'] },
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
    example: [
      {
        labelName: 'high-priority',
        operation: 'added',
        timestamp: '2024-01-15T10:30:00.000Z',
      },
      {
        labelName: 'low-priority',
        operation: 'removed',
        timestamp: '2024-01-15T10:30:00.000Z',
      },
    ],
  })
  labelChanges: LabelChange[];

  @ApiProperty({
    description: 'History log entry ID for audit trail',
    example: 'hist-789e4567-e89b-12d3-a456-426614174000',
  })
  historyLogId: string;
}
