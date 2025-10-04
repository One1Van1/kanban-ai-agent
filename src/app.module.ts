import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appConfig, jiraConfig, claudeConfig } from './config';
// Новые модули с автозагрузкой
import { JiraIntegrationModule } from './modules/jira-integration.module';
import { PhotoAnalysisModule } from './modules/photo-analysis.module';
import { AiReportingModule } from './modules/ai-reporting.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jiraConfig, claudeConfig],
      envFilePath: '.env',
    }),
    // Новые модули с автозагрузкой features
    JiraIntegrationModule, // Все Jira интеграции
    PhotoAnalysisModule, // Claude анализ фотографий
    AiReportingModule, // AI генерация отчетов
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
