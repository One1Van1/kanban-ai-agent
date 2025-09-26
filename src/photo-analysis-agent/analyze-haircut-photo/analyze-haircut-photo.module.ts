import { Module } from '@nestjs/common';
import { AnalyzeHaircutPhotoController } from './analyze-haircut-photo.controller';
import { AnalyzeHaircutPhotoService } from './analyze-haircut-photo.service';
import { OllamaVisionService } from '../shared/ollama-vision.service';

@Module({
  controllers: [AnalyzeHaircutPhotoController],
  providers: [AnalyzeHaircutPhotoService, OllamaVisionService],
  exports: [AnalyzeHaircutPhotoService, OllamaVisionService],
})
export class AnalyzeHaircutPhotoModule {}
