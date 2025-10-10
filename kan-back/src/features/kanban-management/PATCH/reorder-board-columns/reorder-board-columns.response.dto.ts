import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReorderedColumnDto {
  @ApiProperty({
    description: 'UUID of the column',
    example: 'col-123e4567-e89b-12d3-a456-426614174000',
  })
  columnId: string;

  @ApiProperty({
    description: 'Name of the column',
    example: 'To Do',
  })
  columnName: string;

  @ApiProperty({
    description: 'Previous position of the column',
    example: 2,
  })
  previousPosition: number;

  @ApiProperty({
    description: 'New position of the column',
    example: 0,
  })
  newPosition: number;

  @ApiProperty({
    description: 'Whether the position actually changed',
    example: true,
  })
  positionChanged: boolean;
}

export class BoardLayoutDto {
  @ApiProperty({
    description: 'UUID of the board',
    example: 'board-123e4567-e89b-12d3-a456-426614174000',
  })
  boardId: string;

  @ApiProperty({
    description: 'Name of the board',
    example: 'Project Kanban Board',
  })
  boardName: string;

  @ApiProperty({
    description: 'Total number of columns',
    example: 4,
  })
  totalColumns: number;

  @ApiProperty({
    type: [ReorderedColumnDto],
    description: 'Array of all columns in their new order',
  })
  columns: ReorderedColumnDto[];
}

export class ReorderBoardColumnsResponseDto {
  @ApiProperty({
    description: 'UUID of the board that was reordered',
    example: 'board-123e4567-e89b-12d3-a456-426614174000',
  })
  boardId: string;

  @ApiProperty({
    description: 'UUID of the user who performed the reorder',
    example: 'user-123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({
    description: 'Display name of the user who reordered',
    example: 'John Doe',
  })
  userName: string;

  @ApiProperty({
    description: 'Timestamp when the reorder was completed',
    example: '2024-01-15T10:30:00.000Z',
  })
  reorderedAt: Date;

  @ApiPropertyOptional({
    description: 'Reason provided for the reorder',
    example: 'Reorganizing workflow to match new process',
  })
  reorderReason?: string;

  @ApiProperty({
    description: 'Number of columns that actually changed position',
    example: 2,
  })
  columnsChanged: number;

  @ApiProperty({
    type: BoardLayoutDto,
    description: 'Complete board layout after reordering',
  })
  boardLayout: BoardLayoutDto;

  @ApiProperty({
    description: 'Whether the operation was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'History log entry ID for audit trail',
    example: 'hist-789e4567-e89b-12d3-a456-426614174000',
  })
  historyLogId: string;

  @ApiProperty({
    description: 'Summary of changes made',
    example:
      'Reordered 4 columns: moved "To Do" from position 2 to 0, "In Progress" from position 0 to 1',
  })
  changesSummary: string;

  @ApiProperty({
    description: 'Previous column order (positions before reorder)',
    example: [2, 0, 1, 3],
  })
  previousOrder: number[];

  @ApiProperty({
    description: 'New column order (positions after reorder)',
    example: [0, 1, 2, 3],
  })
  newOrder: number[];
}
