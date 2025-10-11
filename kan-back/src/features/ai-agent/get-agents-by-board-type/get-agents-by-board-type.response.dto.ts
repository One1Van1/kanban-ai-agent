import { ApiProperty } from '@nestjs/swagger';
import { BoardType } from '../../../types/board-integration.interface';

export class AgentSummaryDto {
  @ApiProperty({
    description: 'Agent unique identifier',
    example: 'uuid-agent-id',
  })
  id: string;

  @ApiProperty({
    description: 'Agent name',
    example: 'Task Analyzer Bot',
  })
  name: string;

  @ApiProperty({
    description: 'Agent description',
    example: 'Analyzes tasks and provides recommendations',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Agent status',
    example: 'active',
    enum: ['active', 'inactive', 'paused'],
  })
  status: string;

  @ApiProperty({
    description: 'Board type associated with agent',
    enum: BoardType,
    enumName: 'BoardType',
    example: BoardType.JIRA,
    required: false,
  })
  boardType?: BoardType;

  @ApiProperty({
    description: 'Agent creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Agent last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}

export class GetAgentsByBoardTypeResponseDto {
  @ApiProperty({
    description: 'List of agents for the specified board type',
    type: [AgentSummaryDto],
  })
  agents: AgentSummaryDto[];

  @ApiProperty({
    description: 'Board type filter applied',
    enum: BoardType,
    enumName: 'BoardType',
    example: BoardType.JIRA,
  })
  boardType: BoardType;

  @ApiProperty({
    description: 'Total number of agents for this board type',
    example: 5,
  })
  total: number;

  constructor(agents: AgentSummaryDto[], boardType: BoardType, total: number) {
    this.agents = agents;
    this.boardType = boardType;
    this.total = total;
  }
}
