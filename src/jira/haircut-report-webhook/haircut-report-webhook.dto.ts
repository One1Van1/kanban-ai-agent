import { IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO для webhook'а анализа отчётов по стрижкам
 */
export class HaircutReportWebhookDto {
  @ApiProperty({
    description: 'Тип события webhook',
    example: 'jira:issue_updated',
  })
  @IsString()
  webhookEvent: string;

  @ApiProperty({
    description: 'Альтернативное название события',
    required: false,
  })
  @IsOptional()
  issue_event_type_name?: string;

  @ApiProperty({
    description: 'Информация о задаче',
    example: {
      key: 'HAIR-123',
      fields: {
        summary: 'Стрижка клиента №001',
        description: 'Быстрая стрижка',
        status: { name: 'Review' },
        worklog: {
          worklogs: [
            { timeSpentSeconds: 1800, started: '2025-09-23T10:00:00.000+0000' },
          ],
        },
        comment: {
          comments: [
            {
              body: 'Сделал стрижку, клиент постоянный',
              author: { displayName: 'Мастер Иван' },
            },
          ],
        },
      },
    },
  })
  @IsOptional()
  issue?: any;

  @ApiProperty({
    description: 'История изменений',
    required: false,
  })
  @IsOptional()
  changelog?: any;

  @ApiProperty({
    description: 'Комментарий (для событий комментирования)',
    required: false,
  })
  @IsOptional()
  comment?: any;

  @ApiProperty({
    description: 'Пользователь, инициировавший событие',
    required: false,
  })
  @IsOptional()
  user?: any;

  @ApiProperty({
    description: 'Временная метка события',
    example: 1695454800000,
  })
  @IsNumber()
  timestamp: number;
}
