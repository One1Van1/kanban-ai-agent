import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AnalyzeBeforeAfterPhotosController } from './analyze-before-after-photos.controller';
import { AnalyzeBeforeAfterPhotosService } from './analyze-before-after-photos.service';
import { ClaudeVisionService } from './claude-vision.service';

@Module({
  imports: [ConfigModule],
  controllers: [AnalyzeBeforeAfterPhotosController],
  providers: [AnalyzeBeforeAfterPhotosService, ClaudeVisionService],
  exports: [AnalyzeBeforeAfterPhotosService, ClaudeVisionService],
})
export class AnalyzeBeforeAfterPhotosModule {}
