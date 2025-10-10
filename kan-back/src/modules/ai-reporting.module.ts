import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { BullModule } from '@nestjs/bull'; // не используется
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from '../entities/agent.entity';
import { AgentInstruction } from '../entities/agent-instruction.entity';
import { TaskHistory } from '../entities/task-history.entity';

// Stable services (dependencies)
import { SearchTasksService } from '../features/jira-integration/search-tasks-correct/search-tasks.service';
import { AddTaskCommentService } from '../features/jira-integration/add-task-comment/add-task-comment.service';
import { MoveTaskService } from '../features/jira-integration/move-task-correct/move-task.service';

// Controllers
import { GenerateReportController } from '../features/ai-reporting/generate-report/generate-report.controller';
import { GetReportConfigController } from '../features/ai-reporting/get-report-config/get-report-config.controller';
import { GetReportHealthController } from '../features/ai-reporting/get-report-health/get-report-health.controller';
import { ProcessReportTaskController } from '../features/ai-reporting/process-report-task/process-report-task.controller';

// Services
import { GenerateReportService } from '../features/ai-reporting/generate-report/generate-report.service';
import { GetReportConfigService } from '../features/ai-reporting/get-report-config/get-report-config.service';
import { GetReportHealthService } from '../features/ai-reporting/get-report-health/get-report-health.service';
import { ProcessReportTaskService } from '../features/ai-reporting/process-report-task/process-report-task.service';

@Module({
  imports: [ConfigModule],
  controllers: [
    GenerateReportController,
    GetReportConfigController,
    GetReportHealthController,
    ProcessReportTaskController,
  ],
  providers: [
    GenerateReportService,
    GetReportConfigService,
    GetReportHealthService,
    ProcessReportTaskService,
    SearchTasksService,
    AddTaskCommentService,
    MoveTaskService,
  ],
  exports: [
    GenerateReportService,
    GetReportConfigService,
    GetReportHealthService,
    ProcessReportTaskService,
    SearchTasksService,
    AddTaskCommentService,
    MoveTaskService,
  ],
})
export class AiReportingModule {}
