import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import {
  IClaudeVisionService,
  IBeforeAfterAnalysis,
  HAIRCUT_CATEGORIES,
  TIME_RANGES,
  PRICING,
} from './analyze-before-after-photos.interface';

@Injectable()
export class ClaudeVisionService implements IClaudeVisionService {
  private readonly logger = new Logger(ClaudeVisionService.name);
  private readonly openai: OpenAI | null;
  private readonly isConfigured: boolean;
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('claude.apiKey');
    const baseUrl = this.configService.get<string>('claude.baseUrl');
    this.model =
      this.configService.get<string>('claude.model') ||
      'anthropic/claude-3.5-sonnet';

    // Диагностика конфигурации
    this.logger.log(`🔍 Диагностика OpenRouter конфигурации:`);
    this.logger.log(`📋 API Key: ${apiKey ? '✅ Найден' : '❌ Отсутствует'}`);
    this.logger.log(`🌐 Base URL: ${baseUrl || 'не задан'}`);
    this.logger.log(`🤖 Model: ${this.model}`);

    if (!apiKey) {
      this.logger.warn(
        '⚠️ OPENROUTER_API_KEY not found in environment variables - Claude Vision будет недоступен',
      );
      this.openai = null;
      this.isConfigured = false;
    } else {
      this.openai = new OpenAI({
        apiKey,
        baseURL: baseUrl,
      });
      this.isConfigured = true;
      this.logger.log('✅ Claude Vision Service initialized via OpenRouter');
    }
  }

  /**
   * Анализ двух изображений ДО и ПОСЛЕ
   */
  async analyzeBeforeAfterPhotos(
    beforeImageBase64: string,
    afterImageBase64: string,
    taskKey: string,
    timeInMinutes?: number,
  ): Promise<IBeforeAfterAnalysis> {
    try {
      this.logger.log(`🔍 Starting before/after analysis for task: ${taskKey}`);

      // Проверяем, настроен ли OpenRouter API
      if (!this.isConfigured || !this.openai) {
        this.logger.error(
          '❌ OpenRouter API не настроен - возвращаем fallback результат',
        );
        return this.createFallbackResult(
          'OpenRouter API не настроен (отсутствует OPENROUTER_API_KEY)',
        );
      }

      const beforeSize = ((beforeImageBase64.length * 0.75) / 1024).toFixed(1);
      const afterSize = ((afterImageBase64.length * 0.75) / 1024).toFixed(1);
      this.logger.log(
        `📷 Before photo: ${beforeSize}KB, After photo: ${afterSize}KB`,
      );

      const maxTokens =
        this.configService.get<number>('claude.maxTokens') || 2048;
      const temperature =
        this.configService.get<number>('claude.temperature') || 0.3;

      const prompt = this.buildAnalysisPrompt(taskKey, timeInMinutes);
      this.logger.log(`📤 Sending request to Claude model: ${this.model}`);

      const response = await this.openai.chat.completions.create({
        model: this.model,
        max_tokens: maxTokens,
        temperature,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt,
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/png;base64,${beforeImageBase64}`,
                },
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/png;base64,${afterImageBase64}`,
                },
              },
            ],
          },
        ],
      });

      this.logger.log(`✅ Claude analysis completed for ${taskKey}`);

      // Парсинг ответа
      const analysisText = response.choices[0]?.message?.content || '';
      return this.parseClaudeResponse(analysisText, timeInMinutes);
    } catch (error) {
      this.logger.error(`❌ Claude API error for ${taskKey}:`, error.message);

      // Возвращаем fallback анализ
      return this.createFallbackAnalysis(timeInMinutes);
    }
  }

  /**
   * Построение промпта для анализа
   */
  private buildAnalysisPrompt(taskKey: string, timeInMinutes?: number): string {
    return `
Ты эксперт-парикмахер с 20-летним стажем. Проанализируй ДВА изображения стрижки:
1-е изображение - ДО стрижки
2-е изображение - ПОСЛЕ стрижки

ЗАДАЧА: ${taskKey}
${timeInMinutes ? `ВРЕМЯ РАБОТЫ: ${timeInMinutes} минут` : 'ВРЕМЯ РАБОТЫ: не указано'}

ВАЖНО: Внимательно сравни ДВА изображения и оцени ТРАНСФОРМАЦИЮ.

ОПРЕДЕЛИ КАТЕГОРИЮ по сложности изменений:
- "Быстрая стрижка" (15-30 мин) - простая подравниваниe, машинкой под насадку
- "Обычная стрижка" (30-60 мин) - ножницы + машинка, переходы, укладка  
- "Сложная стрижка" (60-120 мин) - сложные переходы, моделирование, креативные формы

ОЦЕНИ КАЧЕСТВО по критериям (1-10):
- Ровность стрижки
- Качество переходов  
- Симметрия
- Чистота работы
- Соответствие стилю

ВЕРНИ РЕЗУЛЬТАТ ТОЛЬКО В ВИДЕ JSON:
{
  "transformation": {
    "category": "Быстрая стрижка|Обычная стрижка|Сложная стрижка",
    "difficultyLevel": <число 1-10>,
    "visualChanges": ["изменение1", "изменение2", "изменение3"],
    "technique": "описание техники"
  },
  "quality": {
    "overallScore": <среднее значение>,
    "evenness": <1-10>,
    "transitions": <1-10>,
    "symmetry": <1-10>, 
    "cleanliness": <1-10>,
    "styleCompliance": <1-10>
  },
  "report": {
    "summary": "краткое резюме работы",
    "strengths": ["достоинство1", "достоинство2"],
    "improvements": ["рекомендация1", "рекомендация2"]
  }
}

Отвечай ТОЛЬКО JSON, без дополнительного текста!`;
  }

  /**
   * Парсинг ответа от Claude
   */
  private parseClaudeResponse(
    responseText: string,
    timeInMinutes?: number,
  ): IBeforeAfterAnalysis {
    try {
      // Извлекаем JSON из ответа (может быть в markdown блоках)
      const jsonMatch =
        responseText.match(/```json\s*([\s\S]*?)\s*```/) ||
        responseText.match(/\{[\s\S]*\}/);

      const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : responseText;
      const parsed = JSON.parse(jsonStr.trim());

      // Дополняем анализ временными данными и ценообразованием
      const category = parsed.transformation.category;
      const timeAnalysis = this.analyzeTime(category, timeInMinutes);
      const finalPrice = this.calculatePrice(
        category,
        parsed.quality.overallScore,
      );

      return {
        transformation: parsed.transformation,
        quality: parsed.quality,
        timeAnalysis,
        report: {
          ...parsed.report,
          finalPrice,
        },
      };
    } catch (error) {
      this.logger.error('❌ Failed to parse Claude response:', error.message);
      this.logger.debug('Raw response:', responseText);

      return this.createFallbackAnalysis(timeInMinutes);
    }
  }

  /**
   * Анализ временных показателей
   */
  private analyzeTime(category: string, actualMinutes?: number) {
    const timeRange =
      (TIME_RANGES as any)[category] || TIME_RANGES[HAIRCUT_CATEGORIES.REGULAR];
    const expectedRange = `${timeRange.min}-${timeRange.max} мин`;

    let efficiency: 'excellent' | 'good' | 'acceptable' | 'slow' = 'good';

    if (actualMinutes) {
      if (actualMinutes <= timeRange.min) {
        efficiency = 'excellent';
      } else if (actualMinutes <= timeRange.max) {
        efficiency = 'good';
      } else if (actualMinutes <= timeRange.max * 1.2) {
        efficiency = 'acceptable';
      } else {
        efficiency = 'slow';
      }
    }

    return {
      actualMinutes: actualMinutes || 0,
      expectedRange,
      efficiency,
    };
  }

  /**
   * Расчет итоговой цены
   */
  private calculatePrice(category: string, qualityScore: number): number {
    const pricing =
      (PRICING as any)[category] || PRICING[HAIRCUT_CATEGORIES.REGULAR];
    let finalPrice = pricing.base;

    // Скидка за качество ниже 7
    if (qualityScore < 7) {
      finalPrice *= 1 - pricing.discount;
    }

    return Math.round(finalPrice);
  }

  /**
   * Fallback анализ при ошибке Claude API
   */
  private createFallbackAnalysis(timeInMinutes?: number): IBeforeAfterAnalysis {
    this.logger.warn('🔄 Using fallback analysis due to Claude API error');

    const category = HAIRCUT_CATEGORIES.REGULAR;
    return {
      transformation: {
        category,
        difficultyLevel: 5,
        visualChanges: ['Анализ изображений недоступен'],
        technique: 'Техника не определена - ошибка AI',
      },
      quality: {
        overallScore: 6,
        evenness: 6,
        transitions: 6,
        symmetry: 6,
        cleanliness: 6,
        styleCompliance: 6,
      },
      timeAnalysis: this.analyzeTime(category, timeInMinutes),
      report: {
        summary:
          'Анализ выполнен в резервном режиме - требуется ручная проверка',
        strengths: ['Работа выполнена'],
        improvements: ['Требуется ручная проверка качества'],
        finalPrice: this.calculatePrice(category, 6),
      },
    };
  }

  /**
   * Создание fallback результата когда Claude API недоступен
   */
  private createFallbackResult(error: string): IBeforeAfterAnalysis {
    return {
      transformation: {
        category: 'Обычная стрижка',
        difficultyLevel: 0,
        visualChanges: ['Анализ недоступен - Claude API не настроен'],
        technique: 'Неопределено',
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
        actualMinutes: 0,
        expectedRange: 'Неопределено',
        efficiency: 'acceptable',
      },
      report: {
        summary: `Анализ недоступен: ${error}`,
        strengths: [],
        improvements: [
          'Настройте CLAUDE_API_KEY в переменных окружения',
          'Обратитесь к администратору для получения API ключа',
        ],
        finalPrice: 0,
      },
    };
  }

  /**
   * Проверка доступности OpenRouter API
   */
  async healthCheck(): Promise<boolean> {
    try {
      // Проверяем, настроен ли OpenRouter API
      if (!this.isConfigured || !this.openai) {
        this.logger.warn('⚠️ OpenRouter API не настроен');
        return false;
      }

      // Простой тест-запрос к API
      await this.openai.chat.completions.create({
        model: this.model,
        max_tokens: 10,
        messages: [{ role: 'user', content: 'test' }],
      });
      return true;
    } catch (error) {
      this.logger.error(
        '❌ OpenRouter API health check failed:',
        error.message,
      );
      return false;
    }
  }
}
