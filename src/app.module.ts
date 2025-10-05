import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  appConfig,
  jiraConfig,
  claudeConfig,
  queueConfig,
  aiAgentConfig,
  notificationsConfig,
} from './config';
// Новые модули с автозагрузкой
import { JiraIntegrationModule } from './modules/jira-integration.module';
import { PhotoAnalysisModule } from './modules/photo-analysis.module';
import { AiReportingModule } from './modules/ai-reporting.module';
import { QueueManagementModule } from './modules/queue-management.module';
import { AiAgentModule } from './modules/ai-agent.module';
import { NotificationsModule } from './modules/notifications.module';
import { ContextManagementModule } from './modules/context-management.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        jiraConfig,
        claudeConfig,
        queueConfig,
        aiAgentConfig,
        notificationsConfig,
      ],
      envFilePath: '.env',
    }),
    // Новые модули с автозагрузкой features
    QueueManagementModule, // Bull Queue система очередей
    AiAgentModule, // AI Agent управление агентами
    NotificationsModule, // Email и Telegram уведомления
    ContextManagementModule, // Управление контекстом для AI агентов
    JiraIntegrationModule, // Все Jira интеграции
    PhotoAnalysisModule, // Claude анализ фотографий
    AiReportingModule, // AI отчеты
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
