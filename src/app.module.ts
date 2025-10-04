import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appConfig, jiraConfig, claudeConfig, queueConfig } from './config';
// Новые модули с автозагрузкой
import { JiraIntegrationModule } from './modules/jira-integration.module';
import { PhotoAnalysisModule } from './modules/photo-analysis.module';
import { AiReportingModule } from './modules/ai-reporting.module';
import { QueueManagementModule } from './modules/queue-management.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jiraConfig, claudeConfig, queueConfig],
      envFilePath: '.env',
    }),
    // Новые модули с автозагрузкой features
    QueueManagementModule, // Bull Queue система очередей
    JiraIntegrationModule, // Все Jira интеграции
    PhotoAnalysisModule, // Claude анализ фотографий
    AiReportingModule, // AI отчеты
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
