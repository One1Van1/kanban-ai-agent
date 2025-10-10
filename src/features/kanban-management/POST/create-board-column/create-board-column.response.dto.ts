import { ApiProperty } from '@nestjs/swagger';
import { ColumnType } from './create-board-column.request.dto';

export interface BoardColumnMetadata {
  boardId: string;
  totalColumns: number;
  columnInsertedAt: number;
  adjacentColumns: {
    before?: string;
    after?: string;
  };
}

export class CreateBoardColumnResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the created column',
    example: 'col-a8f5f167-aa89-4f26-a2b1-2b5e4b9b2c8a',
  })
  columnId: string;

  @ApiProperty({
    description: 'Board ID where column was created',
    example: 'board-001',
  })
  boardId: string;

  @ApiProperty({
    description: 'Column name',
    example: 'Ready for Testing',
  })
  name: string;

  @ApiProperty({
    enum: ColumnType,
    enumName: 'ColumnType',
    example: ColumnType.CUSTOM,
    description: 'Type of column',
  })
  type: ColumnType;

  @ApiProperty({
    description: 'Position index in board (0-based)',
    example: 2,
  })
  position: number;

  @ApiProperty({
    description: 'Column description',
    example: 'Tasks ready for QA testing',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Column color code',
    example: '#4CAF50',
    required: false,
  })
  color?: string;

  @ApiProperty({
    description: 'Maximum number of tasks allowed in column (WIP limit)',
    example: 5,
    required: false,
  })
  wipLimit?: number;

  @ApiProperty({
    description: 'User who created the column',
    example: 'agent-001',
  })
  createdBy: string;

  @ApiProperty({
    description: 'Column creation timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Whether column creation was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Total number of columns in board after creation',
    example: 5,
  })
  totalColumnsInBoard: number;

  @ApiProperty({
    description: 'Adjacent column information',
    example: {
      before: 'In Progress',
      after: 'Done',
    },
    required: false,
  })
  adjacentColumns?: {
    before?: string;
    after?: string;
  };

  @ApiProperty({
    description: 'History log ID for this column creation',
    example: 'b9f6f267-bb90-5f37-b3c2-3c6e5c0c3d9b',
  })
  historyLogId: string;
}
