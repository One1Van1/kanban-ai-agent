import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Controllers
import { AnalyzeBeforeAfterPhotosController } from '../features/photo-analysis/analyze-before-after-photos/analyze-before-after-photos.controller';

// Services
import { AnalyzeBeforeAfterPhotosService } from '../features/photo-analysis/analyze-before-after-photos/analyze-before-after-photos.service';

@Module({
  imports: [ConfigModule],
  controllers: [AnalyzeBeforeAfterPhotosController],
  providers: [AnalyzeBeforeAfterPhotosService],
  exports: [AnalyzeBeforeAfterPhotosService],
})
export class PhotoAnalysisModule {}
