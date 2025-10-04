import { ApiProperty } from '@nestjs/swagger';

export class CreateAgentResponseDto {
  @ApiProperty({ description: 'Success status' })
  success: boolean;

  @ApiProperty({ description: 'Agent ID' })
  agentId: string;

  @ApiProperty({ description: 'Agent name' })
  name: string;

  @ApiProperty({ description: 'Response message' })
  message: string;

  @ApiProperty({ description: 'Agent configuration' })
  agent: {
    id: string;
    name: string;
    description?: string;
    instructions: string;
    model: string;
    temperature: number;
    maxTokens: number;
    isActive: boolean;
    createdAt: string;
  };
}
