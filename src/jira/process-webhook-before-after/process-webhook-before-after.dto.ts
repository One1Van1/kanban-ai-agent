import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsObject,
  IsNumber,
} from 'class-validator';

export class JiraIssueFieldsDto {
  @ApiProperty({ description: 'Название задачи' })
  @IsString()
  summary: string;

  @ApiProperty({ description: 'Описание задачи', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Статус задачи' })
  @IsObject()
  status: {
    name: string;
    id: string;
  };

  @ApiProperty({ description: 'Исполнитель задачи', required: false })
  @IsOptional()
  @IsObject()
  assignee?: {
    displayName: string;
    accountId: string;
  };

  @ApiProperty({ description: 'Вложения', required: false })
  @IsOptional()
  attachment?: any[];
}

export class JiraIssueDto {
  @ApiProperty({ description: 'Ключ задачи Jira', example: 'KAN-123' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ description: 'ID задачи' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Поля задачи' })
  @IsObject()
  fields: JiraIssueFieldsDto;
}

export class ProcessWebhookBeforeAfterDto {
  @ApiProperty({
    description: 'Тип webhook события',
    example: 'jira:issue_updated',
  })
  @IsString()
  @IsNotEmpty()
  webhookEvent: string;

  @ApiProperty({ description: 'Временная метка события', required: false })
  @IsOptional()
  @IsNumber()
  timestamp?: number;

  @ApiProperty({ description: 'Данные задачи Jira' })
  @IsObject()
  issue: JiraIssueDto;

  @ApiProperty({ description: 'Changelog изменений', required: false })
  @IsOptional()
  @IsObject()
  changelog?: any;
}

export class ClaudeAnalysisDto {
  @ApiProperty({ description: 'Анализ трансформации' })
  transformation: {
    category: string;
    difficultyLevel: number;
    visualChanges: string[];
    technique: string;
  };

  @ApiProperty({ description: 'Оценки качества' })
  quality: {
    overallScore: number;
    evenness: number;
    transitions: number;
    symmetry: number;
    cleanliness: number;
    styleCompliance: number;
  };

  @ApiProperty({ description: 'Рекомендации' })
  recommendations: string[];
}

export class ProcessWebhookBeforeAfterResponseDto {
  @ApiProperty({ description: 'Успешность обработки webhook' })
  success: boolean;

  @ApiProperty({ description: 'Сообщение о результате' })
  message: string;

  @ApiProperty({ description: 'Была ли обработка выполнена' })
  processed: boolean;

  @ApiProperty({ description: 'Ключ обработанной задачи', required: false })
  taskKey?: string;

  @ApiProperty({ description: 'Результат анализа Claude', required: false })
  analysis?: ClaudeAnalysisDto;

  @ApiProperty({ description: 'Ошибка обработки', required: false })
  error?: string;

  @ApiProperty({ description: 'Временная метка обработки' })
  timestamp: string;
}
