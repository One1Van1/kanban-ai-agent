import { Module } from '@nestjs/common';
import { TimeValidationWebhookController } from './time-validation-webhook.controller';
import { TimeValidationWebhookService } from './time-validation-webhook.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [TimeValidationWebhookController],
  providers: [TimeValidationWebhookService],
  exports: [TimeValidationWebhookService],
})
export class TimeValidationWebhookModule {}
