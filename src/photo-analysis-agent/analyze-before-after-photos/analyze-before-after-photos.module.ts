import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AnalyzeBeforeAfterPhotosController } from './analyze-before-after-photos.controller';
import { AnalyzeBeforeAfterPhotosService } from './analyze-before-after-photos.service';
import { ClaudeVisionService } from './claude-vision.service';

/**
 * Модуль для анализа фотографий ДО/ПОСЛЕ стрижки
 *
 * Изолированный эндпоинт согласно архитектурным правилам:
 * - Полная изоляция - все сервисы внутри модуля
 * - Собственный Claude сервис (не shared)
 * - Независимые зависимости
 */
@Module({
  imports: [
    ConfigModule, // Для доступа к конфигурации Claude
  ],
  controllers: [AnalyzeBeforeAfterPhotosController],
  providers: [
    AnalyzeBeforeAfterPhotosService,
    ClaudeVisionService, // Локальный сервис - не shared!
  ],
  exports: [
    AnalyzeBeforeAfterPhotosService, // Экспортируем для возможных интеграций
  ],
})
export class AnalyzeBeforeAfterPhotosModule {}
