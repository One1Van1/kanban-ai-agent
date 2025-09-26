import {
  Controller,
  Post,
  Body,
  Logger,
  HttpException,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AnalyzeBeforeAfterPhotosService } from './analyze-before-after-photos.service';
import {
  AnalyzeBeforeAfterPhotosDto,
  BeforeAfterAnalysisResultDto,
} from './analyze-before-after-photos.dto';

@ApiTags('Photo Analysis Agent - Before/After')
@Controller('photo-analysis-agent/analyze-before-after-photos')
export class AnalyzeBeforeAfterPhotosController {
  private readonly logger = new Logger(AnalyzeBeforeAfterPhotosController.name);

  constructor(
    private readonly analyzeBeforeAfterPhotosService: AnalyzeBeforeAfterPhotosService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Анализ фотографий стрижки ДО и ПОСЛЕ',
    description:
      'Использует Claude 3.5 Sonnet для сравнения изображений ДО и ПОСЛЕ стрижки, оценки качества и определения категории',
  })
  @ApiBody({
    type: AnalyzeBeforeAfterPhotosDto,
    description: 'Данные для анализа: ключ задачи и два base64 изображения',
  })
  @ApiResponse({
    status: 200,
    description: 'Анализ успешно выполнен',
    type: BeforeAfterAnalysisResultDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Ошибка валидации данных',
  })
  @ApiResponse({
    status: 500,
    description: 'Внутренняя ошибка сервера или недоступность Claude API',
  })
  async analyzeBeforeAfterPhotos(
    @Body() analyzeDto: AnalyzeBeforeAfterPhotosDto,
  ): Promise<BeforeAfterAnalysisResultDto> {
    try {
      this.logger.log(
        `📸 Received before/after analysis request for task: ${analyzeDto.taskKey}`,
      );

      // Выполняем анализ
      const analysis = await this.analyzeBeforeAfterPhotosService.analyze(
        analyzeDto.taskKey,
        analyzeDto.beforePhoto,
        analyzeDto.afterPhoto,
        analyzeDto.timeInProgress,
      );

      // Формируем успешный ответ
      const result: BeforeAfterAnalysisResultDto = {
        success: true,
        taskKey: analyzeDto.taskKey,
        transformation: analysis.transformation,
        quality: analysis.quality,
        timeAnalysis: analysis.timeAnalysis,
        report: analysis.report,
      };

      this.logger.log(
        `✅ Analysis completed for ${analyzeDto.taskKey}: ${analysis.transformation.category}, Score: ${analysis.quality.overallScore}/10`,
      );

      return result;
    } catch (error) {
      this.logger.error(
        `❌ Analysis failed for ${analyzeDto.taskKey}:`,
        error.message,
      );

      // Возвращаем ошибку в структурированном формате
      const errorResult: BeforeAfterAnalysisResultDto = {
        success: false,
        taskKey: analyzeDto.taskKey,
        transformation: {
          category: 'Обычная стрижка',
          difficultyLevel: 0,
          visualChanges: [],
          technique: 'Не определено',
        },
        quality: {
          overallScore: 0,
          evenness: 0,
          transitions: 0,
          symmetry: 0,
          cleanliness: 0,
          styleCompliance: 0,
        },
        timeAnalysis: {
          actualMinutes: analyzeDto.timeInProgress || 0,
          expectedRange: 'Не определено',
          efficiency: 'acceptable',
        },
        report: {
          summary: 'Анализ не удался',
          strengths: [],
          improvements: [],
          finalPrice: 0,
        },
        error: error.message,
      };

      // В зависимости от типа ошибки возвращаем разные HTTP статусы
      if (
        error.message.includes('валидации') ||
        error.message.includes('формат')
      ) {
        throw new HttpException(errorResult, HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException(errorResult, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Get('health')
  @ApiOperation({
    summary: 'Проверка состояния сервиса',
    description:
      'Проверяет доступность Claude API и готовность сервиса к работе',
  })
  @ApiResponse({
    status: 200,
    description: 'Статус сервиса',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'healthy' },
        claude: { type: 'boolean', example: true },
        timestamp: { type: 'string', example: '2025-09-26T02:00:00.000Z' },
      },
    },
  })
  async healthCheck() {
    try {
      const health = await this.analyzeBeforeAfterPhotosService.healthCheck();

      return {
        ...health,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('❌ Health check endpoint failed:', error.message);

      return {
        status: 'error',
        claude: false,
        timestamp: new Date().toISOString(),
        error: error.message,
      };
    }
  }
}
