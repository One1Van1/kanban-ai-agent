import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AnalyzeCompletedHaircutTasksModule } from './analyze-completed-haircut-tasks/analyze-completed-haircut-tasks.module';

@Module({
  imports: [ConfigModule, AnalyzeCompletedHaircutTasksModule],
  exports: [AnalyzeCompletedHaircutTasksModule],
})
export class AiReportingAgentModule {}
