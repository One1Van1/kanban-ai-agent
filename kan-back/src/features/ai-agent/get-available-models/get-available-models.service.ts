import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  GetAvailableModelsResponseDto,
  AIModel,
} from './get-available-models.response.dto';

@Injectable()
export class GetAvailableModelsService {
  private readonly logger = new Logger(GetAvailableModelsService.name);

  constructor(private readonly configService: ConfigService) {}

  async execute(): Promise<GetAvailableModelsResponseDto> {
    this.logger.log('🤖 Getting available AI models');

    try {
      // Получаем информацию о доступных моделях из конфигурации и определяем их статус
      const models = await this.getModelsConfiguration();

      this.logger.log(`📊 Found ${models.length} AI models`);

      return new GetAvailableModelsResponseDto(
        models,
        `Successfully retrieved ${models.length} AI models`,
      );
    } catch (error) {
      this.logger.error('❌ Failed to get available models:', error.stack);
      throw new Error(`Failed to get available models: ${error.message}`);
    }
  }

  /**
   * Получает конфигурацию доступных AI моделей
   */
  private async getModelsConfiguration(): Promise<AIModel[]> {
    const models: AIModel[] = [];

    // Claude модели через OpenRouter (уже настроенные в проекте)
    const claudeApiKey = this.configService.get<string>('claude.apiKey');
    const claudeModel = this.configService.get<string>('claude.model');
    const claudeMaxTokens = this.configService.get<number>('claude.maxTokens');
    const claudeTemperature =
      this.configService.get<number>('claude.temperature');

    // Добавляем Claude модели
    if (claudeApiKey) {
      models.push(
        {
          id: 'claude-3-sonnet-20240229',
          name: 'Claude 3 Sonnet',
          provider: 'Anthropic',
          description:
            'Most balanced model for complex reasoning and creative tasks',
          maxTokens: claudeMaxTokens || 4000,
          contextWindow: 200000,
          capabilities: ['text', 'vision', 'reasoning', 'coding'],
          pricing: {
            inputCost: 0.003,
            outputCost: 0.015,
            currency: 'USD',
          },
          isAvailable: true,
        },
        {
          id: 'claude-3-haiku-20240307',
          name: 'Claude 3 Haiku',
          provider: 'Anthropic',
          description: 'Fastest and most cost-effective model for simple tasks',
          maxTokens: claudeMaxTokens || 4000,
          contextWindow: 200000,
          capabilities: ['text', 'vision', 'reasoning'],
          pricing: {
            inputCost: 0.00025,
            outputCost: 0.00125,
            currency: 'USD',
          },
          isAvailable: true,
        },
        {
          id: 'claude-3-opus-20240229',
          name: 'Claude 3 Opus',
          provider: 'Anthropic',
          description: 'Most powerful model for highly complex tasks',
          maxTokens: claudeMaxTokens || 4000,
          contextWindow: 200000,
          capabilities: ['text', 'vision', 'reasoning', 'coding', 'analysis'],
          pricing: {
            inputCost: 0.015,
            outputCost: 0.075,
            currency: 'USD',
          },
          isAvailable: true,
        },
      );
    }

    // OpenAI модели (если настроены)
    const openaiApiKey = this.configService.get<string>('openai.apiKey');
    if (openaiApiKey) {
      models.push(
        {
          id: 'gpt-4-turbo',
          name: 'GPT-4 Turbo',
          provider: 'OpenAI',
          description: 'Latest GPT-4 model with enhanced performance and speed',
          maxTokens: 4096,
          contextWindow: 128000,
          capabilities: ['text', 'coding', 'reasoning'],
          pricing: {
            inputCost: 0.01,
            outputCost: 0.03,
            currency: 'USD',
          },
          isAvailable: true,
        },
        {
          id: 'gpt-4-vision-preview',
          name: 'GPT-4 Vision',
          provider: 'OpenAI',
          description:
            'GPT-4 model with vision capabilities for image analysis',
          maxTokens: 4096,
          contextWindow: 128000,
          capabilities: ['text', 'vision', 'coding', 'reasoning'],
          pricing: {
            inputCost: 0.01,
            outputCost: 0.03,
            currency: 'USD',
          },
          isAvailable: true,
        },
      );
    }

    // Google Gemini модели (если настроены)
    const geminiApiKey = this.configService.get<string>('gemini.apiKey');
    if (geminiApiKey) {
      models.push({
        id: 'gemini-pro',
        name: 'Gemini Pro',
        provider: 'Google',
        description: 'Powerful multimodal AI model by Google',
        maxTokens: 2048,
        contextWindow: 32000,
        capabilities: ['text', 'vision', 'reasoning', 'coding'],
        pricing: {
          inputCost: 0.0005,
          outputCost: 0.0015,
          currency: 'USD',
        },
        isAvailable: true,
      });
    }

    // Если нет настроенных моделей, добавляем демо модели
    if (models.length === 0) {
      models.push({
        id: 'demo-model',
        name: 'Demo AI Model',
        provider: 'Demo',
        description:
          'Demo model for testing purposes (no real AI functionality)',
        maxTokens: 1000,
        contextWindow: 4000,
        capabilities: ['text'],
        isAvailable: false,
      });
    }

    // Проверяем доступность моделей
    return await this.checkModelsAvailability(models);
  }

  /**
   * Проверяет доступность AI моделей
   */
  private async checkModelsAvailability(models: AIModel[]): Promise<AIModel[]> {
    const checkedModels = [...models];

    for (const model of checkedModels) {
      try {
        // Для Claude моделей проверяем наличие API ключа
        if (model.provider === 'Anthropic') {
          const claudeApiKey = this.configService.get<string>('claude.apiKey');
          model.isAvailable = !!claudeApiKey;
        }
        // Для OpenAI проверяем наличие API ключа
        else if (model.provider === 'OpenAI') {
          const openaiApiKey = this.configService.get<string>('openai.apiKey');
          model.isAvailable = !!openaiApiKey;
        }
        // Для Google Gemini проверяем наличие API ключа
        else if (model.provider === 'Google') {
          const geminiApiKey = this.configService.get<string>('gemini.apiKey');
          model.isAvailable = !!geminiApiKey;
        }
        // Для демо моделей
        else if (model.provider === 'Demo') {
          model.isAvailable = false;
        }

        this.logger.debug(
          `Model ${model.name}: ${model.isAvailable ? 'Available' : 'Not Available'}`,
        );
      } catch (error) {
        this.logger.warn(
          `Failed to check availability for model ${model.name}:`,
          error.message,
        );
        model.isAvailable = false;
      }
    }

    return checkedModels;
  }
}
