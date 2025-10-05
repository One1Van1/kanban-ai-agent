import { ApiProperty } from '@nestjs/swagger';

export class StoreTaskHistoryResponseDto {
  @ApiProperty({ example: 'uuid-string', description: 'ID записи истории' })
  historyId: string;

  @ApiProperty({
    example: 'Task history stored successfully',
    description: 'Сообщение о результате',
  })
  message: string;

  @ApiProperty({ example: true, description: 'Успешность операции' })
  success: boolean;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Время создания',
  })
  timestamp: string;

  constructor(historyId: string, message: string) {
    this.historyId = historyId;
    this.message = message;
    this.success = true;
    this.timestamp = new Date().toISOString();
  }
}
