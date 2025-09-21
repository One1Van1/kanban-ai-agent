import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TaskExecutorService } from './task-executor.service';
import { SimpleCodeExecutorService } from './executors/simple-code-executor.service';
import { AIController } from './ai.controller';
import { JiraModule } from '../jira/jira.module';
import { AIAnalysisModule } from '../ai-analysis/ai-analysis.module';

@Module({
  imports: [ConfigModule, JiraModule, AIAnalysisModule],
  controllers: [AIController],
  providers: [TaskExecutorService, SimpleCodeExecutorService],
  exports: [TaskExecutorService],
})
export class TaskExecutorModule {}
