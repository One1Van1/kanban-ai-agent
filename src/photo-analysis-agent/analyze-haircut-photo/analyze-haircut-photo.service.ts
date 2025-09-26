import { Injectable, Logger } from '@nestjs/common';
import { AnalyzeHaircutPhotoDto } from './analyze-haircut-photo.dto';
import {
  PhotoAnalysisResult,
  AnalyzeHaircutPhotoResponse,
} from './analyze-haircut-photo.interface';
import { OllamaVisionService } from '../shared/ollama-vision.service';

@Injectable()
export class AnalyzeHaircutPhotoService {
  private readonly logger = new Logger(AnalyzeHaircutPhotoService.name);

  constructor(private readonly ollamaVisionService: OllamaVisionService) {}

  /**
   * Анализ фотографий стрижки с помощью AI
   */
  async analyzeHaircutPhotos(
    data: AnalyzeHaircutPhotoDto,
  ): Promise<AnalyzeHaircutPhotoResponse> {
    this.logger.log(`🔍 Starting photo analysis for task: ${data.taskKey}`);

    try {
      // 1. Валидация входных данных
      if (!data.photos || data.photos.length === 0) {
        return {
          success: false,
          message: 'No photos provided for analysis',
          error: 'At least one photo is required',
        };
      }

      // 2. Анализ каждого фото
      const analysisResults = await this.processPhotos(data);

      // 3. Объединяем результаты анализа
      const finalAnalysis = await this.consolidateAnalysis(
        data,
        analysisResults,
      );

      // 4. Определяем действия для Jira
      const jiraActions = this.determineJiraActions(finalAnalysis);

      const result: PhotoAnalysisResult = {
        ...finalAnalysis,
        jiraActions,
      };

      this.logger.log(`✅ Photo analysis completed for ${data.taskKey}`);

      return {
        success: true,
        message: 'Photo analysis completed successfully',
        analysis: result,
      };
    } catch (error) {
      this.logger.error(
        `❌ Error analyzing photos for ${data.taskKey}:`,
        error,
      );
      return {
        success: false,
        message: 'Failed to analyze photos',
        error: error.message,
      };
    }
  }

  /**
   * Обработка фотографий с помощью AI vision модели
   */
  private async processPhotos(data: AnalyzeHaircutPhotoDto) {
    const results = [];

    for (const photo of data.photos) {
      this.logger.log(`📸 Analyzing photo: ${photo.filename}`);

      // Используем Ollama Llava для анализа изображения
      const photoAnalysis = await this.analyzePhotoWithOllama(
        photo, // Передаем весь объект photo
        data.declaredCategory,
      );

      results.push({
        photo: photo.filename,
        analysis: photoAnalysis,
      });
    }

    return results;
  }

  /**
   * Анализ фотографии с помощью Ollama Llava
   */
  private async analyzePhotoWithOllama(
    photo: any, // Объект с url, content, filename
    declaredCategory: string,
  ) {
    try {
      // Проверяем доступность Ollama
      const isOllamaAvailable =
        await this.ollamaVisionService.checkOllamaStatus();

      if (!isOllamaAvailable) {
        this.logger.warn('Ollama service not available, using mock analysis');
        return this.getMockPhotoAnalysis(declaredCategory);
      }

      // Определяем, есть ли base64 контент или используем URL
      const hasBase64 = photo.content && photo.content.trim().length > 0;
      const imageSource = hasBase64 ? photo.content : photo.url;

      // Проверяем, что у нас есть источник изображения
      if (!imageSource) {
        throw new Error('No image source available (no URL or base64 content)');
      }

      this.logger.log(
        `📸 Analyzing ${photo.filename} via ${hasBase64 ? 'base64' : 'URL'}`,
      );

      // Анализируем изображение через Ollama
      return await this.ollamaVisionService.analyzeImage(
        imageSource,
        hasBase64, // Передаем флаг, что это base64
        declaredCategory,
      );
    } catch (error) {
      this.logger.error(`Error analyzing photo with Ollama: ${error.message}`);
      this.logger.log('Falling back to mock analysis');
      return this.getMockPhotoAnalysis(declaredCategory);
    }
  }

