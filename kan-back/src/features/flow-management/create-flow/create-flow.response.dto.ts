import { ApiProperty } from '@nestjs/swagger';

export class CreateFlowResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the created flow',
    example: 'flow-123e4567-e89b-12d3-a456-426614174000',
  })
  flowId: string;

  @ApiProperty({
    description: 'Name of the flow',
    example: 'AI Content Analysis Flow',
  })
  name: string;

  @ApiProperty({
    description: 'Description of the flow',
    example:
      'Extracts files, analyzes content with AI, and moves cards based on conditions',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Current status of the flow',
    example: 'draft',
    enum: ['draft', 'active', 'archived'],
  })
  status: string;

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
    description: 'Associated agent ID',
    example: 'agent-uuid-123',
    required: false,
  })
  agentId?: string;

  @ApiProperty({
    description: 'Flow metadata',
    example: { tags: ['automation', 'content'], version: 1, isTemplate: false },
    required: false,
  })
  metadata?: {
    tags?: string[];
    version?: number;
    isTemplate?: boolean;
    category?: string;
    originalFlowId?: string;
  };

  @ApiProperty({
    description: 'User who created the flow',
    example: 'user-123',
  })
  createdBy: string;

  @ApiProperty({
    description: 'Flow creation timestamp',
    example: '2023-10-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Flow last update timestamp',
    example: '2023-10-15T10:30:00.000Z',
  })
  updatedAt: Date;

  constructor(data: Partial<CreateFlowResponseDto>) {
    Object.assign(this, data);
  }
}
