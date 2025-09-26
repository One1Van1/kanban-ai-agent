import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { ClaudeConfig } from '../../config/claude.config';

export interface IBeforeAfterAnalysis {
  transformation: {
    category: 'Быстрая стрижка' | 'Обычная стрижка' | 'Сложная стрижка';
    difficultyLevel: number;
    visualChanges: string[];
    technique: string;
  };
  quality: {
    overallScore: number;
    evenness: number;
    transitions: number;
    symmetry: number;
    cleanliness: number;
    styleCompliance: number;
  };
  recommendations: string[];
}

@Injectable()
export class ClaudeVisionService {
  private readonly logger = new Logger(ClaudeVisionService.name);
  private readonly anthropic: Anthropic | null = null;
  private readonly isConfigured: boolean = false;

  constructor(private readonly configService: ConfigService) {
    const claudeConfig = this.configService.get<ClaudeConfig>('claude');

    if (claudeConfig?.apiKey && claudeConfig.apiKey.trim() !== '') {
      this.anthropic = new Anthropic({
        apiKey: claudeConfig.apiKey,
      });
      this.isConfigured = true;
      this.logger.log('✅ Claude Vision Service initialized');
    } else {
      this.logger.warn(
        '⚠️ CLAUDE_API_KEY not found - Claude Vision будет недоступен',
      );
    }
  }

  async analyzeBeforeAfterPhotos(
    beforePhotoBase64: string,
    afterPhotoBase64: string,
  ): Promise<IBeforeAfterAnalysis> {
    // Проверяем, настроен ли Claude API
    if (!this.isConfigured || !this.anthropic) {
      this.logger.error('❌ Claude API не настроен');
      return this.createFallbackResult('Claude API не настроен');
    }

    try {
      const claudeConfig = this.configService.get<ClaudeConfig>('claude');

      const response = await this.anthropic.messages.create({
        model: claudeConfig?.model || 'claude-3-5-sonnet-20241022',
        max_tokens: claudeConfig?.maxTokens || 4000,
        temperature: claudeConfig?.temperature || 0.1,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Проанализируй фотографии стрижки ДО и ПОСЛЕ. Оцени:
1. Категорию сложности (Быстрая/Обычная/Сложная стрижка)
2. Качество выполнения по критериям (оценка 1-10):
   - Общая оценка
   - Ровность стрижки
   - Плавность переходов
   - Симметричность
   - Чистота работы
   - Соответствие стилю

3. Дай конкретные рекомендации для улучшения.

Ответь в формате JSON:
{
  "transformation": {
    "category": "тип стрижки",
    "difficultyLevel": число,
    "visualChanges": ["изменение1", "изменение2"],
    "technique": "описание техники"
  },
  "quality": {
    "overallScore": число,
    "evenness": число,
    "transitions": число,
    "symmetry": число,
    "cleanliness": число,
    "styleCompliance": число
  },
  "recommendations": ["рекомендация1", "рекомендация2"]
}`,
              },
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: beforePhotoBase64,
                },
              },
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: afterPhotoBase64,
                },
              },
            ],
          },
        ],
      });

      const content = response.content[0];
      if (content.type === 'text') {
        return this.parseClaudeResponse(content.text);
      } else {
        throw new Error('Unexpected response type from Claude');
      }
    } catch (error) {
      this.logger.error('Error analyzing photos with Claude:', error.message);
      return this.createFallbackResult('Ошибка анализа Claude');
    }
  }

  private parseClaudeResponse(responseText: string): IBeforeAfterAnalysis {
    try {
      // Извлекаем JSON из ответа
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed;
      } else {
        throw new Error('No JSON found in Claude response');
      }
    } catch (error) {
      this.logger.error('Error parsing Claude response:', error.message);
      return this.createFallbackResult('Ошибка парсинга ответа');
    }
  }

  private createFallbackResult(reason: string): IBeforeAfterAnalysis {
    return {
      transformation: {
        category: 'Обычная стрижка',
        difficultyLevel: 5,
        visualChanges: [`Анализ недоступен - ${reason}`],
        technique: 'Не определена',
      },
      quality: {
        overallScore: 7,
        evenness: 7,
        transitions: 7,
        symmetry: 7,
        cleanliness: 7,
        styleCompliance: 7,
      },
      recommendations: [
        `Claude анализ недоступен: ${reason}`,
        'Настройте CLAUDE_API_KEY для получения детального анализа',
      ],
    };
  }
}
