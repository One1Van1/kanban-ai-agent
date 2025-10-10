import { ApiProperty } from '@nestjs/swagger';
import { ColumnType } from './update-board-column.request.dto';

export interface ColumnUpdateMetadata {
  fieldsUpdated: string[];
  previousValues: Record<string, any>;
  newValues: Record<string, any>;
  positionChanges?: {
    from: number;
    to: number;
    affectedColumns: string[];
  };
  updateReason?: string;
  updatedBy: string;
  updatedAt: Date;
}

export class UpdateBoardColumnResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the updated column',
    example: 'col-a8f5f167-aa89-4f26-a2b1-2b5e4b9b2c8a',
  })
  columnId: string;

  @ApiProperty({
    description: 'Board ID where column belongs',
    example: 'board-001',
  })
  boardId: string;

  @ApiProperty({
    description: 'Updated column name',
    example: 'Ready for QA Testing',
  })
  name: string;

  @ApiProperty({
    enum: ColumnType,
    enumName: 'ColumnType',
    example: ColumnType.CUSTOM,
    description: 'Updated column type',
  })
  type: ColumnType;

  @ApiProperty({
    description: 'Updated position index in board (0-based)',
    example: 3,
  })
  position: number;

  @ApiProperty({
    description: 'Updated column description',
    example: 'Tasks that are ready for quality assurance testing',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Updated column color code',
    example: '#2196F3',
    required: false,
  })
  color?: string;

  @ApiProperty({
    description: 'Updated WIP (Work In Progress) limit',
    example: 8,
    required: false,
  })
  wipLimit?: number;

  @ApiProperty({
    description: 'Whether column is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'User who performed the update',
    example: 'agent-001',
  })
  updatedBy: string;

  @ApiProperty({
    description: 'Timestamp when column was updated',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'List of fields that were updated',
    example: ['name', 'wipLimit', 'color'],
    type: [String],
  })
  fieldsUpdated: string[];

  @ApiProperty({
    description: 'Previous values before update',
    example: {
      name: 'Testing',
      wipLimit: 5,
      color: '#4CAF50',
    },
  })
  previousValues: Record<string, any>;

  @ApiProperty({
    description: 'Position change information if position was updated',
    required: false,
    example: {
      from: 2,
      to: 3,
      affectedColumns: ['col-1', 'col-2'],
    },
  })
  positionChanges?: {
    from: number;
    to: number;
    affectedColumns: string[];
  };

  @ApiProperty({
    description: 'Comment about the column update',
    example: 'Updated WIP limit to improve flow efficiency',
    required: false,
  })
  updateComment?: string;

  @ApiProperty({
    description: 'Whether update was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Current column version after update',
    example: 2,
  })
  version: number;

  @ApiProperty({
    description: 'Number of tasks currently in this column',
    example: 3,
  })
  currentTaskCount: number;

  @ApiProperty({
    description: 'History log ID for this update',
    example: 'b9f6f267-bb90-5f37-b3c2-3c6e5c0c3d9b',
  })
  historyLogId: string;
}
