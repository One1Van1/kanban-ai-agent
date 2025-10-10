import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export enum ReactionType {
  LIKE = 'like',
  DISLIKE = 'dislike',
  HEART = 'heart',
  LAUGH = 'laugh',
  SURPRISED = 'surprised',
  ANGRY = 'angry',
  THUMBS_UP = 'thumbs_up',
  THUMBS_DOWN = 'thumbs_down',
  CELEBRATE = 'celebrate',
  CONFUSED = 'confused',
}

export class AddCommentReactionRequestDto {
  @ApiProperty({
    enum: ReactionType,
    enumName: 'ReactionType',
    description: 'Type of emoji reaction to add',
    example: ReactionType.LIKE,
  })
  @IsEnum(ReactionType)
  @IsNotEmpty()
  reactionType: ReactionType;

  @ApiProperty({
    description: 'UUID of the user adding the reaction',
    example: 'user-123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({
    description: 'Optional custom emoji for reaction',
    example: '🚀',
    maxLength: 10,
  })
  @IsString()
  @IsOptional()
  customEmoji?: string;

  @ApiPropertyOptional({
    description: 'Optional context or note for the reaction',
    example: 'Great point!',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  reactionNote?: string;
}
