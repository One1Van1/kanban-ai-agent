import { Injectable, Logger } from '@nestjs/common';
import {
  ClaudeVisionService,
  IBeforeAfterAnalysis,
} from './claude-vision.service';
import {
  AnalyzeBeforeAfterPhotosDto,
  AnalyzeBeforeAfterPhotosResponseDto,
} from './analyze-before-after-photos.dto';

@Injectable()
export class AnalyzeBeforeAfterPhotosService {
  private readonly logger = new Logger(AnalyzeBeforeAfterPhotosService.name);

  constructor(private readonly claudeVisionService: ClaudeVisionService) {}

  async analyzeBeforeAfterPhotos(
    dto: AnalyzeBeforeAfterPhotosDto,
  ): Promise<AnalyzeBeforeAfterPhotosResponseDto> {
    this.logger.log(`🔍 Starting Claude analysis for task: ${dto.taskKey}`);

    try {
      // Валидация входных данных
      if (!dto.beforePhoto || !dto.afterPhoto) {
        return {
          success: false,
          message: 'Both before and after photos are required',
          error: 'Missing photo data',
          analysis: null,
        };
      }

      // Анализ фотографий с помощью Claude
      const analysis: IBeforeAfterAnalysis =
        await this.claudeVisionService.analyzeBeforeAfterPhotos(
          dto.beforePhoto,
          dto.afterPhoto,
        );

      this.logger.log(
        `✅ Claude analysis completed for ${dto.taskKey}. Score: ${analysis.quality.overallScore}/10`,
      );

      return {
        success: true,
        message: 'Before/after analysis completed successfully',
        analysis,
      };
    } catch (error) {
      this.logger.error(
        `❌ Error analyzing photos for ${dto.taskKey}:`,
        error.message,
      );

      return {
        success: false,
        message: 'Failed to analyze before/after photos',
        error: error.message,
        analysis: null,
      };
    }
  }

  // Вспомогательный метод для извлечения base64 данных из data URL
  private extractBase64FromDataUrl(dataUrl: string): string {
    const base64Index = dataUrl.indexOf('base64,');
    if (base64Index !== -1) {
      return dataUrl.substring(base64Index + 7);
    }
    return dataUrl; // Если уже в формате base64
  }

  // Метод для проверки статуса Claude сервиса
  async getServiceStatus(): Promise<{
    claudeConfigured: boolean;
    serviceName: string;
  }> {
    return {
      claudeConfigured: this.claudeVisionService['isConfigured'] || false,
      serviceName: 'Claude 3.5 Sonnet Vision Analysis',
    };
  }
}
