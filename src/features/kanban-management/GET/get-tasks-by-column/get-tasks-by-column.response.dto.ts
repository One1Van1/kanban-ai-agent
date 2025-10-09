import { ApiProperty } from '@nestjs/swagger';
import { TaskHistory } from '../../../../entities/task-history.entity';
import { GetTasksByColumnQueryDto } from './get-tasks-by-column.query.dto';

export class ColumnTaskDto {
  @ApiProperty({ example: 'TASK-123', description: 'Task ID' })
  taskId: string;

  @ApiProperty({ example: 'TASK-123', description: 'Task key' })
  taskKey: string;

  @ApiProperty({ example: 'Fix login bug', description: 'Task title' })
  taskTitle: string;

  @ApiProperty({ example: 'completed', description: 'Task status' })
  status: string;

  @ApiProperty({ example: 'In Progress', description: 'Current column' })
  currentColumn: string;

  @ApiProperty({
    example: '2024-10-09T12:00:00Z',
    description: 'Last update timestamp',
  })
  lastUpdated: Date;

  @ApiProperty({
    example: 'status_changed',
    description: 'Last action performed',
  })
  lastAction: string;

  constructor(taskHistory: TaskHistory) {
    this.taskId = taskHistory.taskId;
    this.taskKey = taskHistory.taskKey;
    this.taskTitle = taskHistory.taskTitle;
    this.status = taskHistory.status;
    this.currentColumn = taskHistory.toColumn || taskHistory.fromColumn || '';
    this.lastUpdated = taskHistory.createdAt;
    this.lastAction = taskHistory.action;
  }
}

export class GetTasksByColumnResponseDto {
  @ApiProperty({
    type: [ColumnTaskDto],
    description: 'List of tasks in the column',
  })
  tasks: ColumnTaskDto[];

  @ApiProperty({ example: 'In Progress', description: 'Column name' })
  column: string;

  @ApiProperty({ example: 25, description: 'Total number of tasks in column' })
  total: number;

  @ApiProperty({ example: 10, description: 'Number of tasks returned' })
  limit: number;

  @ApiProperty({ example: 0, description: 'Number of tasks skipped' })
  offset: number;

  @ApiProperty({
    example: true,
    description: 'Whether there are more tasks available',
  })
  hasMore: boolean;

  constructor(
    taskHistories: TaskHistory[],
    total: number,
    column: string,
    query: GetTasksByColumnQueryDto,
  ) {
    this.tasks = taskHistories.map((th) => new ColumnTaskDto(th));
    this.column = column;
    this.total = total;
    this.limit = query.limit || 10;
    this.offset = query.offset || 0;
    this.hasMore = this.offset + this.limit < total;
  }
}
