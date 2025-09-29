import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProcessReportWebhookDto {
  @ApiProperty({
    description: 'Webhook event type from Jira',
    example: 'jira:issue_updated',
  })
  @IsString()
  webhookEvent: string;

  @ApiProperty({
    description: 'Task key that triggered the webhook',
    example: 'KAN-33',
  })
  @IsString()
  @IsOptional()
  taskKey?: string;

  @ApiProperty({
    description: 'Full webhook payload from Jira',
  })
  @IsObject()
  @IsOptional()
  payload?: any;
}
