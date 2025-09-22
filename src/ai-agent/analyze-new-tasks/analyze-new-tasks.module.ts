import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AnalyzeNewTasksController } from './analyze-new-tasks.controller';
import { AnalyzeNewTasksService } from './analyze-new-tasks.service';
import { GetColumnTasksService } from '../../jira/get-column-tasks/get-column-tasks.service';
import { MoveTaskService } from '../../jira/move-task/move-task.service';
import { AddTaskCommentService } from '../../jira/add-task-comment/add-task-comment.service';
import { CheckEntityExistsService } from '../check-entity-exists/check-entity-exists.service';

@Module({
  imports: [ConfigModule],
  controllers: [AnalyzeNewTasksController],
  providers: [
    AnalyzeNewTasksService,
    GetColumnTasksService,
    MoveTaskService,
    AddTaskCommentService,
    CheckEntityExistsService,
  ],
  exports: [AnalyzeNewTasksService],
})
export class AnalyzeNewTasksModule {}
