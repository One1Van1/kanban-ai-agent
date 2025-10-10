import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BoardDeleteMode } from './delete-board.request.dto';

export interface BoardDeletionMetadata {
  boardName: string;
  boardType: string;
  columnsCount: number;
  tasksCount: number;
  membersCount: number;
  filesCount: number;
  createdAt: Date;
  lastActivityAt: Date;
}

export interface TaskRelocation {
  taskId: string;
  taskTitle: string;
  fromBoardId: string;
  toBoardId: string;
  newColumnId: string;
  relocatedAt: Date;
}

export interface FilesDeletion {
  totalFiles: number;
  deletedFiles: number;
  failedDeletions: string[];
  totalSizeDeleted: number; // in bytes
}

export class DeleteBoardResponseDto {
  @ApiProperty({
    description: 'UUID of the deleted board',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  boardId: string;

  @ApiProperty({
    description: 'Name of the deleted board',
    example: 'Sprint Planning Board',
  })
  boardName: string;

  @ApiProperty({
    description: 'Deletion mode used',
    enum: BoardDeleteMode,
    enumName: 'BoardDeleteMode',
    example: BoardDeleteMode.SOFT_DELETE,
  })
  deleteMode: BoardDeleteMode;

  @ApiProperty({
    description: 'UUID of the user who deleted the board',
    example: 'user-123e4567-e89b-12d3-a456-426614174000',
  })
  deletedBy: string;

  @ApiProperty({
    description: 'Timestamp when the board was deleted',
    example: '2024-01-15T10:30:00.000Z',
  })
  deletedAt: Date;

  @ApiPropertyOptional({
    description: 'Reason for board deletion',
    example: 'Project completed, board no longer needed',
  })
  deleteReason?: string;

  @ApiProperty({
    description: 'Number of columns that were in the board',
    example: 5,
  })
  columnsDeleted: number;

  @ApiProperty({
    description: 'Number of tasks that were in the board',
    example: 23,
  })
  tasksInBoard: number;

  @ApiProperty({
    description: 'Number of tasks that were relocated to another board',
    example: 15,
  })
  tasksRelocated: number;

  @ApiPropertyOptional({
    description: 'Target board ID where tasks were moved',
    example: '456e7890-e89b-12d3-a456-426614174000',
  })
  targetBoardId?: string;

  @ApiPropertyOptional({
    description: 'Name of the target board where tasks were moved',
    example: 'Backlog Board',
  })
  targetBoardName?: string;

  @ApiProperty({
    description: 'List of task relocations',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        taskId: { type: 'string' },
        taskTitle: { type: 'string' },
        fromBoardId: { type: 'string' },
        toBoardId: { type: 'string' },
        newColumnId: { type: 'string' },
        relocatedAt: { type: 'string', format: 'date-time' },
      },
    },
    example: [
      {
        taskId: 'task-001',
        taskTitle: 'Implement user authentication',
        fromBoardId: '123e4567-e89b-12d3-a456-426614174000',
        toBoardId: '456e7890-e89b-12d3-a456-426614174000',
        newColumnId: 'col-backlog',
        relocatedAt: '2024-01-15T10:30:00.000Z',
      },
    ],
  })
  taskRelocations: TaskRelocation[];

  @ApiProperty({
    description: 'List of board members who were notified',
    type: 'array',
    items: { type: 'string' },
    example: ['user-456', 'user-789', 'user-101'],
  })
  notifiedMembers: string[];

  @ApiProperty({
    description: 'Whether the operation was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Whether the board can be restored',
    example: true,
  })
  canBeRestored: boolean;

  @ApiPropertyOptional({
    description: 'Backup file path if backup was created',
    example: '/backups/boards/board-123_2024-01-15.json',
  })
  backupPath?: string;

  @ApiPropertyOptional({
    description: 'Files deletion summary',
    type: 'object',
    properties: {
      totalFiles: { type: 'number' },
      deletedFiles: { type: 'number' },
      failedDeletions: { type: 'array', items: { type: 'string' } },
      totalSizeDeleted: { type: 'number' },
    },
    example: {
      totalFiles: 12,
      deletedFiles: 10,
      failedDeletions: ['file1.pdf', 'image2.png'],
      totalSizeDeleted: 2048576,
    },
  })
  filesDeletion?: FilesDeletion;

  @ApiProperty({
    description: 'History log entry ID for audit trail',
    example: 'hist-789e4567-e89b-12d3-a456-426614174000',
  })
  historyLogId: string;
}
