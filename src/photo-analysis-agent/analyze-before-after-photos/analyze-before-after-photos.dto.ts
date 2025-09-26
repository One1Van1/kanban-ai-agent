import {
  IsString,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO для одного фото (ДО или ПОСЛЕ)
 */
export class BeforeAfterPhotoDto {
  @ApiProperty({
    description: 'Имя файла фотографии',
    example: 'before_client_ivan.jpg',
  })
  @IsNotEmpty()
  @IsString()
  filename: string;

  @ApiProperty({
    description: 'Размер файла в байтах',
    example: 1024000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  size?: number;

  @ApiProperty({
    description: 'Base64 контент изображения',
    example: 'iVBORw0KGgoAAAANSUhEUgAAA...',
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}

/**
 * DTO для запроса анализа фото ДО/ПОСЛЕ
 */
export class AnalyzeBeforeAfterPhotosDto {
  @ApiProperty({
    description: 'Ключ задачи в Jira',
    example: 'KAN-123',
  })
  @IsNotEmpty()
  @IsString()
  taskKey: string;

  @ApiProperty({
    description: 'Фотография ДО стрижки',
    type: BeforeAfterPhotoDto,
  })
  @ValidateNested()
  @Type(() => BeforeAfterPhotoDto)
  beforePhoto: BeforeAfterPhotoDto;

  @ApiProperty({
    description: 'Фотография ПОСЛЕ стрижки',
    type: BeforeAfterPhotoDto,
  })
  @ValidateNested()
  @Type(() => BeforeAfterPhotoDto)
  afterPhoto: BeforeAfterPhotoDto;

  @ApiProperty({
    description: 'Время работы в минутах',
    example: 45,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  timeInProgress?: number;
}

/**
 * DTO результата анализа качества
 */
export class QualityAnalysisDto {
  @ApiProperty({ description: 'Общая оценка', example: 8.5 })
  overallScore: number;

  @ApiProperty({ description: 'Ровность стрижки', example: 8 })
  evenness: number;

  @ApiProperty({ description: 'Качество переходов', example: 9 })
  transitions: number;

  @ApiProperty({ description: 'Симметрия', example: 8 })
  symmetry: number;

  @ApiProperty({ description: 'Чистота работы', example: 9 })
  cleanliness: number;

  @ApiProperty({ description: 'Соответствие стилю', example: 8 })
  styleCompliance: number;
}

/**
 * DTO результата анализа трансформации
 */
export class TransformationAnalysisDto {
  @ApiProperty({
    description: 'Определенная категория стрижки',
    example: 'Обычная стрижка',
    enum: ['Быстрая стрижка', 'Обычная стрижка', 'Сложная стрижка'],
  })
  category: 'Быстрая стрижка' | 'Обычная стрижка' | 'Сложная стрижка';

  @ApiProperty({ description: 'Уровень сложности (1-10)', example: 6 })
  difficultyLevel: number;

  @ApiProperty({
    description: 'Визуальные изменения',
    example: ['Укорочены виски', 'Сделаны переходы', 'Оформлена челка'],
  })
  visualChanges: string[];

  @ApiProperty({
    description: 'Техника выполнения',
    example: 'Машинка + ножницы, переходы',
  })
  technique: string;
}

/**
 * DTO результата анализа времени
 */
export class TimeAnalysisDto {
  @ApiProperty({ description: 'Потрачено минут', example: 45 })
  actualMinutes: number;

  @ApiProperty({ description: 'Ожидаемый диапазон', example: '30-60 мин' })
  expectedRange: string;

  @ApiProperty({
    description: 'Оценка эффективности',
    example: 'good',
    enum: ['excellent', 'good', 'acceptable', 'slow'],
  })
  efficiency: 'excellent' | 'good' | 'acceptable' | 'slow';
}

/**
 * DTO итогового отчета
 */
export class ReportDto {
  @ApiProperty({
    description: 'Краткое резюме',
    example: 'Качественная стрижка, выполнена в срок',
  })
  summary: string;

  @ApiProperty({
    description: 'Достоинства работы',
    example: ['Отличные переходы', 'Аккуратная работа'],
  })
  strengths: string[];

  @ApiProperty({
    description: 'Рекомендации для улучшения',
    example: ['Более внимательно к симметрии'],
  })
  improvements: string[];

  @ApiProperty({ description: 'Итоговая цена', example: 1200 })
  finalPrice: number;
}

/**
 * DTO полного результата анализа ДО/ПОСЛЕ
 */
export class BeforeAfterAnalysisResultDto {
  @ApiProperty({ description: 'Успешность операции' })
  success: boolean;

  @ApiProperty({ description: 'Ключ задачи' })
  taskKey: string;

  @ApiProperty({
    description: 'Анализ трансформации',
    type: TransformationAnalysisDto,
  })
  @ValidateNested()
  @Type(() => TransformationAnalysisDto)
  transformation: TransformationAnalysisDto;

  @ApiProperty({
    description: 'Анализ качества',
    type: QualityAnalysisDto,
  })
  @ValidateNested()
  @Type(() => QualityAnalysisDto)
  quality: QualityAnalysisDto;

  @ApiProperty({
    description: 'Анализ времени',
    type: TimeAnalysisDto,
  })
  @ValidateNested()
  @Type(() => TimeAnalysisDto)
  timeAnalysis: TimeAnalysisDto;

  @ApiProperty({
    description: 'Итоговый отчет',
    type: ReportDto,
  })
  @ValidateNested()
  @Type(() => ReportDto)
  report: ReportDto;

  @ApiProperty({
    description: 'Сообщение об ошибке (если есть)',
    required: false,
  })
  @IsOptional()
  @IsString()
  error?: string;
}
