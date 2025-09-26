import { Module } from '@nestjs/common';
import { AnalyzeHaircutPhotoModule } from './analyze-haircut-photo/analyze-haircut-photo.module';
import { AnalyzeBeforeAfterPhotosModule } from './analyze-before-after-photos/analyze-before-after-photos.module';

@Module({
  imports: [
    AnalyzeHaircutPhotoModule,
    AnalyzeBeforeAfterPhotosModule, // Новый изолированный эндпоинт
  ],
  exports: [AnalyzeHaircutPhotoModule, AnalyzeBeforeAfterPhotosModule],
})
export class PhotoAnalysisAgentModule {}
