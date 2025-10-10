import { ApiProperty } from '@nestjs/swagger';

export class SendEmailResponseDto {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Message ID from email service',
    example: '12345-abcde-67890',
  })
  messageId: string;

  @ApiProperty({
    description: 'Response message',
    example: 'Email sent successfully',
  })
  message: string;

  constructor(success: boolean, messageId: string, message: string) {
    this.success = success;
    this.messageId = messageId;
    this.message = message;
  }
}
