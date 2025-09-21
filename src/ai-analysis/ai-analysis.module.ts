import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AIAnalysisService } from './ai-analysis.service';

@Module({
  imports: [ConfigModule],
  providers: [AIAnalysisService],
  exports: [AIAnalysisService],
})
export class AIAnalysisModule {}
