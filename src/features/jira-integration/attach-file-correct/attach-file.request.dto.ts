import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AttachFileRequestDto {
  @ApiProperty({
    description: 'Путь к файлу',
    example: '/path/to/file.pdf',
    required: false,
  })
  @IsOptional()
  @IsString()
  filePath?: string;

  @ApiProperty({
    description: 'Имя файла',
    example: 'document.pdf',
    required: false,
  })
  @IsOptional()
  @IsString()
  filename?: string;
}
