import { ApiProperty } from '@nestjs/swagger';
import { TaskHistory } from '../../../../entities/task-history.entity';

export class TaskDetailsDto {
  @ApiProperty({ example: 'TASK-123', description: 'Task ID' })
  taskId: string;

  @ApiProperty({ example: 'TASK-123', description: 'Task key' })
  taskKey: string;

  @ApiProperty({ example: 'Fix login bug', description: 'Task title' })
  taskTitle: string;

  @ApiProperty({ example: 'In Progress', description: 'Current task status' })
  status: string;

  @ApiProperty({ example: 'To Do', description: 'Current column' })
  toColumn: string;

  @ApiProperty({ example: 'Done', description: 'Previous column' })
  fromColumn: string;

  @ApiProperty({ example: 'In Progress', description: 'Current status' })
  toStatus: string;

  @ApiProperty({ example: 'To Do', description: 'Previous status' })
  fromStatus: string;

  @ApiProperty({
    example: '2024-10-09T12:00:00Z',
    description: 'Task creation date',
  })
  createdAt: Date;

  @ApiProperty({ example: {}, description: 'Additional context data' })
  context: Record<string, any>;

  constructor(taskHistory: TaskHistory) {
    this.taskId = taskHistory.taskId;
    this.taskKey = taskHistory.taskKey;
    this.taskTitle = taskHistory.taskTitle;
    this.status = taskHistory.status;
    this.toColumn = taskHistory.toColumn || '';
    this.fromColumn = taskHistory.fromColumn || '';
    this.toStatus = taskHistory.toStatus || '';
    this.fromStatus = taskHistory.fromStatus || '';
    this.createdAt = taskHistory.createdAt;
    this.context = taskHistory.context || {};
  }
}

export class TaskHistoryItemDto {
  @ApiProperty({ example: 'uuid-123', description: 'History record ID' })
  id: string;

  @ApiProperty({ example: 'TASK-123', description: 'Task ID' })
  taskId: string;

  @ApiProperty({ example: 'TASK-123', description: 'Task key' })
  taskKey: string;

  @ApiProperty({ example: 'Fix login bug', description: 'Task title' })
  taskTitle: string;

  @ApiProperty({ example: 'status_changed', description: 'Action type' })
  action: string;

  @ApiProperty({ example: 'In Progress', description: 'Target status' })
  toStatus: string;

  @ApiProperty({ example: 'To Do', description: 'Source status' })
  fromStatus: string;

  @ApiProperty({
    example: '2024-10-09T12:00:00Z',
    description: 'Change timestamp',
  })
  createdAt: Date;

  constructor(taskHistory: TaskHistory) {
    this.id = taskHistory.id;
    this.taskId = taskHistory.taskId;
    this.taskKey = taskHistory.taskKey;
    this.taskTitle = taskHistory.taskTitle;
    this.action = taskHistory.action;
    this.toStatus = taskHistory.toStatus || '';
    this.fromStatus = taskHistory.fromStatus || '';
    this.createdAt = taskHistory.createdAt;
  }
}

export class GetTaskDetailsResponseDto {
  @ApiProperty({ type: TaskDetailsDto, description: 'Current task details' })
  task: TaskDetailsDto;

  @ApiProperty({
    type: [TaskHistoryItemDto],
    description: 'Recent task history',
  })
  history: TaskHistoryItemDto[];

  @ApiProperty({ example: 10, description: 'Total history records count' })
  historyCount: number;

  constructor(latestTask: TaskHistory, history: TaskHistory[]) {
    this.task = new TaskDetailsDto(latestTask);
    this.history = history.map((h) => new TaskHistoryItemDto(h));
    this.historyCount = history.length;
  }
}
