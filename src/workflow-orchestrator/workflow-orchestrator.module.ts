import { Module } from '@nestjs/common';
import { WorkflowOrchestratorService } from './workflow-orchestrator.service';
import { EnhancedWorkflowService } from '../enhanced-workflow/enhanced-workflow.service';
import { StatusTransitionsModule } from '../status-transitions/status-transitions.module';
import { WebhookModule } from '../webhook';
import { AIAnalysisModule } from '../ai-analysis';
import { KanbanModule } from '../kanban';
import { TaskExecutorModule } from '../task-executor/task-executor.module';

@Module({
  imports: [
    StatusTransitionsModule,
    WebhookModule,
    AIAnalysisModule,
    KanbanModule,
    TaskExecutorModule,
  ],
  providers: [WorkflowOrchestratorService, EnhancedWorkflowService],
  exports: [WorkflowOrchestratorService],
})
export class WorkflowOrchestratorModule {}
