import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsObject,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO для входящего webhook payload от Jira
 */
export class JiraWebhookPayloadDto {
  @ApiProperty({
    description: 'Тип webhook события',
    example: 'jira:issue_updated',
  })
  @IsString()
  @IsNotEmpty()
  webhookEvent: string;

  @ApiPropertyOptional({
    description: 'Название типа события',
    example: 'issue_updated',
  })
  @IsString()
  @IsOptional()
  issue_event_type_name?: string;

  @ApiProperty({
    description: 'Информация о задаче',
    example: {
      key: 'HAIR-123',
      id: '12345',
      fields: {
        summary: 'Классическая мужская стрижка',
        status: { name: 'Review' },
        attachment: [],
      },
    },
  })
  @IsObject()
  issue: any;

  @ApiPropertyOptional({
    description: 'История изменений задачи',
    example: {
      items: [
        {
          field: 'status',
          fromString: 'In Progress',
          toString: 'Review',
        },
      ],
    },
  })
  @IsObject()
  @IsOptional()
  changelog?: any;

  @ApiProperty({
    description: 'Временная метка события',
    example: 1642678800000,
  })
  @IsNumber()
  timestamp: number;

  @ApiPropertyOptional({
    description: 'Информация о пользователе',
    example: {
      displayName: 'Иван Парикмахер',
      emailAddress: 'ivan@salon.com',
    },
  })
  @IsObject()
  @IsOptional()
  user?: any;

  @ApiPropertyOptional({
    description: 'Комментарий (если событие связано с комментарием)',
  })
  @IsObject()
  @IsOptional()
  comment?: any;
}

/**
 * DTO для результата обработки webhook'а
 */
export class WebhookProcessingResultDto {
  @ApiProperty({
    description: 'Успешность обработки',
    example: true,
  })
  @IsBoolean()
  success: boolean;

  @ApiProperty({
    description: 'Сообщение о результате обработки',
    example: 'Webhook успешно обработан для задачи HAIR-123',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Ключ обработанной задачи',
    example: 'HAIR-123',
  })
  @IsString()
  taskKey: string;

  @ApiProperty({
    description: 'Список выполненных действий',
    example: [
      'analyze_photos',
      'track_time',
      'combined_analysis',
      'add_comment',
    ],
  })
  @IsArray()
  @IsString({ each: true })
  triggeredActions: string[];

  @ApiProperty({
    description: 'Время обработки в миллисекундах',
    example: 15000,
  })
  @IsNumber()
  processingTimeMs: number;

  @ApiProperty({
    description: 'Временная метка завершения обработки',
    example: '2025-09-26T12:00:00.000Z',
  })
  @IsString()
  timestamp: string;

  @ApiPropertyOptional({
    description: 'Результат анализа фотографий',
    example: {
      processed: true,
      photosFound: 2,
      analysisResult: { qualityScore: 8.5 },
    },
  })
  @IsObject()
  @IsOptional()
  photoAnalysis?: {
    processed: boolean;
    photosFound: number;
    analysisResult?: any;
    error?: string;
  };

  @ApiPropertyOptional({
    description: 'Результат анализа времени работы',
    example: {
      processed: true,
      totalMinutes: 45,
      efficiency: 'good',
    },
  })
  @IsObject()
  @IsOptional()
  timeTracking?: {
    processed: boolean;
    totalMinutes: number;
    efficiency: string;
    error?: string;
  };

  @ApiPropertyOptional({
    description: 'Результат комбинированного анализа',
    example: {
      processed: true,
      overallScore: 8.2,
      summary:
        'Отличная работа: качественная стрижка выполнена в оптимальное время',
    },
  })
  @IsObject()
  @IsOptional()
  combinedAnalysis?: {
    processed: boolean;
    overallScore: number;
    summary: string;
    error?: string;
  };

  @ApiPropertyOptional({
    description: 'Результат добавления комментария в Jira',
    example: {
      added: true,
      commentId: '67890',
    },
  })
  @IsObject()
  @IsOptional()
  jiraComment?: {
    added: boolean;
    commentId?: string;
    error?: string;
  };

  @ApiProperty({
    description: 'Список ошибок, если они возникли',
    example: [],
  })
  @IsArray()
  @IsString({ each: true })
  errors: string[];
}

/**
 * DTO для проверки условий обработки
 */
export class ProcessingConditionsDto {
  @ApiProperty({
    description: 'Содержит ключевые слова стрижки',
    example: true,
  })
  @IsBoolean()
  hasHaircutKeywords: boolean;

  @ApiProperty({
    description: 'Соответствует требуемому статусу',
    example: true,
  })
  @IsBoolean()
  hasRequiredStatus: boolean;

  @ApiProperty({
    description: 'Есть прикрепленные фотографии',
    example: true,
  })
  @IsBoolean()
  hasPhotos: boolean;

  @ApiProperty({
    description: 'Достаточно фотографий для анализа',
    example: true,
  })
  @IsBoolean()
  hasMinimumPhotos: boolean;

  @ApiProperty({
    description: 'Валидная задача для обработки',
    example: true,
  })
  @IsBoolean()
  isValidTask: boolean;
}

/**
 * DTO для конфигурации webhook'ов
 */
export class WebhookConfigDto {
  @ApiProperty({
    description: 'Включить анализ фото ДО/ПОСЛЕ',
    example: true,
  })
  @IsBoolean()
  enableBeforeAfterAnalysis: boolean;

