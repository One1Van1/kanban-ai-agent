import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO для анализа выполненной задачи по стрижке
 */
export class AnalyzeCompletedHaircutTaskDto {
  @ApiProperty({
    description: 'Ключ задачи в Jira',
    example: 'HAIR-123',
  })
  @IsString()
  @IsNotEmpty()
  issueKey: string;

  @ApiProperty({
    description: 'Заголовок задачи',
    example: 'Стрижка клиента №001',
    required: false,
  })
  @IsString()
  @IsOptional()
  taskTitle?: string;

  @ApiProperty({
    description: 'Описание задачи (категория стрижки)',
    example: 'Быстрая стрижка',
    required: false,
  })
  @IsString()
  @IsOptional()
  taskDescription?: string;

  @ApiProperty({
    description: 'Комментарий сотрудника с отчётом',
    example:
      'Сделал быструю стрижку, клиент был нервный, потребовалось больше времени',
    required: false,
  })
  @IsString()
  @IsOptional()
  employeeComment?: string;

  @ApiProperty({
    description: 'Фактическое время выполнения в минутах',
    example: 45,
    required: false,
  })
  @IsOptional()
  actualTimeMinutes?: number;
}

/**
 * DTO для webhook анализа задачи
 */
export class WebhookAnalyzeHaircutTaskDto {
  @ApiProperty({
    description: 'Payload вебхука от Jira',
    example: {
      webhookEvent: 'jira:issue_updated',
      issue: {
        key: 'HAIR-123',
        fields: {
          summary: 'Стрижка клиента',
          status: { name: 'Review' },
        },
      },
    },
  })
  @IsNotEmpty()
  webhookPayload: any;

  @ApiProperty({
    description: 'Заголовки запроса для валидации подписи',
    required: false,
  })
  @IsOptional()
  headers?: Record<string, string>;
}

/**
 * DTO для ответа сотрудника на вопрос агента
 */
export class EmployeeResponseDto {
  @ApiProperty({
    description: 'Ключ задачи в Jira',
    example: 'HAIR-123',
  })
  @IsString()
  @IsNotEmpty()
  issueKey: string;

  @ApiProperty({
    description: 'Ответ сотрудника на вопрос агента',
    example: 'Категория верная - быстрая стрижка. Клиент был очень нервным.',
  })
  @IsString()
  @IsNotEmpty()
  response: string;
}
