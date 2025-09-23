import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

// Импорт всех endpoint модулей
import { AnalyzeNewTasksModule } from './analyze-new-tasks/analyze-new-tasks.module';
import { CheckProgressTasksModule } from './check-progress-tasks/check-progress-tasks.module';
import { CheckEntityExistsModule } from './check-entity-exists/check-entity-exists.module';
import { ExecuteTasksModule } from './execute-tasks/execute-tasks.module';
import { RunAutoWorkflowModule } from './run-auto-workflow/run-auto-workflow.module';
import { AnalyzeHaircutTasksModule } from './analyze-haircut-tasks/analyze-haircut-tasks.module';
import { AutoHaircutMonitorModule } from './auto-haircut-monitor/auto-haircut-monitor.module';
import { SharedModule } from './shared/shared.module';

// Shared сервисы уже в SharedModule

@Module({
  imports: [
    ConfigModule,
    ScheduleModule.forRoot(), // Для cron jobs
    AnalyzeNewTasksModule,
    CheckProgressTasksModule,
    CheckEntityExistsModule,
    ExecuteTasksModule,
    RunAutoWorkflowModule,
    AnalyzeHaircutTasksModule,
    AutoHaircutMonitorModule,
    SharedModule,
  ],
  providers: [],
  exports: [
    AnalyzeNewTasksModule,
    CheckProgressTasksModule,
    CheckEntityExistsModule,
    ExecuteTasksModule,
    RunAutoWorkflowModule,
    AnalyzeHaircutTasksModule,
    AutoHaircutMonitorModule,
  ],
})
export class AiAgentModule {}
