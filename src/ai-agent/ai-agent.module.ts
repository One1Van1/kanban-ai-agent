import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

// Импорт всех endpoint модулей
// import { AnalyzeNewTasksModule } from './analyze-new-tasks/analyze-new-tasks.module';
// import { CheckProgressTasksModule } from './check-progress-tasks/check-progress-tasks.module';
// import { CheckEntityExistsModule } from './check-entity-exists/check-entity-exists.module';
// import { ExecuteTasksModule } from './execute-tasks/execute-tasks.module';
// import { RunAutoWorkflowModule } from './run-auto-workflow/run-auto-workflow.module';
import { AnalyzeHaircutTasksModule } from './analyze-haircut-tasks/analyze-haircut-tasks.module';
import { ExecuteHaircutTasksModule } from './execute-haircut-tasks/execute-haircut-tasks.module';
import { ProcessHaircutTaskModule } from './process-haircut-task/process-haircut-task.module';
// import { AutoHaircutMonitorModule } from './auto-haircut-monitor/auto-haircut-monitor.module';
// Новые специализированные модули для стрижек
// import { AnalyzeNewHaircutTasksModule } from './analyze-new-haircut-tasks/analyze-new-haircut-tasks.module';
// import { CheckHaircutProgressModule } from './check-haircut-progress/check-haircut-progress.module';
import { SharedModule } from './shared/shared.module';

// Shared сервисы уже в SharedModule

@Module({
  imports: [
    ConfigModule,
    ScheduleModule.forRoot(), // Для cron jobs

    // // Общие модули (без сценариев стрижек)
    // AnalyzeNewTasksModule,
    // CheckProgressTasksModule,
    // CheckEntityExistsModule,
    // ExecuteTasksModule,
    // RunAutoWorkflowModule,

    // Специализированные модули только для стрижек
    AnalyzeHaircutTasksModule,
    ExecuteHaircutTasksModule,
    ProcessHaircutTaskModule,
    // AutoHaircutMonitorModule,
    // AnalyzeNewHaircutTasksModule,
    // CheckHaircutProgressModule,

    SharedModule,
  ],
  providers: [],
  exports: [
    // // Общие модули
    // AnalyzeNewTasksModule,
    // CheckProgressTasksModule,
    // CheckEntityExistsModule,
    // ExecuteTasksModule,
    // RunAutoWorkflowModule,

    // Модули для стрижек
    AnalyzeHaircutTasksModule,
    ExecuteHaircutTasksModule,
    ProcessHaircutTaskModule,
    // AutoHaircutMonitorModule,
    // AnalyzeNewHaircutTasksModule,
    // CheckHaircutProgressModule,
  ],
})
export class AiAgentModule {}
