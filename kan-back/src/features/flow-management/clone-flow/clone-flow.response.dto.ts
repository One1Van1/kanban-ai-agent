import { ApiProperty } from '@nestjs/swagger';

export class CloneFlowResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the cloned flow',
    example: 'flow-456e7890-e89b-12d3-a456-426614174000',
  })
  flowId: string;

  @ApiProperty({
    description: 'Name of the cloned flow',
    example: 'Copy of AI Content Analysis Flow',
  })
  name: string;

  @ApiProperty({
    description: 'Description of the cloned flow',
    example: 'Cloned from original flow for testing purposes',
  })
  description?: string;

  @ApiProperty({
    description: 'Status of the cloned flow (always draft)',
    example: 'draft',
  })
  status: string;

  @ApiProperty({
    description: 'Original flow ID that was cloned',
    example: 'flow-123e4567-e89b-12d3-a456-426614174000',
  })
  originalFlowId: string;

  @ApiProperty({
    description: 'Flow definition copied from original',
  })
  definition: any;

  @ApiProperty({
    description: 'User who cloned the flow',
    example: 'user-456',
  })
  createdBy: string;

  @ApiProperty({
    description: 'Clone creation timestamp',
    example: '2023-10-15T12:00:00.000Z',
  })
  createdAt: Date;

  constructor(data: Partial<CloneFlowResponseDto>) {
    Object.assign(this, data);
  }
}
