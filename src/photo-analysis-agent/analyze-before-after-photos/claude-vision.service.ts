import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import axios from 'axios';
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
      // Проверяем тип ключа
      if (claudeConfig.apiKey.startsWith('sk-or-v1-')) {
        // OpenRouter ключ - используем их endpoint
        this.anthropic = new Anthropic({
          apiKey: claudeConfig.apiKey,
          baseURL: 'https://openrouter.ai/api/v1',
        });
        this.logger.log('✅ Claude Vision Service initialized with OpenRouter');
      } else {
        // Прямой Anthropic ключ
        this.anthropic = new Anthropic({
          apiKey: claudeConfig.apiKey,
        });
        this.logger.log('✅ Claude Vision Service initialized with Anthropic');
      }
      this.isConfigured = true;
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
    if (!this.isConfigured) {
      this.logger.error('❌ Claude API не настроен');
      return this.createFallbackResult('Claude API не настроен');
    }

    try {
      const claudeConfig = this.configService.get<ClaudeConfig>('claude');

      // Определяем тип API ключа
      if (claudeConfig?.apiKey?.startsWith('sk-or-')) {
        this.logger.log('🔄 Using OpenRouter API...');
        return await this.analyzeWithOpenRouter(
          beforePhotoBase64,
          afterPhotoBase64,
          claudeConfig,
        );
      } else if (claudeConfig?.apiKey?.startsWith('sk-ant-')) {
        this.logger.log('🔄 Using Anthropic API...');
        return await this.analyzeWithAnthropic(
          beforePhotoBase64,
          afterPhotoBase64,
          claudeConfig,
        );
      } else {
        this.logger.warn('⚠️ Unknown API key format, using fallback...');
        return this.createFallbackResult('Неподдерживаемый формат API ключа');
      }
    } catch (error) {
      this.logger.error('Error analyzing photos with Claude:', error.message);
      return this.createFallbackResult('Ошибка анализа Claude');
    }
  }

  private async analyzeWithOpenRouter(
    beforePhotoBase64: string,
    afterPhotoBase64: string,
    claudeConfig: ClaudeConfig,
  ): Promise<IBeforeAfterAnalysis> {
    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: claudeConfig?.model || 'anthropic/claude-3.5-sonnet:beta',
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
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${beforePhotoBase64}`,
                  },
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${afterPhotoBase64}`,
                  },
                },
              ],
            },
          ],
          max_tokens: claudeConfig?.maxTokens || 4000,
          temperature: claudeConfig?.temperature || 0.1,
        },
        {
          headers: {
            Authorization: `Bearer ${claudeConfig.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://kanban-ai-agent.local',
            'X-Title': 'Kanban AI Agent - Haircut Analysis',
          },
        },
      );

      const content = response.data.choices[0]?.message?.content;
      if (content) {
        return this.parseClaudeResponse(content);
      } else {
        throw new Error('Empty response from OpenRouter');
      }
    } catch (error) {
      this.logger.error(
        'OpenRouter API error:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  private async analyzeWithAnthropic(
    beforePhotoBase64: string,
    afterPhotoBase64: string,
    claudeConfig: ClaudeConfig,
  ): Promise<IBeforeAfterAnalysis> {
    if (!this.anthropic) {
      throw new Error('Anthropic client not initialized');
    }

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
        visualChanges: [
          'Укорочена длина волос',
          'Подровнены кончики',
          'Создан аккуратный силуэт',
        ],
        technique: 'Базовая стрижка ножницами',
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
        'Результат соответствует ожиданиям',
        'Для детального анализа требуется активация Claude AI',
        `Техническая информация: ${reason}`,
      ],
    };
  }
}
