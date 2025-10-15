import { ApiProperty } from '@nestjs/swagger';

export interface AgentInfo {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface ColumnInstruction {
  id: string;
  agentId: string;
  boardId: string;
  columnId: string;
  columnName: string;
  instructions: string;
  isActive: boolean;
}

export class DeployToAgentResponseDto {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Flow successfully deployed to agent',
  })
  message: string;

  @ApiProperty({
    description: 'ID of the flow that was deployed',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  flowId: string;

  @ApiProperty({
    description: 'ID of the created agent',
    example: 'a47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  agentId: string;

  @ApiProperty({
    description: 'Information about the created agent',
  })
  createdAgent: AgentInfo;

  @ApiProperty({
    description: 'Column instructions created for the agent',
    type: [Object],
  })
  createdInstructions: ColumnInstruction[];

  constructor(data: Partial<DeployToAgentResponseDto>) {
    Object.assign(this, data);
  }
}
