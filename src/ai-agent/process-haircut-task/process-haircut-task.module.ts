import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProcessHaircutTaskController } from './process-haircut-task.controller';
import { ProcessHaircutTaskService } from './process-haircut-task.service';
import { AnalyzeCompletedHaircutTasksModule } from '../../ai-reporting-agent/analyze-completed-haircut-tasks/analyze-completed-haircut-tasks.module';
import { PhotoAnalysisAgentModule } from '../../photo-analysis-agent/photo-analysis-agent.module';

@Module({
  imports: [
    ConfigModule,
    AnalyzeCompletedHaircutTasksModule,
    PhotoAnalysisAgentModule,
  ],
  controllers: [ProcessHaircutTaskController],
  providers: [ProcessHaircutTaskService],
  exports: [ProcessHaircutTaskService],
})
export class ProcessHaircutTaskModule {}
