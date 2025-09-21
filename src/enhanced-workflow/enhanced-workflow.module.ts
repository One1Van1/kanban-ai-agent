import { Module } from '@nestjs/common';
import { EnhancedWorkflowService } from './enhanced-workflow.service';
import { EnhancedWorkflowController } from './enhanced-workflow.controller';
import { WebhookModule } from '../webhook';
import { AIAnalysisModule } from '../ai-analysis';
import { KanbanModule } from '../kanban';
import { TaskExecutorModule } from '../task-executor/task-executor.module';
import { StatusTransitionsModule } from '../status-transitions/status-transitions.module';
import { WorkflowOrchestratorModule } from '../workflow-orchestrator/workflow-orchestrator.module';

@Module({
  imports: [
    WebhookModule,
    AIAnalysisModule,
    KanbanModule,
    TaskExecutorModule,
    StatusTransitionsModule,
    WorkflowOrchestratorModule,
  ],
  providers: [EnhancedWorkflowService],
  controllers: [EnhancedWorkflowController],
  exports: [EnhancedWorkflowService],
})
export class EnhancedWorkflowModule {}
