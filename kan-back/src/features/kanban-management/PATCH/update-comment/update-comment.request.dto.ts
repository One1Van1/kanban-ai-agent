import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCommentRequestDto {
  @ApiProperty({
    description: 'Updated comment text content',
    minLength: 1,
    maxLength: 2000,
    example:
      'Updated: This is the corrected analysis of the issue. The problem was in the validation logic.',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  content: string;

  @ApiPropertyOptional({
    description: 'User performing the comment update',
    example: 'user-123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsOptional()
  updatedBy?: string;

  @ApiPropertyOptional({
    description: 'Reason for updating the comment',
    example: 'Fixed typo and added clarification',
  })
  @IsString()
  @IsOptional()
  updateReason?: string;
}
