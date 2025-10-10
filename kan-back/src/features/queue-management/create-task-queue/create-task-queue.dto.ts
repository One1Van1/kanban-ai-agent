import {
  IsString,
  IsOptional,
  IsObject,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum TaskPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export class CreateTaskQueueRequestDto {
  @ApiProperty({ description: 'Unique task identifier' })
  @IsString()
  taskId: string;

  @ApiProperty({ description: 'Type of task to process' })
  @IsString()
  taskType: string;

  @ApiProperty({ description: 'Task data payload' })
  @IsObject()
  data: any;

  @ApiPropertyOptional({ enum: TaskPriority, default: TaskPriority.NORMAL })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiPropertyOptional({
    description: 'Delay in milliseconds before processing',
  })
  @IsNumber()
  @IsOptional()
  delay?: number;

  @ApiPropertyOptional({ description: 'Maximum number of retry attempts' })
  @IsNumber()
  @IsOptional()
  attempts?: number;
}

export class CreateTaskQueueResponseDto {
  @ApiProperty({ description: 'Success status' })
  success: boolean;

  @ApiProperty({ description: 'Queue job ID' })
  jobId: string;

  @ApiProperty({ description: 'Task ID' })
  taskId: string;

  @ApiProperty({ description: 'Queue name' })
  queueName: string;

  @ApiProperty({ description: 'Response message' })
  message: string;
}
