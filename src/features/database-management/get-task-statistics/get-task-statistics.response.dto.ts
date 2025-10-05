import { ApiProperty } from '@nestjs/swagger';

export interface TaskStatistics {
  total: number;
  completed: number;
  failed: number;
  pending: number;
  processing: number;
}

export class GetTaskStatisticsResponseDto {
  @ApiProperty({ example: 150, description: 'Total number of task records' })
  total: number;

  @ApiProperty({ example: 120, description: 'Number of completed tasks' })
  completed: number;

  @ApiProperty({ example: 5, description: 'Number of failed tasks' })
  failed: number;

  @ApiProperty({ example: 20, description: 'Number of pending tasks' })
  pending: number;

  @ApiProperty({
    example: 5,
    description: 'Number of tasks currently being processed',
  })
  processing: number;

  @ApiProperty({
    example: 'agent-uuid',
    description: 'Agent ID filter applied (if any)',
    required: false,
  })
  agentId?: string;

  @ApiProperty({ example: true, description: 'Success status' })
  success: boolean;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Response timestamp',
  })
  timestamp: string;

  constructor(statistics: TaskStatistics, agentId?: string) {
    this.total = statistics.total;
    this.completed = statistics.completed;
    this.failed = statistics.failed;
    this.pending = statistics.pending;
    this.processing = statistics.processing;
    this.agentId = agentId;
    this.success = true;
    this.timestamp = new Date().toISOString();
  }
}
