import { Module } from '@nestjs/common';
import { AnalyzeHaircutTasksController } from './analyze-haircut-tasks.controller';
import { AnalyzeHaircutTasksService } from './analyze-haircut-tasks.service';
import { JiraModule } from '../../jira/jira-integration.module';
import { CheckEntityExistsModule } from '../check-entity-exists/check-entity-exists.module';
import { GetTaskModule } from '../../jira/get-task/get-task.module';

@Module({
  imports: [JiraModule, CheckEntityExistsModule, GetTaskModule],
  controllers: [AnalyzeHaircutTasksController],
  providers: [AnalyzeHaircutTasksService],
  exports: [AnalyzeHaircutTasksService],
})
export class AnalyzeHaircutTasksModule {}
