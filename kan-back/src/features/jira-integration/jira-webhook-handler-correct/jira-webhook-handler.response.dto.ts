import { ApiProperty } from '@nestjs/swagger';

export class JiraWebhookHandlerResponseDto {
  @ApiProperty({
    description: 'Статус обработки вебхука',
    example: 'processed',
  })
  status: string;

  @ApiProperty({
    description: 'Ключ обработанной задачи',
    example: 'KAN-5',
  })
  issueKey: string;

  @ApiProperty({
    description: 'Тип обработанного события',
    example: 'issue_updated',
  })
  eventType: string;

  @ApiProperty({
    description: 'Время обработки',
    example: '2024-01-20T12:00:00Z',
  })
  processedAt: string;

  @ApiProperty({
    description: 'Дополнительная информация',
    required: false,
  })
  details?: any;

  constructor(
    status: string,
    issueKey: string,
    eventType: string,
    details?: any,
  ) {
    this.status = status;
    this.issueKey = issueKey;
    this.eventType = eventType;
    this.processedAt = new Date().toISOString();
    this.details = details;
  }
}
