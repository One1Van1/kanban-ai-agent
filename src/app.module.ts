import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appConfig, jiraConfig, claudeConfig } from './config';
import { JiraModule } from './jira/jira-integration.module';
import { AiAgentModule } from './ai-agent/ai-agent.module';
import { AiReportingAgentModule } from './ai-reporting-agent/ai-reporting-agent.module';
import { PhotoAnalysisAgentModule } from './photo-analysis-agent/photo-analysis-agent.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jiraConfig, claudeConfig],
      envFilePath: '.env',
    }),
    JiraModule,
    AiAgentModule,
    AiReportingAgentModule,
    PhotoAnalysisAgentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
