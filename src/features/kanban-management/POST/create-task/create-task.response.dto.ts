import { ApiProperty } from '@nestjs/swagger';
import { TaskHistory } from '../../../../entities/task-history.entity';

export class CreatedTaskDto {
  @ApiProperty({ example: 'uuid-123', description: 'Created task history ID' })
  id: string;

  @ApiProperty({ example: 'PROJ-123', description: 'Task ID' })
  taskId: string;

  @ApiProperty({ example: 'PROJ-123', description: 'Task key' })
  taskKey: string;

  @ApiProperty({
    example: 'Fix user authentication bug',
    description: 'Task title',
  })
  taskTitle: string;

  @ApiProperty({ example: 'To Do', description: 'Initial column' })
  initialColumn: string;

  @ApiProperty({ example: 'pending', description: 'Initial status' })
  initialStatus: string;

  @ApiProperty({ example: 'created', description: 'Action performed' })
  action: string;

  @ApiProperty({
    example: '2024-10-09T12:00:00Z',
    description: 'Creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({ example: {}, description: 'Task context and metadata' })
  context: Record<string, any>;

  constructor(taskHistory: TaskHistory) {
    this.id = taskHistory.id;
    this.taskId = taskHistory.taskId;
    this.taskKey = taskHistory.taskKey;
    this.taskTitle = taskHistory.taskTitle;
    this.initialColumn = taskHistory.toColumn || '';
    this.initialStatus = taskHistory.toStatus || '';
    this.action = taskHistory.action;
    this.createdAt = taskHistory.createdAt;
    this.context = taskHistory.context || {};
  }
}

export class CreateTaskResponseDto {
  @ApiProperty({
    type: CreatedTaskDto,
    description: 'Created task information',
  })
  task: CreatedTaskDto;

  @ApiProperty({
    example: true,
    description: 'Whether task creation was successful',
  })
  success: boolean;

  @ApiProperty({
    example: 'Task created successfully',
    description: 'Success message',
  })
  message: string;

  constructor(taskHistory: TaskHistory) {
    this.task = new CreatedTaskDto(taskHistory);
    this.success = true;
    this.message = 'Task created successfully';
  }
}
