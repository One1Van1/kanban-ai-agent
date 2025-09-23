import { Module } from '@nestjs/common';
import { AutoHaircutMonitorController } from './auto-haircut-monitor.controller';
import { AutoHaircutMonitorService } from './auto-haircut-monitor.service';
import { AnalyzeHaircutTasksModule } from '../analyze-haircut-tasks/analyze-haircut-tasks.module';

@Module({
  imports: [AnalyzeHaircutTasksModule],
  controllers: [AutoHaircutMonitorController],
  providers: [AutoHaircutMonitorService],
  exports: [AutoHaircutMonitorService],
})
export class AutoHaircutMonitorModule {}
