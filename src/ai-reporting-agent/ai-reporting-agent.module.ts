import { Module } from '@nestjs/common';
import { GenerateReportModule } from './generate-report/generate-report.module';
import { ProcessReportWebhookModule } from './process-report-webhook/process-report-webhook.module';

@Module({
  imports: [GenerateReportModule, ProcessReportWebhookModule],
  exports: [GenerateReportModule, ProcessReportWebhookModule],
})
export class AiReportingAgentModule {}
