import { Injectable, Logger } from '@nestjs/common';
import { ClaudeVisionService } from './claude-vision.service';
import {
  IAnalyzeBeforeAfterPhotosService,
  IBeforeAfterAnalysis,
} from './analyze-before-after-photos.interface';

@Injectable()
export class AnalyzeBeforeAfterPhotosService
  implements IAnalyzeBeforeAfterPhotosService
{
  private readonly logger = new Logger(AnalyzeBeforeAfterPhotosService.name);

  constructor(private readonly claudeVisionService: ClaudeVisionService) {}

  /**
   * Основной метод анализа фотографий ДО/ПОСЛЕ
   */
  async analyze(
    taskKey: string,
    beforePhoto: { filename: string; content: string; size?: number },
    afterPhoto: { filename: string; content: string; size?: number },
    timeInProgress?: number,
  ): Promise<IBeforeAfterAnalysis> {
    try {
      this.logger.log(`🎯 Starting before/after analysis for task: ${taskKey}`);

      // Валидация входных данных
      await this.validatePhotos(beforePhoto, afterPhoto);

      // Логирование размеров изображений
      const beforeSize = beforePhoto.size
        ? `${(beforePhoto.size / 1024).toFixed(1)}KB`
        : 'unknown';
      const afterSize = afterPhoto.size
        ? `${(afterPhoto.size / 1024).toFixed(1)}KB`
        : 'unknown';
      this.logger.log(
        `📷 Photos validated - Before: ${beforePhoto.filename} (${beforeSize}), After: ${afterPhoto.filename} (${afterSize})`,
      );

      // Анализ через Claude Vision
      const analysis = await this.claudeVisionService.analyzeBeforeAfterPhotos(
        beforePhoto.content,
        afterPhoto.content,
        taskKey,
        timeInProgress,
      );

      this.logger.log(
        `✅ Analysis completed for ${taskKey}: ${analysis.transformation.category}, Quality: ${analysis.quality.overallScore}/10`,
      );

      return analysis;
    } catch (error) {
      this.logger.error(`❌ Analysis failed for ${taskKey}:`, error.message);
      throw error;
    }
  }

  /**
   * Валидация входящих данных фотографий
   */
  async validatePhotos(
    beforePhoto: { filename: string; content: string },
    afterPhoto: { filename: string; content: string },
  ): Promise<boolean> {
    const errors: string[] = [];

    // Проверка наличия данных
    if (!beforePhoto.content || !afterPhoto.content) {
      errors.push('Отсутствует содержимое изображений');
    }

    // Проверка base64 формата
    if (!this.isValidBase64(beforePhoto.content)) {
      errors.push(`Неверный формат изображения "ДО": ${beforePhoto.filename}`);
    }

    if (!this.isValidBase64(afterPhoto.content)) {
      errors.push(
        `Неверный формат изображения "ПОСЛЕ": ${afterPhoto.filename}`,
      );
    }

    // Проверка размера base64 (приблизительный размер файла)
    const beforeSize = beforePhoto.content.length * 0.75; // base64 добавляет ~33% размера
    const afterSize = afterPhoto.content.length * 0.75;

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (beforeSize > maxSize) {
      errors.push(
        `Изображение "ДО" слишком большое: ${(beforeSize / 1024 / 1024).toFixed(1)}MB`,
      );
    }

    if (afterSize > maxSize) {
      errors.push(
        `Изображение "ПОСЛЕ" слишком большое: ${(afterSize / 1024 / 1024).toFixed(1)}MB`,
      );
    }

    // Минимальный размер (избегаем пустых изображений)
    const minSize = 1024; // 1KB
    if (beforeSize < minSize || afterSize < minSize) {
      errors.push('Изображения слишком маленькие или повреждены');
    }

    if (errors.length > 0) {
      const errorMessage = `Ошибки валидации фотографий: ${errors.join(', ')}`;
      this.logger.error(`❌ ${errorMessage}`);
      throw new Error(errorMessage);
    }

    this.logger.log('✅ Photos validation passed');
    return true;
  }

  /**
   * Проверка валидности base64 строки
   */
  private isValidBase64(base64String: string): boolean {
    try {
      // Убираем data URL префикс если есть
      const base64 = base64String.replace(/^data:image\/[a-z]+;base64,/, '');

      // Проверяем что это валидный base64
      return btoa(atob(base64)) === base64;
    } catch {
      return false;
    }
  }

  /**
   * Проверка доступности сервиса
   */
  async healthCheck(): Promise<{ status: string; claude: boolean }> {
    try {
      const claudeHealth = await this.claudeVisionService.healthCheck();

      return {
        status: claudeHealth ? 'healthy' : 'degraded',
        claude: claudeHealth,
      };
    } catch (error) {
      this.logger.error('❌ Health check failed:', error.message);
      return {
        status: 'unhealthy',
        claude: false,
      };
    }
  }
}
