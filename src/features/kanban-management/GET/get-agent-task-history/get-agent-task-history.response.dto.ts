import { ApiProperty } from '@nestjs/swagger';
import { TaskHistory } from 'src/entities/task-history.entity';

export class GetAgentTaskHistoryResponseDto {
  @ApiProperty({ example: 'agent-uuid', description: 'ID of the agent' })
  agentId: string;

  @ApiProperty({
    example: 25,
    description: 'Number of history records returned',
  })
  count: number;

  @ApiProperty({
    type: 'array',
    description: 'Task history records for the agent',
    example: [
      {
        id: 'history-uuid',
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

  constructor(agentId: string, items: TaskHistory[]) {
    this.agentId = agentId;
    this.count = items.length;
    this.items = items;
    this.success = true;
    this.timestamp = new Date().toISOString();
  }
}
