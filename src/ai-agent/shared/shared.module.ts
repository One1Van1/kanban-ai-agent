import { Module } from '@nestjs/common';
import { AiAgentSchedulerService } from './ai-agent-scheduler.service';
import { RunAutoWorkflowModule } from '../run-auto-workflow/run-auto-workflow.module';
import { AnalyzeHaircutTasksModule } from '../analyze-haircut-tasks/analyze-haircut-tasks.module';

@Module({
  imports: [RunAutoWorkflowModule, AnalyzeHaircutTasksModule],
  providers: [AiAgentSchedulerService],
  exports: [AiAgentSchedulerService],
})
export class SharedModule {}
