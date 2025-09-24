import { Module } from '@nestjs/common';
import { ExecuteHaircutTasksController } from './execute-haircut-tasks.controller';
import { ExecuteHaircutTasksService } from './execute-haircut-tasks.service';
import { JiraModule } from '../../jira/jira-integration.module';
// import { CheckEntityExistsModule } from '../check-entity-exists/check-entity-exists.module';

@Module({
  imports: [
    JiraModule,
    // CheckEntityExistsModule
  ],
  controllers: [ExecuteHaircutTasksController],
  providers: [ExecuteHaircutTasksService],
  exports: [ExecuteHaircutTasksService],
})
export class ExecuteHaircutTasksModule {}
