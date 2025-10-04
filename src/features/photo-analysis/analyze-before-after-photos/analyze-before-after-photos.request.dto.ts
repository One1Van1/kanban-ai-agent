import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AnalyzeBeforeAfterPhotosRequestDto {
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
