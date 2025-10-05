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
  databaseConfig,
  cacheConfig,
} from './config';
// Новые модули с автозагрузкой
import { JiraIntegrationModule } from './modules/jira-integration.module';
import { PhotoAnalysisModule } from './modules/photo-analysis.module';
import { AiReportingModule } from './modules/ai-reporting.module';
import { QueueManagementModule } from './modules/queue-management.module';
import { AiAgentModule } from './modules/ai-agent.module';
import { NotificationsModule } from './modules/notifications.module';
import { ContextManagementModule } from './modules/context-management.module';
import { DatabaseModule } from './modules/database.module';
import { DatabaseManagementModule } from './modules/database-management.module';
import { CacheManagementModule } from './modules/cache-management.module';

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
        databaseConfig,
        cacheConfig,
      ],
      envFilePath: '.env',
    }),
    // Новые модули с автозагрузкой features
    DatabaseModule, // TypeORM конфигурация базы данных
    DatabaseManagementModule, // Управление данными агентов и истории
    CacheManagementModule, // Redis кеширование для оптимизации производительности
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
