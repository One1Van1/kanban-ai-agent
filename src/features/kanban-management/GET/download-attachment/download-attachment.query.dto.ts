import { IsOptional, IsBoolean, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class DownloadAttachmentQueryDto {
  @ApiPropertyOptional({
    description: 'Whether to force download instead of inline display',
    default: false,
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  forceDownload?: boolean = false;

  @ApiPropertyOptional({
    description: 'Custom filename for the download',
    example: 'my-custom-filename.pdf',
  })
  @IsString()
  @IsOptional()
  filename?: string;

  @ApiPropertyOptional({
    description: 'User requesting the download (for audit logging)',
    example: 'user-123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsOptional()
  requestedBy?: string;
}
