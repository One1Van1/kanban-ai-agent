import { ApiProperty } from '@nestjs/swagger';

export class TimeValidationWebhookResponseDto {
  @ApiProperty({
    description: 'Статус валидации времени',
    example: 'validated',
  })
  status: string;

  @ApiProperty({
    description: 'Ключ задачи',
    example: 'KAN-5',
  })
  issueKey: string;

  @ApiProperty({
    description: 'Результат валидации',
    example: true,
  })
  isValid: boolean;

  @ApiProperty({
    description: 'Время обработки',
    example: '2024-01-20T12:00:00Z',
  })
  processedAt: string;

  @ApiProperty({
    description: 'Детали валидации',
    example: {
      timeSpent: 3600,
      timeEstimate: 7200,
      efficiency: 50,
    },
  })
  validationDetails: any;

  constructor(
    status: string,
    issueKey: string,
    isValid: boolean,
    validationDetails: any,
  ) {
    this.status = status;
    this.issueKey = issueKey;
    this.isValid = isValid;
    this.validationDetails = validationDetails;
    this.processedAt = new Date().toISOString();
  }
}