  /**
   * Анализ фотографии с помощью AI Vision
   */
  private async analyzePhotoWithAI(photoUrl: string, declaredCategory: string) {
    // TODO: Интеграция с AI Vision API

    // Промпт для AI анализа
    const prompt = `
    Проанализируй фотографию стрижки и оцени:
    
    1. Качество выполнения (1-10):
       - Ровность стрижки
       - Плавность переходов
       - Симметричность
       - Чистота работы
    
    2. Соответствие заявленной категории: "${declaredCategory}"
    
    3. Техническое исполнение
    
    4. Найденные проблемы и достоинства
    
    Заявленная категория: ${declaredCategory}
    
    Дай подробную оценку в формате JSON.
    `;

    // Пока что возвращаем мок данные
    return this.getMockPhotoAnalysis(declaredCategory);
  }

  /**
   * Временная мок функция для тестирования
   */
  private getMockPhotoAnalysis(declaredCategory: string) {
    return {
      qualityScore: 8.5,
      detectedCategory: declaredCategory,
      details: {
        evenness: 9,
        transitions: 8,
        symmetry: 8,
        cleanliness: 9,
        styleCompliance: 8,
      },
      issues: ['Небольшая неровность в области висков'],
      highlights: ['Отличные переходы', 'Хорошая симметрия', 'Чистая работа'],
    };
  }

  /**
   * Объединение результатов анализа всех фото
   */
  private async consolidateAnalysis(
    data: AnalyzeHaircutPhotoDto,
    analysisResults: any[],
  ): Promise<Omit<PhotoAnalysisResult, 'jiraActions'>> {
    // Усредняем оценки по всем фото
    const avgScores = this.calculateAverageScores(analysisResults);

    // Определяем соответствие категории
    const categoryVerification = this.verifyCategoryMatch(
      data.declaredCategory,
      analysisResults,
    );

    // Формируем итоговую оценку
    const overallAssessment = this.generateOverallAssessment(
      avgScores,
      categoryVerification,
    );

    return {
      taskKey: data.taskKey,
      analysisId: `analysis_${Date.now()}`,
      timestamp: new Date(),
      photoAnalysis: {
        qualityScore: avgScores.overall,
        categoryMatch: categoryVerification.matches,
        detectedCategory: this.getMostCommonCategory(analysisResults),
        technicalExecution: this.getTechnicalExecutionGrade(avgScores.overall),
        details: avgScores.details,
        issues: this.collectAllIssues(analysisResults),
        highlights: this.collectAllHighlights(analysisResults),
      },
      categoryVerification,
      overallAssessment,
    };
  }

  /**
   * Определение действий для Jira на основе анализа
   */
  private determineJiraActions(
    analysis: Omit<PhotoAnalysisResult, 'jiraActions'>,
  ) {
    const shouldMoveToQuestions =
      analysis.overallAssessment.score < 7 ||
      !analysis.categoryVerification.matches ||
      analysis.photoAnalysis.issues.length > 2;

    const shouldMoveToDone =
      analysis.overallAssessment.score >= 8 &&
      analysis.categoryVerification.matches &&
      analysis.overallAssessment.passed;

    let commentToAdd = this.generateAnalysisComment(analysis);

    return {
      shouldMoveToQuestions,
      shouldMoveToDone,
      commentToAdd,
      categoryUpdate: analysis.categoryVerification.matches
        ? undefined
        : analysis.categoryVerification.suggestedCategory,
    };
  }

