import { ApiProperty } from '@nestjs/swagger';

export class ConfigureAgentResponseDto {
  @ApiProperty({ description: 'Success status' })
  success: boolean;

  @ApiProperty({ description: 'Agent ID' })
  agentId: string;

  @ApiProperty({ description: 'Response message' })
  message: string;

  @ApiProperty({ description: 'Updated agent configuration' })
  agent: {
    id: string;
    name: string;
    description?: string;
    instructions: string;
    model: string;
    temperature: number;
    maxTokens: number;
    isActive: boolean;
    updatedAt: string;
  };
}
