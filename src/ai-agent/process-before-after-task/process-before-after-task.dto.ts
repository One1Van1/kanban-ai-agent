import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO для запуска полного процесса анализа задач "до и после" стрижки
 */
export class ProcessBeforeAfterTaskDto {
  @ApiProperty({
    description: 'Ключ задачи в Jira (например, HAIR-123)',
    example: 'HAIR-123',
  })
  @IsString()
  @IsNotEmpty()
  taskKey: string;

  @ApiPropertyOptional({
    description:
      'Принудительно запустить анализ фотографий, даже если уже есть результаты',
    default: false,
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  forcePhotoAnalysis?: boolean;

  @ApiPropertyOptional({
    description: 'Принудительно обновить данные о времени работы',
    default: false,
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  forceTimeUpdate?: boolean;

  @ApiPropertyOptional({
    description: 'Добавить комментарий к задаче с результатами анализа',
    default: true,
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  addCommentToTask?: boolean;
}

/**
 * DTO для результата анализа фотографий
 */
export class PhotoAnalysisResultDto {
  @ApiProperty({
    description: 'Успешность анализа фотографий',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Категория стрижки',
    example: 'classic_male',
  })
  category: string;

  @ApiProperty({
    description: 'Оценка качества (1-10)',
    example: 8,
  })
  qualityScore: number;

  @ApiProperty({
    description: 'Подробное описание анализа',
    example: 'Отличная мужская классическая стрижка с аккуратными переходами',
  })
  description: string;

  @ApiProperty({
    description: 'Рекомендации по улучшению',
    example: [
      'Можно сделать переходы более плавными',
      'Хорошая работа с окантовкой',
    ],
  })
  recommendations: string[];

  @ApiPropertyOptional({
    description: 'Ошибка анализа фотографий, если была',
    example: null,
  })
  error?: string;
}

/**
 * DTO для результата анализа времени работы
 */
export class TimeAnalysisResultDto {
  @ApiProperty({
    description: 'Успешность анализа времени',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Общее время работы в минутах',
    example: 45,
  })
  totalMinutes: number;

  @ApiProperty({
    description: 'Эффективность работы',
    example: 'good',
    enum: ['excellent', 'good', 'average', 'slow', 'very_slow'],
  })
  efficiency: 'excellent' | 'good' | 'average' | 'slow' | 'very_slow';

  @ApiProperty({
    description: 'Процент эффективности (100% = оптимальное время)',
    example: 100,
  })
  efficiencyPercentage: number;

  @ApiProperty({
    description: 'Ожидаемый диапазон времени для данного типа стрижки',
    example: '30-60 мин',
  })
  expectedRange: string;

  @ApiProperty({
    description: 'Рекомендации по оптимизации времени',
    example: ['Отличная работа в рамках стандартного времени'],
  })
  recommendations: string[];

  @ApiPropertyOptional({
    description: 'Ошибка анализа времени, если была',
    example: null,
  })
  error?: string;
}

/**
 * DTO для полного результата процесса анализа задач
 */
export class ProcessBeforeAfterTaskResultDto {
  @ApiProperty({
    description: 'Ключ обработанной задачи',
    example: 'HAIR-123',
  })
  taskKey: string;

  @ApiProperty({
    description: 'Время начала обработки',
    example: '2025-01-20T10:30:00.000Z',
  })
  processedAt: string;

  @ApiProperty({
    description: 'Общая успешность процесса',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Результат анализа фотографий',
    type: PhotoAnalysisResultDto,
  })
  photoAnalysis: PhotoAnalysisResultDto;

  @ApiProperty({
    description: 'Результат анализа времени работы',
    type: TimeAnalysisResultDto,
  })
  timeAnalysis: TimeAnalysisResultDto;

  @ApiProperty({
    description: 'Сводный анализ и рекомендации',
    example: {
      overallScore: 8.5,
      summary:
        'Отличная работа: качественная стрижка выполнена в оптимальное время',
      recommendations: [
        'Продолжайте поддерживать высокое качество работы',
        'Время выполнения оптимальное для данного типа стрижки',
      ],
    },
  })
  @IsObject()
  combinedAnalysis: {
    overallScore: number;
    summary: string;
    recommendations: string[];
  };

  @ApiPropertyOptional({
    description: 'ID комментария, добавленного к задаче (если был добавлен)',
    example: '12345',
  })
  @IsOptional()
  commentId?: string;

  @ApiPropertyOptional({
    description: 'Список ошибок, если они возникли в процессе',
    example: [],
  })
  errors?: string[];
}

/**
 * DTO для запроса статуса обработки задач
 */
export class ProcessStatusDto {
  @ApiProperty({
    description: 'Список ключей задач для проверки статуса',
    example: ['HAIR-123', 'HAIR-124', 'HAIR-125'],
  })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  taskKeys: string[];
}

/**
 * DTO для статуса одной задачи
 */
export class TaskProcessStatusDto {
  @ApiProperty({
    description: 'Ключ задачи',
    example: 'HAIR-123',
  })
  taskKey: string;

  @ApiProperty({
    description: 'Статус обработки',
    example: 'completed',
    enum: ['not_processed', 'in_progress', 'completed', 'failed'],
  })
  status: 'not_processed' | 'in_progress' | 'completed' | 'failed';

  @ApiProperty({
    description: 'Время последней обработки',
    example: '2025-01-20T10:30:00.000Z',
    required: false,
  })
  lastProcessedAt?: string;

  @ApiPropertyOptional({
    description: 'Краткий результат последней обработки',
    example: 'Успешно: качество 8/10, эффективность хорошая',
  })
  lastResult?: string;

  @ApiPropertyOptional({
    description: 'Ошибка последней обработки, если была',
    example: null,
  })
  lastError?: string;
}

/**
 * DTO для результата проверки статуса обработки
 */
export class ProcessStatusResultDto {
  @ApiProperty({
    description: 'Количество проверенных задач',
    example: 3,
  })
  totalTasks: number;

  @ApiProperty({
    description: 'Количество успешно обработанных задач',
    example: 2,
  })
  completedTasks: number;

  @ApiProperty({
    description: 'Количество задач с ошибками',
    example: 0,
  })
  failedTasks: number;

  @ApiProperty({
    description: 'Количество необработанных задач',
    example: 1,
  })
  notProcessedTasks: number;

  @ApiProperty({
    description: 'Статус каждой задачи',
    type: [TaskProcessStatusDto],
  })
  tasks: TaskProcessStatusDto[];
}
