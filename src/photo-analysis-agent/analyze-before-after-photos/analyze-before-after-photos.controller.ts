import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnalyzeBeforeAfterPhotosService } from './analyze-before-after-photos.service';
import {
  AnalyzeBeforeAfterPhotosDto,
  AnalyzeBeforeAfterPhotosResponseDto,
} from './analyze-before-after-photos.dto';

@ApiTags('Photo Analysis Agent - Claude')
@Controller('photo-analysis-agent/analyze-before-after-photos')
export class AnalyzeBeforeAfterPhotosController {
  private readonly logger = new Logger(AnalyzeBeforeAfterPhotosController.name);

  constructor(
    private readonly analyzeBeforeAfterPhotosService: AnalyzeBeforeAfterPhotosService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Анализ фотографий ДО/ПОСЛЕ с помощью Claude 3.5 Sonnet',
    description: 'Анализирует качество стрижки, сравнивая фото ДО и ПОСЛЕ',
  })
  @ApiResponse({
    status: 200,
    description: 'Анализ успешно выполнен',
    type: AnalyzeBeforeAfterPhotosResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректные данные запроса',
  })
  @ApiResponse({
    status: 500,
    description: 'Внутренняя ошибка сервера',
  })
  async analyzeBeforeAfterPhotos(
    @Body() analyzeDto: AnalyzeBeforeAfterPhotosDto,
  ): Promise<AnalyzeBeforeAfterPhotosResponseDto> {
    this.logger.log(
      `🔍 Starting before/after analysis for task: ${analyzeDto.taskKey}`,
    );

    try {
      const result =
        await this.analyzeBeforeAfterPhotosService.analyzeBeforeAfterPhotos(
          analyzeDto,
        );

      this.logger.log(`✅ Analysis completed for ${analyzeDto.taskKey}`);
      return result;
    } catch (error) {
      this.logger.error(
        `❌ Analysis failed for ${analyzeDto.taskKey}:`,
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
}
