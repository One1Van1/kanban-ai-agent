import { ApiProperty } from '@nestjs/swagger';

export class StoreAgentConfigResponseDto {
  @ApiProperty({
    example: 'uuid-string',
    description: 'ID сохраненного агента',
  })
  agentId: string;

  @ApiProperty({
    example: 'Agent configuration saved successfully',
    description: 'Сообщение о результате',
  })
  message: string;

  @ApiProperty({ example: true, description: 'Успешность операции' })
  success: boolean;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Время сохранения',
  })
  timestamp: string;

  constructor(agentId: string, message: string) {
    this.agentId = agentId;
    this.message = message;
    this.success = true;
    this.timestamp = new Date().toISOString();
  }
}
