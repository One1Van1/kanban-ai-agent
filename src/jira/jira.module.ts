import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JiraService } from './jira.service';
import { TaskFetcherService } from './task-fetcher.service';
import { TaskStatusManagerService } from './task-status-manager.service';
import { JiraController } from './jira.controller';

@Module({
  imports: [ConfigModule],
  controllers: [JiraController],
  providers: [JiraService, TaskFetcherService, TaskStatusManagerService],
  exports: [JiraService, TaskFetcherService, TaskStatusManagerService],
})
export class JiraModule {}
