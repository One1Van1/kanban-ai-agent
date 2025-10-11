import { ApiProperty } from '@nestjs/swagger';
import { BoardType } from '../../../types/board-integration.interface';

export class CreateBoardIntegrationResponseDto {
  @ApiProperty({
    description: 'Integration ID',
    example: 'uuid-integration-id',
  })
  id: string;

  @ApiProperty({
    description: 'Agent ID',
    example: 'uuid-agent-id',
  })
  agentId: string;

  @ApiProperty({
    description: 'Type of board integration',
    enum: BoardType,
    example: BoardType.JIRA,
  })
  boardType: BoardType;

  @ApiProperty({
    description: 'Name of the integration',
    example: 'Main Project Board',
  })
  name: string;

  @ApiProperty({
    description: 'Description of the integration',
    example: 'Integration with our main Jira project',
  })
  description?: string;

  @ApiProperty({
    description: 'Whether the integration is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Connection test result',
    example: true,
  })
  connectionTest: boolean;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
