import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Health Check
import { HealthCheckController } from './health-check/health-check.controller';
import { HealthCheckService } from './health-check/health-check.service';

// Get Task
import { GetTaskController } from './get-task/get-task.controller';
import { GetTaskService } from './get-task/get-task.service';

// Move Task
import { MoveTaskController } from './move-task/move-task.controller';
import { MoveTaskService } from './move-task/move-task.service';

// Get Task Transitions
import { GetTaskTransitionsController } from './get-task-transitions/get-task-transitions.controller';
import { GetTaskTransitionsService } from './get-task-transitions/get-task-transitions.service';

// Get Column Tasks
import { GetColumnTasksController } from './get-column-tasks/get-column-tasks.controller';
import { GetColumnTasksService } from './get-column-tasks/get-column-tasks.service';

// Search Tasks
import { SearchTasksController } from './search-tasks/search-tasks.controller';
import { SearchTasksService } from './search-tasks/search-tasks.service';

// Add Task Comment
import { AddTaskCommentController } from './add-task-comment/add-task-comment.controller';
import { AddTaskCommentService } from './add-task-comment/add-task-comment.service';

// Attach File
import { AttachFileController } from './attach-file/attach-file.controller';
import { AttachFileService } from './attach-file/attach-file.service';

// Jira Webhook Handler - ЗАКОММЕНТИРОВАНО (СЛОМАН)
// import { JiraWebhookHandlerController } from './jira-webhook-handler/jira-webhook-handler.controller';
// import { JiraWebhookHandlerService } from './jira-webhook-handler/jira-webhook-handler.service';

// Haircut Report Webhook
import { HaircutReportWebhookController } from './haircut-report-webhook/haircut-report-webhook.controller';
import { HaircutReportWebhookService } from './haircut-report-webhook/haircut-report-webhook.service';

// Time Validation Webhook
import { TimeValidationWebhookModule } from './time-validation-webhook/time-validation-webhook.module';

// Process Webhook Before/After - НОВЫЙ WEBHOOK ДЛЯ ФОТО АНАЛИЗА
import { ProcessWebhookBeforeAfterModule } from './process-webhook-before-after/process-webhook-before-after.module';

// AI Reporting Agent for integration
import { AnalyzeCompletedHaircutTasksModule } from '../ai-reporting-agent/analyze-completed-haircut-tasks/analyze-completed-haircut-tasks.module';
import { ProcessHaircutTaskModule } from '../ai-agent/process-haircut-task/process-haircut-task.module';

@Module({
  imports: [
    ConfigModule,
    AnalyzeCompletedHaircutTasksModule,
    ProcessHaircutTaskModule,
    TimeValidationWebhookModule,
    ProcessWebhookBeforeAfterModule,
  ],
  controllers: [
    HealthCheckController,
    GetTaskController,
    MoveTaskController,
    GetTaskTransitionsController,
    GetColumnTasksController,
    SearchTasksController,
    AddTaskCommentController,
    AttachFileController,
    // JiraWebhookHandlerController, // ЗАКОММЕНТИРОВАНО (СЛОМАН)
    HaircutReportWebhookController,
  ],
  providers: [
    HealthCheckService,
    GetTaskService,
    MoveTaskService,
    GetTaskTransitionsService,
    GetColumnTasksService,
    SearchTasksService,
    AddTaskCommentService,
    AttachFileService,
    // JiraWebhookHandlerService, // ЗАКОММЕНТИРОВАНО (СЛОМАН)
    HaircutReportWebhookService,
  ],
  exports: [
    HealthCheckService,
    GetTaskService,
    MoveTaskService,
    GetTaskTransitionsService,
    GetColumnTasksService,
    SearchTasksService,
    AddTaskCommentService,
    AttachFileService,
    // JiraWebhookHandlerService, // ЗАКОММЕНТИРОВАНО (СЛОМАН)
    HaircutReportWebhookService,
  ],
})
export class JiraModule {}
