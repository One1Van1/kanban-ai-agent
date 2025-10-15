import { ApiProperty } from '@nestjs/swagger';

export class DeleteFlowResponseDto {
  @ApiProperty({
    description: 'Confirmation message',
    example: 'Flow deleted successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Deleted flow ID',
    example: 'flow-123e4567-e89b-12d3-a456-426614174000',
  })
  flowId: string;

  constructor(flowId: string) {
    this.message = 'Flow deleted successfully';
    this.flowId = flowId;
  }
}
