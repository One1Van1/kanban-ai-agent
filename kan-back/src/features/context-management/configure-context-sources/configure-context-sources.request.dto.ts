import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsObject,
} from 'class-validator';
import {
  ContextSourceType,
  ContextPriority,
} from '../../../types/context.interface';

export class ConfigureContextSourcesRequestDto {
  @ApiProperty({
    example: 'agent_123',
    description: 'ID of the AI agent',
  })
  @IsString()
  agentId: string;

  @ApiProperty({
    example: 'Task Details Source',
    description: 'Name of the context source',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example:
      'Fetches detailed task information including description, status, assignee',
    description: 'Description of what this context source provides',
  })
  @IsString()
  description: string;

  @ApiProperty({
    enum: ContextSourceType,
    enumName: 'ContextSourceType',
    example: ContextSourceType.TASK_DETAILS,
    description: 'Type of context source',
  })
  @IsEnum(ContextSourceType)
  type: ContextSourceType;

  @ApiProperty({
    enum: ContextPriority,
    enumName: 'ContextPriority',
    example: ContextPriority.HIGH,
    description: 'Priority level of this context source',
  })
  @IsEnum(ContextPriority)
  priority: ContextPriority;

  @ApiProperty({
    example: true,
    description: 'Whether this context source is enabled',
  })
  @IsBoolean()
  enabled: boolean;

  @ApiProperty({
    example: { maxResults: 10, includeComments: true },
    description: 'Configuration object for the context source',
    required: false,
  })
  @IsOptional()
  @IsObject()
  config?: Record<string, any>;
}
