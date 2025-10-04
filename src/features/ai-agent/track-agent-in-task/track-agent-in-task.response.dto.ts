import { ApiProperty } from '@nestjs/swagger';

export class TrackAgentInTaskResponseDto {
  @ApiProperty({ description: 'Success status' })
  success: boolean;

  @ApiProperty({ description: 'Agent ID' })
  agentId: string;

  @ApiProperty({ description: 'Task ID being tracked' })
  taskId: string;

  @ApiProperty({ description: 'Response message' })
  message: string;

  @ApiProperty({ description: 'Tracking details' })
  tracking: {
    agentId: string;
    taskId: string;
    boardId: string;
    columnId: string;
    columnName?: string;
    isActive: boolean;
    startedAt: string;
  };

  @ApiProperty({
    description: 'Next actions that will be triggered',
    isArray: true,
  })
  nextActions: string[];
}
