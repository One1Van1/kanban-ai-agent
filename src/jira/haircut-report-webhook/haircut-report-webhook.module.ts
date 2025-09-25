import { Module } from '@nestjs/common';
import { HaircutReportWebhookController } from './haircut-report-webhook.controller';
import { HaircutReportWebhookService } from './haircut-report-webhook.service';
import { ProcessHaircutTaskModule } from '../../ai-agent/process-haircut-task/process-haircut-task.module';

@Module({
  imports: [ProcessHaircutTaskModule],
  controllers: [HaircutReportWebhookController],
  providers: [HaircutReportWebhookService],
  exports: [HaircutReportWebhookService],
})
export class HaircutReportWebhookModule {}
