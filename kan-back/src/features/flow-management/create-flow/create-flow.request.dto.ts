import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsObject,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFlowRequestDto {
  @ApiProperty({
    description: 'Name of the flow',
    example: 'AI Content Analysis Flow',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Description of the flow',
    example:
      'Extracts files, analyzes content with AI, and moves cards based on conditions',
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
      edges: [{ id: 'edge-1', source: 'block-1', target: 'block-2' }],
    },
  })
  @IsObject()
  @IsNotEmpty()
  definition: {
    blocks: Array<{
      id: string;
      type: string;
      position: { x: number; y: number };
      configuration?: any;
    }>;
    edges: Array<{
      id: string;
      source: string;
      target: string;
      sourceHandle?: string;
      targetHandle?: string;
    }>;
  };

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
    example: { tags: ['automation', 'content'], version: 1, isTemplate: false },
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
    description: 'User ID who creates the flow',
    example: 'user-123',
  })
  @IsString()
  @IsNotEmpty()
  createdBy: string;
}
