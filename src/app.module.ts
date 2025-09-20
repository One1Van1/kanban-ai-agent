import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appConfig, jiraConfig, claudeConfig } from './config';
import { WebhookModule } from './webhook';
import { AIAnalysisModule } from './ai-analysis';
import { KanbanModule } from './kanban';
import { TaskExecutorModule } from './task-executor/task-executor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jiraConfig, claudeConfig],
      envFilePath: '.env',
    }),
    WebhookModule,
    AIAnalysisModule,
    KanbanModule,
    TaskExecutorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
