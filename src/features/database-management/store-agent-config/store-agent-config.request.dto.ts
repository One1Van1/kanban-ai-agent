import {
  IsString,
  IsOptional,
  IsObject,
  IsArray,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class InstructionDto {
  @ApiProperty({ example: 'COLUMN_TODO', description: 'ID колонки' })
  @IsString()
  columnId: string;

  @ApiProperty({ example: 'To Do', description: 'Название колонки' })
  @IsString()
  columnName: string;

  @ApiProperty({
    example: 'Analyze task requirements and add estimates',
    description: 'Инструкция для выполнения',
  })
  @IsString()
  instruction: string;

  @ApiProperty({ example: 'on_enter', description: 'Событие-триггер' })
  @IsString()
  triggerEvent: string;

  @ApiProperty({
    example: {},
    description: 'Условия выполнения',
    required: false,
  })
  @IsOptional()
  @IsObject()
  conditions?: Record<string, any>;

  @ApiProperty({
    example: {},
    description: 'Действия для выполнения',
    required: false,
  })
  @IsOptional()
  @IsObject()
  actions?: Record<string, any>;

  @ApiProperty({
    example: true,
    description: 'Активна ли инструкция',
    required: false,
  })
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    example: 1,
    description: 'Приоритет выполнения',
    required: false,
  })
  @IsOptional()
  priority?: number;
}

export class StoreAgentConfigRequestDto {
  @ApiProperty({
    example: 'uuid-string',
    description: 'ID агента для обновления',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  agentId?: string;

  @ApiProperty({
    example: 'Task Analyzer Agent',
    description: 'Название агента',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Agent for analyzing and processing tasks',
    description: 'Описание агента',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'active',
    description: 'Статус агента',
    required: false,
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    example: {},
    description: 'Конфигурация агента',
    required: false,
  })
  @IsOptional()
  @IsObject()
  config?: Record<string, any>;

  @ApiProperty({
    example: 'https://company.atlassian.net',
    description: 'URL Jira инстанса',
    required: false,
  })
  @IsOptional()
  @IsString()
  jiraInstanceUrl?: string;

  @ApiProperty({
    example: 'PROJ',
    description: 'Ключ проекта в Jira',
    required: false,
  })
  @IsOptional()
  @IsString()
  jiraProjectKey?: string;

  @ApiProperty({
    example: 'api-token',
    description: 'API токен для Jira',
    required: false,
  })
  @IsOptional()
  @IsString()
  jiraApiToken?: string;

  @ApiProperty({
    example: {},
    description: 'Источники контекста',
    required: false,
  })
  @IsOptional()
  @IsObject()
  contextSources?: Record<string, any>;

  @ApiProperty({
    example: {},
    description: 'Настройки уведомлений',
    required: false,
  })
  @IsOptional()
  @IsObject()
  notificationSettings?: Record<string, any>;

  @ApiProperty({
    example: 'user123',
    description: 'Кто создал агента',
    required: false,
  })
  @IsOptional()
  @IsString()
  createdBy?: string;

  @ApiProperty({
    type: [InstructionDto],
    description: 'Инструкции агента',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InstructionDto)
  instructions?: InstructionDto[];
}
