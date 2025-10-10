import { IsString, IsObject, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class JiraWebhookHandlerRequestDto {
  @ApiProperty({
    description: 'Тип события вебхука',
    example: 'jira:issue_updated',
  })
  @IsString()
  webhookEvent: string;

  @ApiProperty({
    description: 'Название типа события',
    example: 'issue_updated',
    required: false,
  })
  @IsOptional()
  @IsString()
  issue_event_type_name?: string;

  @IsOptional()
  @IsString()
  eventType?: string;

  @ApiProperty({
    description: 'Данные о задаче',
    example: {
      key: 'KAN-5',
      fields: {
        summary: 'Test task',
      },
    },
  })
  @IsObject()
  issue: any;

  @ApiProperty({
    description: 'Данные о пользователе',
    example: {
      accountId: 'user123',
      displayName: 'John Doe',
    },
    required: false,
  })
  @IsOptional()
  @IsObject()
  user?: any;

  @ApiProperty({
    description: 'Лог изменений',
    example: {
      items: [
        {
          field: 'status',
          from: '10001',
          to: '10002',
        },
      ],
    },
    required: false,
  })
  @IsOptional()
  @IsObject()
  changelog?: any;

  // Добавляем все возможные поля от Jira
  @IsOptional()
  timestamp?: any;

  @IsOptional()
  comment?: any;

  @IsOptional()
  matchedConditions?: any;

  @IsOptional()
  project?: any;

  @IsOptional()
  transition?: any;
}
