import { Module } from '@nestjs/common';
import { KanbanAgentService } from './kanban-agent.service';
import { KanbanAgentController } from './kanban-agent.controller';
import { JiraModule } from '../jira/jira.module';
import { AIAnalysisModule } from '../ai-analysis/ai-analysis.module';
import { TaskExecutorModule } from '../task-executor/task-executor.module';

@Module({
  imports: [JiraModule, AIAnalysisModule, TaskExecutorModule],
  providers: [KanbanAgentService],
  controllers: [KanbanAgentController],
  exports: [KanbanAgentService],
})
export class KanbanAgentModule {}
