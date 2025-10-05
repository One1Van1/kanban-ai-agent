import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsObject, IsOptional, IsNumber, Min } from 'class-validator';

export class CacheAgentConfigsRequestDto {
  @ApiProperty({
    description: 'Agent ID to cache configuration for',
    example: 'agent-uuid-123',
  })
  @IsString()
  agentId: string;

  @ApiProperty({
    description: 'Agent configuration data to cache',
    example: {
      name: 'Task Processor Agent',
      instructions: {
        'To Do': 'Analyze task and add initial comments',
        'In Progress': 'Monitor progress and send updates',
        Done: 'Generate completion report',
      },
      settings: {
        autoAssign: true,
        notifyOnChange: true,
        contextSources: ['jira', 'confluence'],
      },
    },
  })
  @IsObject()
  configData: Record<string, any>;

  @ApiProperty({
    description: 'TTL in seconds (optional, uses default if not provided)',
    example: 1800,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  ttl?: number;
}
