import { IsOptional, IsString } from 'class-validator';

export class AttachFileDto {
  @IsOptional()
  @IsString()
  filePath?: string;

  @IsOptional()
  @IsString()
  filename?: string;
}
