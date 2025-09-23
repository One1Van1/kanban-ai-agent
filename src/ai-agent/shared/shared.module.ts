import { Module } from '@nestjs/common';
import { AiAgentSchedulerService } from './ai-agent-scheduler.service';
import { RunAutoWorkflowModule } from '../run-auto-workflow/run-auto-workflow.module';
import { AnalyzeHaircutTasksModule } from '../analyze-haircut-tasks/analyze-haircut-tasks.module';
import { ExecuteHaircutTasksModule } from '../execute-haircut-tasks/execute-haircut-tasks.module';

@Module({
  imports: [
    RunAutoWorkflowModule,
    AnalyzeHaircutTasksModule,
    ExecuteHaircutTasksModule,
  ],
  providers: [AiAgentSchedulerService],
  exports: [AiAgentSchedulerService],
})
export class SharedModule {}
