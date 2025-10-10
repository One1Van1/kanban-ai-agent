import { IsString, IsObject, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TimeValidationWebhookRequestDto {
  @ApiProperty({
    description: 'Тип события вебхука',
    example: 'jira:issue_updated',
  })
  @IsString()
  webhookEvent: string;

  @ApiProperty({
    description: 'Данные о задаче',
    example: {
      key: 'KAN-5',
      fields: {
        status: { name: 'In Progress' },
        timespent: 3600,
        timeoriginalestimate: 7200,
      },
    },
  })
  @IsObject()
  issue: any;

  @ApiProperty({
    description: 'Лог изменений',
    required: false,
    example: {
      items: [
        {
          field: 'status',
          from: '10001',
          to: '10002',
        },
      ],
    },
  })
  @IsOptional()
  @IsObject()
  changelog?: any;

  @ApiProperty({
    description: 'Временная метка события',
    example: 1640995200000,
    required: false,
  })
  @IsOptional()
  timestamp?: number;
}
