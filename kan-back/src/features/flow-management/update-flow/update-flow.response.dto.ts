import { ApiProperty } from '@nestjs/swagger';

export class UpdateFlowResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the updated flow',
    example: 'flow-123e4567-e89b-12d3-a456-426614174000',
  })
  flowId: string;

  @ApiProperty({
    description: 'Name of the flow',
    example: 'Updated AI Content Analysis Flow',
  })
  name: string;

  @ApiProperty({
    description: 'Description of the flow',
    example:
      'Updated: Extracts files, analyzes content with AI, and moves cards based on conditions',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Current status of the flow',
    example: 'active',
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
      connections: [{ id: 'conn-1', source: 'block-1', target: 'block-2' }],
      triggers: [
        {
          type: 'board_move',
          config: { targetColumn: 'In Progress', boardId: 'test-board' },
        },
      ],
    },
  })
  definition: {
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
    description: 'Associated agent ID',
    example: 'agent-uuid-123',
    required: false,
  })
  agentId?: string;

  @ApiProperty({
    description: 'Flow metadata',
    example: { tags: ['automation', 'content'], version: 2, isTemplate: false },
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
    description: 'User who last updated the flow',
    example: 'user-456',
  })
  updatedBy: string;

  @ApiProperty({
    description: 'Flow creation timestamp',
    example: '2023-10-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Flow last update timestamp',
    example: '2023-10-15T11:45:00.000Z',
  })
  updatedAt: Date;

  constructor(data: Partial<UpdateFlowResponseDto>) {
    Object.assign(this, data);
  }
}
