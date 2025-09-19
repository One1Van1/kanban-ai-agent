import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { AIAnalysisModule } from '../ai-analysis';
import { KanbanModule } from '../kanban';

@Module({
  imports: [AIAnalysisModule, KanbanModule],
  controllers: [WebhookController],
  providers: [WebhookService],
  exports: [WebhookService],
})
export class WebhookModule {}
