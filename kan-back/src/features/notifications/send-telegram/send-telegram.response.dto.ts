import { ApiProperty } from '@nestjs/swagger';

export class SendTelegramResponseDto {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Message ID from Telegram',
    example: 123,
  })
  messageId?: number;

  @ApiProperty({
    description: 'Response message',
    example: 'Telegram message sent successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Chat ID where message was sent',
    example: '123456789',
  })
  chatId?: string;

  constructor(
    success: boolean,
    message: string,
    messageId?: number,
    chatId?: string,
  ) {
    this.success = success;
    this.message = message;
    this.messageId = messageId;
    this.chatId = chatId;
  }
}
