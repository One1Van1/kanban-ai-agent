import { Module } from '@nestjs/common';
import { RunAutoWorkflowController } from './run-auto-workflow.controller';
import { RunAutoWorkflowService } from './run-auto-workflow.service';
import { AnalyzeNewTasksModule } from '../analyze-new-tasks/analyze-new-tasks.module';
import { CheckProgressTasksModule } from '../check-progress-tasks/check-progress-tasks.module';
import { ExecuteTasksModule } from '../execute-tasks/execute-tasks.module';

@Module({
  imports: [
    AnalyzeNewTasksModule,
    CheckProgressTasksModule,
    ExecuteTasksModule,
  ],
  controllers: [RunAutoWorkflowController],
  providers: [RunAutoWorkflowService],
  exports: [RunAutoWorkflowService],
})
export class RunAutoWorkflowModule {}
