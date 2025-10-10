import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum CommentDeleteMode {
  SOFT_DELETE = 'SOFT_DELETE',
  HARD_DELETE = 'HARD_DELETE',
}

export class DeleteCommentRequestDto {
  @ApiProperty({
    description: 'Mode of comment deletion',
    enum: CommentDeleteMode,
    enumName: 'CommentDeleteMode',
    example: CommentDeleteMode.SOFT_DELETE,
  })
  @IsEnum(CommentDeleteMode)
  @IsOptional()
  deleteMode?: CommentDeleteMode = CommentDeleteMode.SOFT_DELETE;

  @ApiPropertyOptional({
    description: 'User performing the comment deletion',
    example: 'user-123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsOptional()
  deletedBy?: string;

  @ApiPropertyOptional({
    description: 'Reason for deleting the comment',
    example: 'Comment violates community guidelines',
  })
  @IsString()
  @IsOptional()
  deleteReason?: string;
}
