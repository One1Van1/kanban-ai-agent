import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { IBeforeAfterAnalysis } from './claude-vision.service';

export class AnalyzeBeforeAfterPhotosDto {
  @ApiProperty({
    description: 'Ключ задачи в Jira',
    example: 'KAN-123',
  })
  @IsString()
  @IsNotEmpty()
  taskKey: string;

  @ApiProperty({
    description: 'Base64 содержимое фото ДО стрижки',
    example: '/9j/4AAQSkZJRgABAQEAYABgAAD...',
  })
  @IsString()
  @IsNotEmpty()
  beforePhoto: string;

  @ApiProperty({
    description: 'Base64 содержимое фото ПОСЛЕ стрижки',
    example: '/9j/4AAQSkZJRgABAQEAYABgAAD...',
  })
  @IsString()
  @IsNotEmpty()
  afterPhoto: string;

  @ApiProperty({
    description: 'Заявленная категория стрижки',
    example: 'Женская стрижка',
    required: false,
  })
  @IsString()
  @IsOptional()
  declaredCategory?: string;
}

export class AnalyzeBeforeAfterPhotosResponseDto {
  @ApiProperty({
    description: 'Успешность выполнения анализа',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Сообщение о результате',
    example: 'Before/after analysis completed successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Результат анализа от Claude',
    required: false,
  })
  analysis: IBeforeAfterAnalysis | null;

  @ApiProperty({
    description: 'Описание ошибки (если произошла)',
    required: false,
  })
  error?: string;
}
