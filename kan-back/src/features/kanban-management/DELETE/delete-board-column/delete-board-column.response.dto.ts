import { ApiProperty } from '@nestjs/swagger';
import { ColumnDeleteMode } from './delete-board-column.request.dto';

export interface ColumnDeletionMetadata {
  columnName: string;
  columnType: string;
  position: number;
  boardId: string;
  tasksInColumn: number;
  tasksRelocated: number;
  targetColumnId?: string;
  targetColumnName?: string;
  positionAdjustments: {
    columnId: string;
    oldPosition: number;
    newPosition: number;
  }[];
}

export class DeleteBoardColumnResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the deleted column',
    example: 'col-a8f5f167-aa89-4f26-a2b1-2b5e4b9b2c8a',
  })
  columnId: string;

  @ApiProperty({
    description: 'Board ID where column was deleted',
    example: 'board-001',
  })
  boardId: string;

  @ApiProperty({
    description: 'Name of the deleted column',
    example: 'Testing',
  })
  columnName: string;

  @ApiProperty({
    enum: ColumnDeleteMode,
    enumName: 'ColumnDeleteMode',
    example: ColumnDeleteMode.SOFT_DELETE,
    description: 'Type of deletion that was performed',
  })
  deleteMode: ColumnDeleteMode;

  @ApiProperty({
    description: 'User who performed the deletion',
    example: 'agent-001',
  })
  deletedBy: string;

  @ApiProperty({
    description: 'Timestamp when column was deleted',
    example: '2024-01-15T10:30:00Z',
  })
  deletedAt: Date;

  @ApiProperty({
    description: 'Reason for deleting the column',
    example: 'Column is redundant after workflow optimization',
    required: false,
  })
  deleteReason?: string;

  @ApiProperty({
    description: 'Position of deleted column in board',
    example: 2,
  })
  originalPosition: number;

  @ApiProperty({
    description: 'Number of tasks that were in the column',
    example: 5,
  })
  tasksInColumn: number;

  @ApiProperty({
    description: 'Number of tasks that were relocated to other columns',
    example: 5,
  })
  tasksRelocated: number;

  @ApiProperty({
    description: 'Target column where tasks were moved (for merge operations)',
    example: 'col-b8f5f167-aa89-4f26-a2b1-2b5e4b9b2c8b',
    required: false,
  })
  targetColumnId?: string;

  @ApiProperty({
    description: 'Name of target column where tasks were moved',
    example: 'Done',
    required: false,
  })
  targetColumnName?: string;

  @ApiProperty({
    description: 'Columns that had their positions adjusted',
    type: [Object],
    example: [
      { columnId: 'col-c', oldPosition: 3, newPosition: 2 },
      { columnId: 'col-d', oldPosition: 4, newPosition: 3 },
    ],
  })
  positionAdjustments: {
    columnId: string;
    oldPosition: number;
    newPosition: number;
  }[];

  @ApiProperty({
    description: 'List of users who were notified about the deletion',
    example: ['agent-002', 'agent-003'],
    type: [String],
  })
  notifiedUsers: string[];

  @ApiProperty({
    description: 'Whether deletion was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Whether column can be restored (for soft deletes)',
    example: true,
  })
  canBeRestored: boolean;

  @ApiProperty({
    description: 'Total number of columns remaining in board',
    example: 4,
  })
  remainingColumnsInBoard: number;

  @ApiProperty({
    description: 'History log ID for this deletion',
    example: 'b9f6f267-bb90-5f37-b3c2-3c6e5c0c3d9b',
  })
  historyLogId: string;
}
