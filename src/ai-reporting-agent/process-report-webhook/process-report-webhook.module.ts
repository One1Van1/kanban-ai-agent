import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProcessReportWebhookController } from './process-report-webhook.controller';
import { ProcessReportWebhookService } from './process-report-webhook.service';
import { GenerateReportModule } from '../generate-report/generate-report.module';

@Module({
  imports: [ConfigModule, GenerateReportModule],
  controllers: [ProcessReportWebhookController],
  providers: [ProcessReportWebhookService],
  exports: [ProcessReportWebhookService],
})
export class ProcessReportWebhookModule {}