  @ApiProperty({
    description: 'Включить анализ времени работы',
    example: true,
  })
  @IsBoolean()
  enableTimeTracking: boolean;

  @ApiProperty({
    description: 'Автоматически добавлять комментарии',
    example: true,
  })
  @IsBoolean()
  enableAutoComments: boolean;

  @ApiProperty({
    description: 'Статусы, запускающие обработку',
    example: ['Review', 'Testing'],
  })
  @IsArray()
  @IsString({ each: true })
  triggerStatuses: string[];

  @ApiProperty({
    description: 'Ключевые слова для определения задач стрижки',
    example: ['стрижка', 'haircut', 'окрашивание', 'укладка'],
  })
  @IsArray()
  @IsString({ each: true })
  haircutKeywords: string[];

  @ApiProperty({
    description: 'Задержка перед обработкой (мс)',
    example: 3000,
  })
  @IsNumber()
  processingDelayMs: number;

  @ApiProperty({
    description: 'Настройки анализа фотографий',
    example: {
      minPhotos: 1,
      maxPhotos: 10,
      supportedFormats: ['jpg', 'jpeg', 'png'],
      maxFileSize: 5242880,
    },
  })
  @IsObject()
  photoAnalysis: {
    minPhotos: number;
    maxPhotos: number;
    supportedFormats: string[];
    maxFileSize: number;
  };
}

/**
 * DTO для состояния обработки webhook'а
 */
export class WebhookStateDto {
  @ApiProperty({
    description: 'Ключ задачи',
    example: 'HAIR-123',
  })
  @IsString()
  taskKey: string;

  @ApiProperty({
    description: 'ID webhook события',
    example: 'webhook_abc123',
  })
  @IsString()
  webhookId: string;

  @ApiProperty({
    description: 'Статус обработки',
    example: 'processing',
    enum: ['pending', 'processing', 'completed', 'failed'],
  })
  @IsString()
  status: 'pending' | 'processing' | 'completed' | 'failed';

  @ApiProperty({
    description: 'Время начала обработки',
    example: '2025-09-26T11:00:00.000Z',
  })
  @IsString()
  startedAt: string;

  @ApiPropertyOptional({
    description: 'Время завершения обработки',
    example: '2025-09-26T11:02:15.000Z',
  })
  @IsString()
  @IsOptional()
  completedAt?: string;

  @ApiProperty({
    description: 'Состояние выполнения шагов',
    example: {
      validation: 'completed',
      photoAnalysis: 'processing',
      timeTracking: 'pending',
      combinedAnalysis: 'pending',
      commentAdding: 'pending',
    },
  })
  @IsObject()
  steps: {
    validation: string;
    photoAnalysis: string;
    timeTracking: string;
    combinedAnalysis: string;
    commentAdding: string;
  };

  @ApiProperty({
    description: 'Условия для запуска обработки',
    type: ProcessingConditionsDto,
  })
  @IsObject()
  triggerConditions: ProcessingConditionsDto;

  @ApiProperty({
    description: 'Список ошибок',
    example: [],
  })
  @IsArray()
  @IsString({ each: true })
  errors: string[];
}

/**
 * DTO для метрик производительности
 */
export class WebhookMetricsDto {
  @ApiProperty({
    description: "Общее количество обработанных webhook'ов",
    example: 150,
  })
  @IsNumber()
  totalProcessed: number;

  @ApiProperty({
    description: 'Количество успешно обработанных',
    example: 142,
  })
  @IsNumber()
  successfulProcessed: number;

  @ApiProperty({
    description: 'Количество failed обработок',
    example: 8,
  })
  @IsNumber()
  failedProcessed: number;

  @ApiProperty({
    description: 'Среднее время обработки (мс)',
    example: 12500,
  })
  @IsNumber()
  averageProcessingTimeMs: number;

  @ApiProperty({
    description: 'Детальные метрики по условиям запуска',
    example: {
      haircutTasksDetected: 95,
      statusTriggersMatched: 142,
      photoRequirementsMet: 89,
      skippedTasks: 55,
    },
  })
  @IsObject()
  triggerConditions: {
    haircutTasksDetected: number;
    statusTriggersMatched: number;
    photoRequirementsMet: number;
    skippedTasks: number;
  };

  @ApiProperty({
    description: 'Результаты обработки по типам',
    example: {
      photoAnalysisSuccess: 85,
      timeTrackingSuccess: 140,
      combinedAnalysisSuccess: 84,
      jiraCommentsAdded: 78,
    },
  })
  @IsObject()
  processingResults: {
    photoAnalysisSuccess: number;
    timeTrackingSuccess: number;
    combinedAnalysisSuccess: number;
    jiraCommentsAdded: number;
  };

  @ApiProperty({
    description: 'Статистика ошибок',
    example: {
      validationErrors: 2,
      processingErrors: 4,
      externalServiceErrors: 1,
      timeoutErrors: 1,
    },
  })
  @IsObject()
  errors: {
    validationErrors: number;
    processingErrors: number;
    externalServiceErrors: number;
    timeoutErrors: number;
  };

  @ApiPropertyOptional({
    description: 'Время последней обработки',
    example: '2025-09-26T12:00:00.000Z',
  })
  @IsString()
  @IsOptional()
  lastProcessedAt?: string;
}
