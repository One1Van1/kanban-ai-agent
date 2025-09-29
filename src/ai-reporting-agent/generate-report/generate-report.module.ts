import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GenerateReportController } from './generate-report.controller';
import { GenerateReportService } from './generate-report.service';
import { SearchTasksModule } from '../../jira/search-tasks/search-tasks.module';
import { AddTaskCommentModule } from '../../jira/add-task-comment/add-task-comment.module';
import { MoveTaskModule } from '../../jira/move-task/move-task.module';

@Module({
  imports: [
    ConfigModule,
    SearchTasksModule,
    AddTaskCommentModule,
    MoveTaskModule,
  ],
  controllers: [GenerateReportController],
  providers: [GenerateReportService],
  exports: [GenerateReportService],
})
export class GenerateReportModule {}
