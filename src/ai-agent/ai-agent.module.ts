import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

// Импорт всех endpoint модулей
import { AnalyzeNewTasksModule } from './analyze-new-tasks/analyze-new-tasks.module';
import { CheckProgressTasksModule } from './check-progress-tasks/check-progress-tasks.module';
import { CheckEntityExistsModule } from './check-entity-exists/check-entity-exists.module';
import { RunAutoWorkflowModule } from './run-auto-workflow/run-auto-workflow.module';

// Shared сервисы
import { AiAgentSchedulerService } from './shared/ai-agent-scheduler.service';

@Module({
  imports: [
    ConfigModule,
    ScheduleModule.forRoot(), // Для cron jobs
    AnalyzeNewTasksModule,
    CheckProgressTasksModule,
    CheckEntityExistsModule,
    RunAutoWorkflowModule,
  ],
  providers: [AiAgentSchedulerService],
  exports: [
    AnalyzeNewTasksModule,
    CheckProgressTasksModule,
    CheckEntityExistsModule,
    RunAutoWorkflowModule,
  ],
})
export class AiAgentModule {}
