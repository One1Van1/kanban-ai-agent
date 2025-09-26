import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnalyzeHaircutPhotoService } from './analyze-haircut-photo.service';
import { AnalyzeHaircutPhotoDto } from './analyze-haircut-photo.dto';
import { AnalyzeHaircutPhotoResponse } from './analyze-haircut-photo.interface';

@ApiTags('Photo Analysis Agent')
@Controller('photo-analysis-agent/analyze-haircut-photo')
export class AnalyzeHaircutPhotoController {
  constructor(
    private readonly analyzeHaircutPhotoService: AnalyzeHaircutPhotoService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Анализ фотографий стрижки с помощью AI',
    description: `
    Анализирует фотографии выполненной стрижки с помощью AI vision технологий.
    
    Возможности анализа:
    - 📊 Качество выполнения стрижки (1-10)
    - 🎯 Соответствие заявленной категории
    - ⚡ Техническое исполнение
    - 🔍 Детальная оценка (ровность, переходы, симметрия)
    - ✅ Выявление достоинств
    - ⚠️ Обнаружение проблем
    - 💡 Рекомендации по улучшению
    
    Результат включает:
    - Подробный анализ каждого аспекта
    - Итоговую оценку и рекомендации
    - Автоматические действия для Jira
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Анализ фотографий успешно выполнен',
    schema: {
      example: {
        success: true,
        message: 'Photo analysis completed successfully',
        analysis: {
          taskKey: 'KAN-17',
          analysisId: 'analysis_1727299200000',
          timestamp: '2025-09-25T20:00:00.000Z',
          photoAnalysis: {
            qualityScore: 8.5,
            categoryMatch: true,
            detectedCategory: 'Обычная стрижка',
            technicalExecution: 'good',
            details: {
              evenness: 9,
              transitions: 8,
              symmetry: 8,
              cleanliness: 9,
              styleCompliance: 8,
            },
            issues: ['Небольшая неровность в области висков'],
            highlights: ['Отличные переходы', 'Хорошая симметрия'],
          },
          overallAssessment: {
            passed: true,
            score: 8.5,
            grade: 'B',
            feedback: 'Хорошее качество выполнения стрижки',
          },
          jiraActions: {
            shouldMoveToDone: true,
            shouldMoveToQuestions: false,
            commentToAdd: '🤖 AI Анализ: Качество 8.5/10...',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректные входные данные',
  })
  @ApiResponse({
    status: 500,
    description: 'Ошибка при анализе фотографий',
  })
  async analyzePhotos(
    @Body() analyzeData: AnalyzeHaircutPhotoDto,
  ): Promise<AnalyzeHaircutPhotoResponse> {
    return this.analyzeHaircutPhotoService.analyzeHaircutPhotos(analyzeData);
  }
}
