import { ApiProperty } from '@nestjs/swagger';
import {
  ContextSourceType,
  ContextPriority,
} from '../../../types/context.interface';

export class ContextSourceResponseDto {
  @ApiProperty({
    example: 'source_uuid_123',
    description: 'Unique identifier of the context source',
  })
  id: string;

  @ApiProperty({
    example: 'agent_123',
    description: 'ID of the AI agent this source belongs to',
  })
  agentId: string;

  @ApiProperty({
    example: 'Task Details Source',
    description: 'Name of the context source',
  })
  name: string;

  @ApiProperty({
    example:
      'Fetches detailed task information including description, status, assignee',
    description: 'Description of what this context source provides',
  })
  description: string;

  @ApiProperty({
    enum: ContextSourceType,
    enumName: 'ContextSourceType',
    example: ContextSourceType.TASK_DETAILS,
    description: 'Type of context source',
  })
  type: ContextSourceType;

  @ApiProperty({
    enum: ContextPriority,
    enumName: 'ContextPriority',
    example: ContextPriority.HIGH,
    description: 'Priority level of this context source',
  })
  priority: ContextPriority;

  @ApiProperty({
    example: true,
    description: 'Whether this context source is enabled',
  })
  enabled: boolean;

  @ApiProperty({
    example: { maxResults: 10, includeComments: true },
    description: 'Configuration object for the context source',
  })
  config: Record<string, any>;

  @ApiProperty({
    example: '2023-12-07T10:00:00.000Z',
    description: 'When the context source was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-12-07T10:00:00.000Z',
    description: 'When the context source was last updated',
  })
  updatedAt: Date;

  constructor(data: Partial<ContextSourceResponseDto>) {
    Object.assign(this, data);
  }
}

export class ConfigureContextSourcesResponseDto {
  @ApiProperty({
    type: ContextSourceResponseDto,
    description: 'The configured context source',
  })
  contextSource: ContextSourceResponseDto;

  @ApiProperty({
    example: 'Context source configured successfully',
    description: 'Success message',
  })
  message: string;

  constructor(contextSource: ContextSourceResponseDto, message: string) {
    this.contextSource = contextSource;
    this.message = message;
  }
}
