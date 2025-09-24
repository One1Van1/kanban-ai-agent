import { Module } from '@nestjs/common';
import { AnalyzeNewHaircutTasksController } from './analyze-new-haircut-tasks.controller';
import { AnalyzeNewHaircutTasksService } from './analyze-new-haircut-tasks.service';
import { GetColumnTasksModule } from '../../jira/get-column-tasks/get-column-tasks.module';
import { MoveTaskModule } from '../../jira/move-task/move-task.module';
import { AddTaskCommentModule } from '../../jira/add-task-comment/add-task-comment.module';
import { GetTaskModule } from '../../jira/get-task/get-task.module';

@Module({
  imports: [
    GetColumnTasksModule,
    MoveTaskModule,
    AddTaskCommentModule,
    GetTaskModule,
  ],
  controllers: [AnalyzeNewHaircutTasksController],
  providers: [AnalyzeNewHaircutTasksService],
  exports: [AnalyzeNewHaircutTasksService],
})
export class AnalyzeNewHaircutTasksModule {}