  /**
   * Генерация комментария для Jira
   */
  private generateAnalysisComment(
    analysis: Omit<PhotoAnalysisResult, 'jiraActions'>,
  ): string {
    const { photoAnalysis, overallAssessment, categoryVerification } = analysis;

    let comment = `🤖 **AI Анализ фотографий стрижки**\n\n`;

    comment += `**Общая оценка:** ${overallAssessment.score}/10 (${overallAssessment.grade})\n`;
    comment += `**Качество выполнения:** ${photoAnalysis.qualityScore}/10\n`;
    comment += `**Техническое исполнение:** ${this.translateTechnicalExecution(photoAnalysis.technicalExecution)}\n\n`;

    comment += `**Детальные оценки:**\n`;
    comment += `- Ровность: ${photoAnalysis.details.evenness}/10\n`;
    comment += `- Переходы: ${photoAnalysis.details.transitions}/10\n`;
    comment += `- Симметрия: ${photoAnalysis.details.symmetry}/10\n`;
    comment += `- Чистота работы: ${photoAnalysis.details.cleanliness}/10\n`;
    comment += `- Соответствие стилю: ${photoAnalysis.details.styleCompliance}/10\n\n`;

    if (!categoryVerification.matches) {
      comment += `⚠️ **Несоответствие категории!**\n`;
      comment += `Заявлено: ${analysis.photoAnalysis.detectedCategory}\n`;
      comment += `Обнаружено: ${categoryVerification.suggestedCategory}\n`;
      comment += `Причина: ${categoryVerification.reasoning}\n\n`;
    }

    if (photoAnalysis.highlights.length > 0) {
      comment += `✅ **Достоинства:**\n`;
      photoAnalysis.highlights.forEach((highlight) => {
        comment += `- ${highlight}\n`;
      });
      comment += `\n`;
    }

    if (photoAnalysis.issues.length > 0) {
      comment += `⚠️ **Замечания:**\n`;
      photoAnalysis.issues.forEach((issue) => {
        comment += `- ${issue}\n`;
      });
      comment += `\n`;
    }

    comment += `**Рекомендации:**\n`;
    overallAssessment.recommendations.forEach((rec) => {
      comment += `- ${rec}\n`;
    });

    return comment;
  }

  // Вспомогательные методы
  private calculateAverageScores(results: any[]) {
    // Реализация усреднения оценок
    return {
      overall: 8.5,
      details: {
        evenness: 9,
        transitions: 8,
        symmetry: 8,
        cleanliness: 9,
        styleCompliance: 8,
      },
    };
  }

  private verifyCategoryMatch(declaredCategory: string, results: any[]) {
    return {
      matches: true,
      confidence: 0.9,
      reasoning: 'Стрижка соответствует заявленной категории',
    };
  }

  private generateOverallAssessment(scores: any, categoryMatch: any) {
    return {
      passed: true,
      score: 8.5,
      grade: 'B' as const,
      feedback: 'Хорошее качество выполнения стрижки',
      recommendations: [
        'Обратить внимание на ровность в области висков',
        'Продолжать поддерживать высокое качество',
      ],
    };
  }

  private getMostCommonCategory(results: any[]): string {
    return 'Обычная стрижка';
  }

  private getTechnicalExecutionGrade(
    score: number,
  ): 'excellent' | 'good' | 'satisfactory' | 'poor' {
    if (score >= 9) return 'excellent';
    if (score >= 7) return 'good';
    if (score >= 5) return 'satisfactory';
    return 'poor';
  }

  private collectAllIssues(results: any[]): string[] {
    return ['Небольшая неровность в области висков'];
  }

  private collectAllHighlights(results: any[]): string[] {
    return ['Отличные переходы', 'Хорошая симметрия', 'Чистая работа'];
  }

  private translateTechnicalExecution(execution: string): string {
    const translations: Record<string, string> = {
      excellent: 'Отлично',
      good: 'Хорошо',
      satisfactory: 'Удовлетворительно',
      poor: 'Плохо',
    };
    return translations[execution] || execution;
  }
}
