import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { TaskAnalysisDto, AIAnalysisResultDto } from '../dto';
import { AIDecision } from '../types';
import { ClaudeConfig } from '../config';

@Injectable()
export class AIAnalysisService {
  private readonly logger = new Logger(AIAnalysisService.name);
  private readonly anthropic: Anthropic;
  private readonly claudeConfig: ClaudeConfig;

  constructor(private readonly configService: ConfigService) {
    this.claudeConfig = this.configService.get<ClaudeConfig>('claude')!;

    if (!this.claudeConfig.apiKey) {
      this.logger.warn(
        'Claude API key not configured. AI analysis will be disabled.',
      );
      return;
    }

    this.anthropic = new Anthropic({
      apiKey: this.claudeConfig.apiKey,
    });

    this.logger.log('AI Analysis Service initialized with Claude API');
  }

  async analyzeTask(taskData: TaskAnalysisDto): Promise<AIAnalysisResultDto> {
    this.logger.log(`Analyzing task: ${taskData.title}`);

    if (!this.anthropic) {
      this.logger.warn('Claude API not available, using fallback logic');
      return this.getFallbackDecision(taskData);
    }

    try {
      const prompt = this.buildAnalysisPrompt(taskData);

      const response = await this.anthropic.messages.create({
        model: this.claudeConfig.model,
        max_tokens: this.claudeConfig.maxTokens,
        temperature: this.claudeConfig.temperature,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const result = this.parseClaudeResponse(response);

      this.logger.log(`AI Analysis complete. Decision: ${result.decision}`);
      return result;
    } catch (error) {
      this.logger.error(`Error calling Claude API: ${error.message}`);
      this.logger.warn('Falling back to local decision logic');
      return this.getFallbackDecision(taskData);
    }
  }

  private buildAnalysisPrompt(taskData: TaskAnalysisDto): string {
    return `
Проанализируй следующую задачу из Jira и определи, нужны ли дополнительные вопросы для уточнения или задача готова к выполнению.

ЗАДАЧА:
Название: "${taskData.title}"
Описание: "${taskData.description}"
${taskData.priority ? `Приоритет: ${taskData.priority}` : ''}
${taskData.labels?.length ? `Метки: ${taskData.labels.join(', ')}` : ''}
${taskData.context ? `Контекст: ${taskData.context}` : ''}

КРИТЕРИИ АНАЛИЗА:
1. Достаточность информации для выполнения
2. Четкость требований
3. Наличие всех необходимых деталей
4. Отсутствие неопределенностей

ВАРИАНТЫ РЕШЕНИЙ:
- "questions" - если нужны дополнительные вопросы/уточнения
- "in_progress" - если задача готова к выполнению

ФОРМАТ ОТВЕТА (строго JSON):
{
  "decision": "questions" | "in_progress",
  "reasoning": "подробное обоснование решения",
  "questions": ["вопрос 1", "вопрос 2"] (только если decision = "questions"),
  "suggestedActions": ["действие 1", "действие 2"] (только если decision = "in_progress")
}

Ответь только JSON, без дополнительного текста.
`;
  }

  private parseClaudeResponse(
    response: Anthropic.Messages.Message,
  ): AIAnalysisResultDto {
    try {
      // Извлекаем текст из ответа Claude
      const textContent = response.content
        .filter((block) => block.type === 'text')
        .map((block) => (block as any).text)
        .join('');

      // Парсим JSON из ответа
      const parsed = JSON.parse(textContent);

      // Валидируем структуру ответа
      if (!parsed.decision || !parsed.reasoning) {
        throw new Error('Invalid response structure from Claude');
      }

      if (!['questions', 'in_progress'].includes(parsed.decision)) {
        throw new Error(`Invalid decision value: ${parsed.decision}`);
      }

      return {
        decision: parsed.decision as 'questions' | 'in_progress',
        reasoning: parsed.reasoning,
        questions: parsed.questions || undefined,
        suggestedActions: parsed.suggestedActions || undefined,
      };
    } catch (error) {
      this.logger.error(`Error parsing Claude response: ${error.message}`);
      throw new Error('Failed to parse AI response');
    }
  }

  /**
   * Fallback логика на случай недоступности Claude API
   * (та же логика, что была в WebhookService)
   */
  private getFallbackDecision(taskData: TaskAnalysisDto): AIAnalysisResultDto {
    const { title, description } = taskData;

    const hasQuestionWords =
      /\b(как|что|зачем|почему|когда|где|уточнить|вопрос|помочь)\b/i.test(
        `${title} ${description}`,
      );

    const isTooShort = description.length < 50;

    if (hasQuestionWords || isTooShort) {
      return {
        decision: 'questions',
        reasoning:
          'Задача содержит вопросительные слова или недостаточно детализирована (fallback logic)',
        questions: [
          'Пожалуйста, уточните требования',
          'Добавьте больше деталей в описание',
        ],
      };
    }

    return {
      decision: 'in_progress',
      reasoning:
        'Задача содержит достаточно информации для выполнения (fallback logic)',
      suggestedActions: ['Приступить к выполнению', 'Создать план работы'],
    };
  }
}
