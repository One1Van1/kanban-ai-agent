import { Module } from '@nestjs/common';
// Импортируем ТОЛЬКО Claude анализ фотографий
import { AnalyzeBeforeAfterPhotosModule } from './analyze-before-after-photos/analyze-before-after-photos.module';

@Module({
  imports: [AnalyzeBeforeAfterPhotosModule],
  exports: [AnalyzeBeforeAfterPhotosModule],
})
export class PhotoAnalysisAgentModule {}
