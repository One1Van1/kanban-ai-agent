import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appConfig, jiraConfig, claudeConfig } from './config';
import { WebhookModule } from './webhook';
import { AIAnalysisModule } from './ai-analysis';
import { KanbanModule } from './kanban';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
