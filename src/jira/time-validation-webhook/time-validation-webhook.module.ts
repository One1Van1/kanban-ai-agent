import { Module } from '@nestjs/common';
import { TimeValidationWebhookController } from './time-validation-webhook.controller';
import { TimeValidationWebhookService } from './time-validation-webhook.service';
import { HaircutReportWebhookModule } from '../haircut-report-webhook/haircut-report-webhook.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, HaircutReportWebhookModule],
  controllers: [TimeValidationWebhookController],
  providers: [TimeValidationWebhookService],
  exports: [TimeValidationWebhookService],
})
export class TimeValidationWebhookModule {}
