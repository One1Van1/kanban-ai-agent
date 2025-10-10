import { ApiProperty } from '@nestjs/swagger';
import { TaskHistory } from 'kan-back/src/entities/task-history.entity';

export class GetTaskHistoryResponseDto {
  @ApiProperty({ example: 'TASK-123', description: 'ID of the task' })
  taskId: string;

  @ApiProperty({
    example: 3,
    description: 'Number of history records returned',
  })
  count: number;

  @ApiProperty({
    type: 'array',
    description: 'Task history records for the task',
    example: [
      {
        id: 'history-uuid',
        agentId: 'agent-uuid',
        taskId: 'TASK-123',
        taskKey: 'PROJ-123',
        taskTitle: 'Sample task',
        action: 'status_changed',
        fromStatus: 'To Do',
        toStatus: 'In Progress',
        status: 'completed',
        createdAt: '2024-01-01T00:00:00.000Z',
      },
    ],
  })
  items: TaskHistory[];

  @ApiProperty({ example: true, description: 'Success status' })
  success: boolean;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Response timestamp',
  })
  timestamp: string;

  constructor(taskId: string, items: TaskHistory[]) {
    this.taskId = taskId;
    this.count = items.length;
    this.items = items;
    this.success = true;
    this.timestamp = new Date().toISOString();
  }
}
