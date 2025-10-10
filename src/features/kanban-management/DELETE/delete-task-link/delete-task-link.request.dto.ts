import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class DeleteTaskLinkRequestDto {
  @ApiPropertyOptional({
    description: 'User performing the link deletion',
    example: 'user-123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsOptional()
  deletedBy?: string;

  @ApiPropertyOptional({
    description: 'Reason for deleting the task link',
    example: 'Link is no longer relevant after task completion',
  })
  @IsString()
  @IsOptional()
  deleteReason?: string;
}
