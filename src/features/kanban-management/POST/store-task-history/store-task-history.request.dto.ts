import {
  IsString,
  IsOptional,
  IsObject,
  IsUUID,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StoreTaskHistoryRequestDto {
  @ApiProperty({ example: 'uuid-string', description: 'ID агента' })
  @IsUUID()
  agentId: string;

  @ApiProperty({ example: 'TASK-123', description: 'ID задачи' })
  @IsString()
  taskId: string;

  @ApiProperty({ example: 'PROJ-123', description: 'Ключ задачи' })
  @IsString()
  taskKey: string;

  @ApiProperty({
    example: 'Implement user authentication',
    description: 'Заголовок задачи',
  })
  @IsString()
  taskTitle: string;

  @ApiProperty({ example: 'status_changed', description: 'Тип действия' })
  @IsString()
  action: string;

  @ApiProperty({
    example: 'To Do',
    description: 'Статус откуда',
    required: false,
  })
  @IsOptional()
  @IsString()
  fromStatus?: string;

  @ApiProperty({
    example: 'In Progress',
    description: 'Статус куда',
    required: false,
  })
  @IsOptional()
  @IsString()
  toStatus?: string;

  @ApiProperty({
    example: 'COLUMN_TODO',
    description: 'Колонка откуда',
    required: false,
  })
  @IsOptional()
  @IsString()
  fromColumn?: string;

  @ApiProperty({
    example: 'COLUMN_PROGRESS',
    description: 'Колонка куда',
    required: false,
  })
  @IsOptional()
  @IsString()
  toColumn?: string;

  @ApiProperty({ example: {}, description: 'Контекст задачи', required: false })
  @IsOptional()
  @IsObject()
  context?: Record<string, any>;

  @ApiProperty({ example: {}, description: 'Ответ агента', required: false })
  @IsOptional()
  @IsObject()
  agentResponse?: Record<string, any>;

  @ApiProperty({
    example: 'Analyze task and add estimates',
    description: 'Выполненная инструкция',
    required: false,
  })
  @IsOptional()
  @IsString()
  executedInstruction?: string;

  @ApiProperty({
    example: 'pending',
    description: 'Статус обработки',
    required: false,
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    example: 'Error message',
    description: 'Ошибка при обработке',
    required: false,
  })
  @IsOptional()
  @IsString()
  error?: string;

  @ApiProperty({
    example: 1500,
    description: 'Время обработки в миллисекундах',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  processingTimeMs?: number;
}
