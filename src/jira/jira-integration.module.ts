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

// Time Validation Webhook
import { TimeValidationWebhookModule } from './time-validation-webhook/time-validation-webhook.module';

@Module({
  imports: [ConfigModule, TimeValidationWebhookModule],
  controllers: [
    HealthCheckController,
    GetTaskController,
    MoveTaskController,
    GetTaskTransitionsController,
    GetColumnTasksController,
    SearchTasksController,
    AddTaskCommentController,
    AttachFileController,
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
  ],
})
export class JiraModule {}
