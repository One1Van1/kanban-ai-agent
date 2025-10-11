import { ApiProperty } from '@nestjs/swagger';
import { BoardType } from '../../../types/board-integration.interface';

export class AgentInstructionDto {
  @ApiProperty({
    description: 'Instruction unique identifier',
    example: 'uuid-instruction-id',
  })
  id: string;

  @ApiProperty({
    description: 'Column identifier',
    example: 'COLUMN_TODO',
  })
  columnId: string;

  @ApiProperty({
    description: 'Column name',
    example: 'To Do',
  })
  columnName: string;

  @ApiProperty({
    description: 'Instruction text',
    example: 'Analyze task requirements and add estimates',
  })
  instruction: string;

  @ApiProperty({
    description: 'Trigger event',
    example: 'on_enter',
  })
  triggerEvent: string;

  @ApiProperty({
    description: 'Execution conditions',
    example: {},
    required: false,
  })
  conditions?: Record<string, any>;

  @ApiProperty({
    description: 'Actions to perform',
    example: {},
    required: false,
  })
  actions?: Record<string, any>;
}

export class BoardIntegrationDto {
  @ApiProperty({
    description: 'Integration unique identifier',
    example: 'uuid-integration-id',
  })
  id: string;

  @ApiProperty({
    description: 'Board type',
    enum: BoardType,
    enumName: 'BoardType',
    example: BoardType.JIRA,
  })
  boardType: BoardType;

  @ApiProperty({
    description: 'Integration name',
    example: 'Main Project Board',
  })
  name: string;

  @ApiProperty({
    description: 'Integration description',
    example: 'Integration with our main Jira project',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Whether integration is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Last synchronization timestamp',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  lastSyncAt?: Date;
}

export class GetAgentByIdResponseDto {
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
    description: 'Agent configuration',
    example: {},
    required: false,
  })
  config?: Record<string, any>;

  @ApiProperty({
    description: 'Board configuration',
    example: {},
    required: false,
  })
  boardConfig?: Record<string, any>;

  @ApiProperty({
    description: 'Context sources configuration',
    example: {},
    required: false,
  })
  contextSources?: Record<string, any>;

  @ApiProperty({
    description: 'Notification settings',
    example: {},
    required: false,
  })
  notificationSettings?: Record<string, any>;

  @ApiProperty({
    description: 'Agent creator identifier',
    example: 'user-id',
    required: false,
  })
  createdBy?: string;

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

  @ApiProperty({
    description: 'Agent instructions',
    type: [AgentInstructionDto],
  })
  instructions: AgentInstructionDto[];

  @ApiProperty({
    description: 'Board integrations',
    type: [BoardIntegrationDto],
  })
  boardIntegrations: BoardIntegrationDto[];

  constructor(agent: any) {
    this.id = agent.id;
    this.name = agent.name;
    this.description = agent.description;
    this.status = agent.status;
    this.boardType = agent.boardType;
    this.config = agent.config;
    this.boardConfig = agent.boardConfig;
    this.contextSources = agent.contextSources;
    this.notificationSettings = agent.notificationSettings;
    this.createdBy = agent.createdBy;
    this.createdAt = agent.createdAt;
    this.updatedAt = agent.updatedAt;
    this.instructions = agent.instructions || [];
    this.boardIntegrations = agent.boardIntegrations || [];
  }
}
