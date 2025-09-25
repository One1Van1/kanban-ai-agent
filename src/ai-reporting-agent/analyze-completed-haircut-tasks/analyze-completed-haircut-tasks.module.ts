import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AnalyzeCompletedHaircutTasksController } from './analyze-completed-haircut-tasks.controller';
import { AnalyzeCompletedHaircutTasksService } from './analyze-completed-haircut-tasks.service';

@Module({
  imports: [ConfigModule],
  controllers: [AnalyzeCompletedHaircutTasksController],
  providers: [AnalyzeCompletedHaircutTasksService],
  exports: [AnalyzeCompletedHaircutTasksService],
})
export class AnalyzeCompletedHaircutTasksModule {}
