import { ApiProperty } from '@nestjs/swagger';
import { TaskHistory } from '@/entities/task-history.entity';
export class TaskMovedDto {
  @ApiProperty({ example: 'PROJ-123', description: 'Task ID' })
  taskId: string;

  @ApiProperty({ example: 'PROJ-123', description: 'Task key' })
  taskKey: string;

  @ApiProperty({ example: 'Fix authentication bug', description: 'Task title' })
  taskTitle: string;

  @ApiProperty({ example: 'To Do', description: 'Previous column' })
  fromColumn: string;

  @ApiProperty({ example: 'In Progress', description: 'New column' })
  toColumn: string;

  @ApiProperty({ example: 'pending', description: 'Previous status' })
  fromStatus: string;

  @ApiProperty({ example: 'in_progress', description: 'New status' })
  toStatus: string;

  @ApiProperty({
    example: '2024-10-09T12:00:00Z',
    description: 'Move timestamp',
  })
  movedAt: Date;

  @ApiProperty({ example: 'moved', description: 'Action performed' })
  action: string;

  constructor(moveHistory: TaskHistory) {
    this.taskId = moveHistory.taskId;
    this.taskKey = moveHistory.taskKey;
    this.taskTitle = moveHistory.taskTitle;
    this.fromColumn = moveHistory.fromColumn || '';
    this.toColumn = moveHistory.toColumn || '';
    this.fromStatus = moveHistory.fromStatus || '';
    this.toStatus = moveHistory.toStatus || '';
    this.movedAt = moveHistory.createdAt;
    this.action = moveHistory.action;
  }
}

export class MoveTaskResponseDto {
  @ApiProperty({ type: TaskMovedDto, description: 'Moved task information' })
  task: TaskMovedDto;

  @ApiProperty({
    example: true,
    description: 'Whether move operation was successful',
  })
  success: boolean;

  @ApiProperty({
    example: 'Task moved successfully from "To Do" to "In Progress"',
    description: 'Success message',
  })
  message: string;

  @ApiProperty({
    example: {
      previousState: { column: 'To Do', status: 'pending' },
      moveReason: 'Starting work on this task',
    },
    description: 'Additional context about the move',
  })
  context: Record<string, any>;

  constructor(moveHistory: TaskHistory, previousState: TaskHistory) {
    this.task = new TaskMovedDto(moveHistory);
    this.success = true;
    this.message = `Task moved successfully from "${previousState.toColumn}" to "${moveHistory.toColumn}"`;
    this.context = moveHistory.context || {};
  }
}
