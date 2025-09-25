import { Module } from '@nestjs/common';
import { HaircutReportWebhookController } from './haircut-report-webhook.controller';
import { HaircutReportWebhookService } from './haircut-report-webhook.service';

@Module({
  imports: [],
  controllers: [HaircutReportWebhookController],
  providers: [HaircutReportWebhookService],
  exports: [HaircutReportWebhookService],
})
export class HaircutReportWebhookModule {}
