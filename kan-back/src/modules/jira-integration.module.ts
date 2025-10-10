import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from '../entities/agent.entity';
import { AgentInstruction } from '../entities/agent-instruction.entity';

// Controllers
import { AddTaskCommentController } from '../features/jira-integration/add-task-comment/add-task-comment.controller';
import { AttachFileController } from '../features/jira-integration/attach-file-correct/attach-file.controller';
import { GetColumnTasksController } from '../features/jira-integration/get-column-tasks-correct/get-column-tasks.controller';
import { GetTaskController } from '../features/jira-integration/get-task-correct/get-task.controller';
import { GetTaskTransitionsController } from '../features/jira-integration/get-task-transitions-correct/get-task-transitions.controller';
import { HealthCheckController } from '../features/jira-integration/health-check-correct/health-check.controller';
import { JiraWebhookHandlerController } from '../features/jira-integration/jira-webhook-handler-correct/jira-webhook-handler.controller';
import { MoveTaskController } from '../features/jira-integration/move-task-correct/move-task.controller';
import { ProcessWebhookBeforeAfterController } from '../features/jira-integration/process-webhook-before-after/process-webhook-before-after.controller';
import { SearchTasksController } from '../features/jira-integration/search-tasks-correct/search-tasks.controller';
import { TimeValidationWebhookController } from '../features/jira-integration/time-validation-webhook-correct/time-validation-webhook.controller';

// Services
import { AddTaskCommentService } from '../features/jira-integration/add-task-comment/add-task-comment.service';
import { AttachFileService } from '../features/jira-integration/attach-file-correct/attach-file.service';
import { GetColumnTasksService } from '../features/jira-integration/get-column-tasks-correct/get-column-tasks.service';
import { GetTaskService } from '../features/jira-integration/get-task-correct/get-task.service';
import { GetTaskTransitionsService } from '../features/jira-integration/get-task-transitions-correct/get-task-transitions.service';
import { HealthCheckService } from '../features/jira-integration/health-check-correct/health-check.service';
import { JiraWebhookHandlerService } from '../features/jira-integration/jira-webhook-handler-correct/jira-webhook-handler.service';
import { MoveTaskService } from '../features/jira-integration/move-task-correct/move-task.service';
import { ProcessWebhookBeforeAfterService } from '../features/jira-integration/process-webhook-before-after/process-webhook-before-after.service';
import { SearchTasksService } from '../features/jira-integration/search-tasks-correct/search-tasks.service';
import { TimeValidationWebhookService } from '../features/jira-integration/time-validation-webhook-correct/time-validation-webhook.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Agent, AgentInstruction])],
  controllers: [
    AddTaskCommentController,
    AttachFileController,
    GetColumnTasksController,
    GetTaskController,
    GetTaskTransitionsController,
    HealthCheckController,
    JiraWebhookHandlerController,
    MoveTaskController,
    ProcessWebhookBeforeAfterController,
    SearchTasksController,
    TimeValidationWebhookController,
  ],
  providers: [
    AddTaskCommentService,
    AttachFileService,
    GetColumnTasksService,
    GetTaskService,
    GetTaskTransitionsService,
    HealthCheckService,
    JiraWebhookHandlerService,
    MoveTaskService,
    ProcessWebhookBeforeAfterService,
    SearchTasksService,
    TimeValidationWebhookService,
  ],
  exports: [
    AddTaskCommentService,
    AttachFileService,
    GetColumnTasksService,
    GetTaskService,
    GetTaskTransitionsService,
    HealthCheckService,
    JiraWebhookHandlerService,
    MoveTaskService,
    ProcessWebhookBeforeAfterService,
    SearchTasksService,
    TimeValidationWebhookService,
  ],
})
export class JiraIntegrationModule {}
