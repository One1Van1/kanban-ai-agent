import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class UploadAttachmentRequestDto {
  @ApiProperty({
    description: 'File name with extension',
    example: 'requirements.pdf',
  })
  @IsString()
  fileName: string;

  @ApiProperty({
    description: 'File MIME type',
    example: 'application/pdf',
  })
  @IsString()
  mimeType: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 1024000,
    minimum: 1,
    maximum: 10485760, // 10MB
  })
  @IsNumber()
  @Min(1)
  @Max(10485760)
  fileSize: number;

  @ApiProperty({
    description: 'Base64 encoded file content',
    example: 'JVBERi0xLjQKJcOkw7zDtsO...',
  })
  @IsString()
  fileContent: string;

  @ApiProperty({
    description: 'User who uploaded the file',
    example: 'agent-001',
  })
  @IsString()
  uploadedBy: string;

  @ApiProperty({
    description: 'Optional description of the attachment',
    example: 'Updated project requirements document',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
