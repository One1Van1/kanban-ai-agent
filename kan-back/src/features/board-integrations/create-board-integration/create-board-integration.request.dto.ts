import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsObject,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  BoardType,
  BoardConfig,
} from '../../../types/board-integration.interface';

export class CreateBoardIntegrationRequestDto {
  @ApiProperty({
    description: 'Agent ID to associate with this integration',
    example: 'uuid-agent-id',
  })
  @IsString()
  agentId: string;

  @ApiProperty({
    description: 'Type of board integration',
    enum: BoardType,
    example: BoardType.JIRA,
  })
  @IsEnum(BoardType)
  boardType: BoardType;

  @ApiProperty({
    description: 'Name for this integration',
    example: 'Main Project Board',
  })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    description: 'Description of this integration',
    example: 'Integration with our main Jira project',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    description: 'Configuration for the board integration',
    example: {
      instanceUrl: 'https://company.atlassian.net',
      projectKey: 'PROJ',
      apiToken: 'your-api-token',
      email: 'user@company.com',
    },
  })
  @IsObject()
  config: BoardConfig;

  @ApiPropertyOptional({
    description: 'Whether the integration is active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Custom field mappings',
    example: {
      title: 'summary',
      description: 'description',
      status: 'status.name',
    },
  })
  @IsOptional()
  @IsObject()
  fieldMappings?: Record<string, string>;

  @ApiPropertyOptional({
    description: 'Custom status mappings',
    example: {
      'to-do': 'To Do',
      'in-progress': 'In Progress',
      done: 'Done',
    },
  })
  @IsOptional()
  @IsObject()
  statusMappings?: Record<string, string>;
}
