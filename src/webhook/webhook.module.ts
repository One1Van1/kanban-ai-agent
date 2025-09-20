import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { AIAnalysisModule } from '../ai-analysis';
import { KanbanModule } from '../kanban';
import { TaskExecutorModule } from '../task-executor/task-executor.module';

@Module({
  imports: [AIAnalysisModule, KanbanModule, TaskExecutorModule],
  controllers: [WebhookController],
  providers: [WebhookService],
  exports: [WebhookService],
})
export class WebhookModule {}
