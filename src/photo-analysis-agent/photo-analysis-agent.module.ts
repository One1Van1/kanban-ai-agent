import { Module } from '@nestjs/common';
import { AnalyzeHaircutPhotoModule } from './analyze-haircut-photo/analyze-haircut-photo.module';

@Module({
  imports: [AnalyzeHaircutPhotoModule],
  exports: [AnalyzeHaircutPhotoModule],
})
export class PhotoAnalysisAgentModule {}
