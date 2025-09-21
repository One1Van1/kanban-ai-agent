import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appConfig, jiraConfig, claudeConfig } from './config';
import { JiraModule } from './jira/jira.module';
import { AIAnalysisModule } from './ai-analysis/ai-analysis.module';
import { TaskExecutorModule } from './task-executor/task-executor.module';
import { KanbanAgentModule } from './kanban-agent/kanban-agent.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jiraConfig, claudeConfig],
      envFilePath: '.env',
    }),
    JiraModule,
    AIAnalysisModule,
    TaskExecutorModule,
    KanbanAgentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
