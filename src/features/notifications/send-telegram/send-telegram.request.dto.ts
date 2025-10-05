import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class SendTelegramRequestDto {
  @ApiProperty({
    description: 'Telegram chat ID or username',
    example: '123456789',
  })
  @IsString()
  chatId: string;

  @ApiProperty({
    description: 'Message text to send',
    example: 'Task notification: Your task has been updated',
  })
  @IsString()
  text: string;

  @ApiProperty({
    description: 'Parse mode for message formatting',
    example: 'HTML',
    enum: ['HTML', 'Markdown', 'MarkdownV2'],
    required: false,
  })
  @IsOptional()
  @IsString()
  parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2';

  @ApiProperty({
    description: 'Disable web page preview',
    example: true,
    required: false,
  })
  @IsOptional()
  disableWebPagePreview?: boolean;

  @ApiProperty({
    description: 'Send message silently',
    example: false,
    required: false,
  })
  @IsOptional()
  disableNotification?: boolean;
}
