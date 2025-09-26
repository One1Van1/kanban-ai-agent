import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PhotoAttachmentDto {
  @ApiProperty({
    description: 'URL фото стрижки',
    example: 'https://example.com/haircut.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiProperty({
    description: 'Имя файла',
    example: 'haircut_result.jpg',
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
  size?: number;

  @ApiProperty({
    description: 'Base64 контент изображения',
    example: 'iVBORw0KGgoAAAANSUhEUgAAA...',
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;
}

export class AnalyzeHaircutPhotoDto {
  @ApiProperty({
    description: 'Ключ задачи в Jira',
    example: 'KAN-17',
  })
  @IsNotEmpty()
  @IsString()
  taskKey: string;

  @ApiProperty({
    description: 'Заявленная категория стрижки',
    example: 'Обычная стрижка',
  })
  @IsNotEmpty()
  @IsString()
  declaredCategory: string;

  @ApiProperty({
    description: 'Фотографии для анализа',
    type: [PhotoAttachmentDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PhotoAttachmentDto)
  photos: PhotoAttachmentDto[];

  @ApiProperty({
    description: 'Дополнительная информация о стрижке',
    required: false,
  })
  @IsOptional()
  @IsString()
  additionalInfo?: string;
}
