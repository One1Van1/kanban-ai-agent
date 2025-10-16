import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsObject,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FlowStatus } from '../../../entities/flow.entity';

export class UpdateFlowRequestDto {
  @ApiProperty({
    description: 'Name of the flow',
    example: 'Updated AI Content Analysis Flow',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Description of the flow',
    example:
      'Updated: Extracts files, analyzes content with AI, and moves cards based on conditions',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Flow definition with blocks and edges',
    example: {
      blocks: [
        {
          id: 'block-1',
          type: 'extract_files',
          position: { x: 100, y: 100 },
          configuration: { fileTypes: ['pdf', 'doc'] },
        },
      ],
      connections: [{ id: 'conn-1', source: 'block-1', target: 'block-2' }],
      triggers: [
        {
          type: 'board_move',
          config: { targetColumn: 'In Progress', boardId: 'test-board' },
        },
      ],
    },
    required: false,
  })
  @IsObject()
  @IsOptional()
  definition?: {
    id?: string;
    name?: string;
    description?: string;
    blocks: Array<{
      id: string;
      type: string;
      position: { x: number; y: number };
      config?: any;
      configuration?: any; // Support legacy
    }>;
    connections?: Array<{
      id: string;
      source: string;
      target: string;
      sourceHandle?: string;
      targetHandle?: string;
    }>;
    edges?: Array<{
      // Support legacy
      id: string;
      source: string;
      target: string;
      sourceHandle?: string;
      targetHandle?: string;
    }>;
    triggers?: Array<{
      type: string;
      config: any;
    }>;
    variables?: any;
    settings?: any;
  };

  @ApiProperty({
    description: 'Flow status',
    enum: FlowStatus,
    enumName: 'FlowStatus',
    example: FlowStatus.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(FlowStatus)
  status?: FlowStatus;

  @ApiProperty({
    description: 'Agent ID to associate with this flow',
    example: 'agent-uuid-123',
    required: false,
  })
  @IsString()
  @IsOptional()
  agentId?: string;

  @ApiProperty({
    description: 'Flow metadata (tags, version, template info)',
    example: { tags: ['automation', 'content'], version: 2, isTemplate: false },
    required: false,
  })
  @IsObject()
  @IsOptional()
  metadata?: {
    tags?: string[];
    version?: number;
    isTemplate?: boolean;
    category?: string;
    originalFlowId?: string;
  };

  @ApiProperty({
    description: 'User ID who updates the flow',
    example: 'user-456',
  })
  @IsString()
  @IsNotEmpty()
  updatedBy: string;
}
