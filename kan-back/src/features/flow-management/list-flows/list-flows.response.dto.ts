import { ApiProperty } from '@nestjs/swagger';

class FlowItemDto {
  @ApiProperty({
    description: 'Unique identifier of the flow',
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
    example: 'active',
    enum: ['draft', 'active', 'archived'],
  })
  status: string;

  @ApiProperty({
    description: 'Associated agent ID',
    example: 'agent-uuid-123',
    required: false,
  })
  agentId?: string;

  @ApiProperty({
    description: 'Number of blocks in the flow',
    example: 5,
  })
  blockCount: number;

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
}

export class ListFlowsResponseDto {
  @ApiProperty({
    description: 'Array of flows',
    type: [FlowItemDto],
  })
  items: FlowItemDto[];

  @ApiProperty({
    description: 'Total number of flows matching the criteria',
    example: 25,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 3,
  })
  totalPages: number;

  constructor(
    items: FlowItemDto[],
    total: number,
    page: number,
    limit: number,
  ) {
    this.items = items;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(total / limit);
  }
}
