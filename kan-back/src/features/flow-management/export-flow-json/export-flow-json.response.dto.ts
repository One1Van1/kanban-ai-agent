import { ApiProperty } from '@nestjs/swagger';

export class ExportFlowJsonResponseDto {
  @ApiProperty({
    description: 'Export format version',
    example: '1.0.0',
  })
  version: string;

  @ApiProperty({
    description: 'Export timestamp',
    example: '2025-10-23T12:00:00.000Z',
  })
  exportedAt: string;

  @ApiProperty({
    description: 'Flow ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  flowId: string;

  @ApiProperty({
    description: 'Flow name',
    example: 'My Automation Flow',
  })
  name: string;

  @ApiProperty({
    description: 'Flow description',
    example: 'This flow automates task creation',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Flow status',
    example: 'active',
    enum: ['draft', 'active', 'archived'],
  })
  status: string;

  @ApiProperty({
    description: 'Flow definition with blocks and connections',
    example: {
      blocks: [],
      connections: [],
    },
  })
  definition: any;

  @ApiProperty({
    description: 'Flow metadata',
    required: false,
  })
  metadata?: any;

  @ApiProperty({
    description: 'Created by user',
    example: 'user123',
  })
  createdBy: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2025-10-23T10:00:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Last updated timestamp',
    example: '2025-10-23T11:30:00.000Z',
  })
  updatedAt: string;

  constructor(partial: Partial<ExportFlowJsonResponseDto>) {
    Object.assign(this, partial);
  }
}
