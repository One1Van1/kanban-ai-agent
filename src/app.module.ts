import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appConfig, jiraConfig, claudeConfig } from './config';
import { JiraModule } from './jira/jira-integration.module';
// Подключаем ТОЛЬКО Claude агент и новый webhook
import { AnalyzeBeforeAfterPhotosModule } from './photo-analysis-agent/analyze-before-after-photos/analyze-before-after-photos.module';
import { ProcessWebhookBeforeAfterModule } from './jira/process-webhook-before-after/process-webhook-before-after.module';
// Добавляем модуль отчетов
import { AiReportingAgentModule } from './ai-reporting-agent/ai-reporting-agent.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jiraConfig, claudeConfig],
      envFilePath: '.env',
    }),
    JiraModule,
    // ТОЛЬКО Claude система
    AnalyzeBeforeAfterPhotosModule, // Claude анализ фотографий
    ProcessWebhookBeforeAfterModule, // Claude webhook
    // AI отчеты
    AiReportingAgentModule, // Генерация отчетов
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
