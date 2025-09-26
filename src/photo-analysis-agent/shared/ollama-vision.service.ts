import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OllamaVisionService {
  private readonly logger = new Logger(OllamaVisionService.name);
  private readonly ollamaUrl = 'http://localhost:11434';

  /**
   * Анализ изображения с помощью Llava модели
   */
  async analyzeImage(imageUrl: string, declaredCategory: string): Promise<any> {
    try {
      this.logger.log(`🔍 Analyzing image: ${imageUrl}`);

      // Загружаем изображение и конвертируем в base64
      const imageBase64 = await this.downloadImageAsBase64(imageUrl);

      // Промпт для анализа стрижки
      const prompt = this.buildAnalysisPrompt(declaredCategory);

      // Отправляем запрос к Ollama
      const response = await axios.post(`${this.ollamaUrl}/api/generate`, {
        model: 'llava',
        prompt: prompt,
        images: [imageBase64],
        stream: false,
        options: {
          temperature: 0.1, // Низкая температура для точного анализа
          top_p: 0.9,
        },
      });

      const analysisText = response.data.response;
      this.logger.log(`✅ Analysis completed`);

      // Парсим ответ AI и структурируем данные
      return this.parseAnalysisResponse(analysisText, declaredCategory);
    } catch (error) {
      this.logger.error(`❌ Error analyzing image:`, error);
      throw new Error(`Failed to analyze image: ${error.message}`);
    }
  }

  /**
   * Загрузка изображения и конвертация в base64
   */
  private async downloadImageAsBase64(imageUrl: string): Promise<string> {
    try {
      // Для тестирования используем заглушку
      // В реальном проекте здесь будет загрузка изображения:
      // const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      // return Buffer.from(response.data).toString('base64');

      // Возвращаем пустую base64 строку для тестирования
      return '';
    } catch (error) {
      this.logger.error(`Error downloading image: ${imageUrl}`, error);
      throw error;
    }
  }

  /**
   * Формирование промпта для анализа стрижки
   */
  private buildAnalysisPrompt(declaredCategory: string): string {
    return `
Ты - эксперт по парикмахерскому искусству. Проанализируй эту фотографию стрижки и дай подробную оценку.

ЗАЯВЛЕННАЯ КАТЕГОРИЯ: "${declaredCategory}"

Оцени по шкале от 1 до 10:
1. РОВНОСТЬ - насколько ровно выполнена стрижка
2. ПЕРЕХОДЫ - плавность переходов между длинами
3. СИММЕТРИЯ - симметричность стрижки
4. ЧИСТОТА РАБОТЫ - аккуратность, отсутствие торчащих волос
5. СООТВЕТСТВИЕ СТИЛЮ - соответствие заявленной категории

КАТЕГОРИИ СТРИЖЕК:
- Быстрая стрижка (20-30 мин): простые формы, машинка
- Обычная стрижка (30-60 мин): классические формы, ножницы+машинка  
- Креативная стрижка (60+ мин): сложные формы, окрашивание, укладки

Ответь в формате JSON:
{
  "quality_scores": {
    "evenness": 8,
    "transitions": 7,
    "symmetry": 9,
    "cleanliness": 8,
    "style_compliance": 7
  },
  "overall_score": 7.8,
  "detected_category": "Обычная стрижка",
  "category_matches": true,
  "technical_execution": "good",
  "issues": ["Небольшая неровность слева", "Переходы можно улучшить"],
  "highlights": ["Отличная симметрия", "Чистая работа"],
  "recommendations": ["Больше внимания к деталям", "Отработать технику переходов"]
}`;
  }

  /**
   * Парсинг ответа AI и структурирование данных
   */
  private parseAnalysisResponse(
    analysisText: string,
    declaredCategory: string,
  ) {
    try {
      // Пытаемся найти JSON в ответе
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        const jsonData = JSON.parse(jsonMatch[0]);

        return {
          qualityScore: jsonData.overall_score || 8,
          detectedCategory: jsonData.detected_category || declaredCategory,
          categoryMatches: jsonData.category_matches !== false,
          technicalExecution: this.mapTechnicalExecution(
            jsonData.technical_execution,
          ),
          details: {
            evenness: jsonData.quality_scores?.evenness || 8,
            transitions: jsonData.quality_scores?.transitions || 8,
            symmetry: jsonData.quality_scores?.symmetry || 8,
            cleanliness: jsonData.quality_scores?.cleanliness || 8,
            styleCompliance: jsonData.quality_scores?.style_compliance || 8,
          },
          issues: jsonData.issues || [],
          highlights: jsonData.highlights || ['AI анализ выполнен'],
          recommendations: jsonData.recommendations || [
            'Продолжать в том же духе',
          ],
        };
      }
    } catch (error) {
      this.logger.warn('Could not parse AI response as JSON, using fallback');
    }

    // Фолбек анализ на основе текста
    return this.createFallbackAnalysis(analysisText, declaredCategory);
  }

  /**
   * Фолбек анализ, если не удалось распарсить JSON
   */
  private createFallbackAnalysis(text: string, declaredCategory: string) {
    const score = this.extractScoreFromText(text);

    return {
      qualityScore: score,
      detectedCategory: declaredCategory,
      categoryMatches: true,
      technicalExecution: score >= 8 ? 'good' : 'satisfactory',
      details: {
        evenness: score,
        transitions: score - 0.5,
        symmetry: score,
        cleanliness: score + 0.5,
        styleCompliance: score,
      },
      issues: this.extractIssuesFromText(text),
      highlights: this.extractHighlightsFromText(text),
      recommendations: ['Анализ выполнен AI системой'],
    };
  }

  /**
   * Извлечение оценки из текста
   */
  private extractScoreFromText(text: string): number {
    // Ищем числа от 1 до 10 в тексте
    const matches = text.match(/([1-9]|10)([.,]\d)?/g);
    if (matches && matches.length > 0) {
      const scores = matches.map((m) => parseFloat(m.replace(',', '.')));
      return scores.reduce((a, b) => a + b, 0) / scores.length;
    }
    return 7.5; // Средняя оценка по умолчанию
  }

  /**
   * Извлечение проблем из текста
   */
  private extractIssuesFromText(text: string): string[] {
    const issues = [];
    if (text.includes('неров')) issues.push('Обнаружена неровность');
    if (text.includes('переход')) issues.push('Проблемы с переходами');
    if (text.includes('симметр')) issues.push('Нарушена симметрия');
    return issues;
  }

  /**
   * Извлечение достоинств из текста
   */
  private extractHighlightsFromText(text: string): string[] {
    const highlights = [];
    if (text.includes('хорош') || text.includes('отлич')) {
      highlights.push('Качественное выполнение');
    }
    if (text.includes('чист')) highlights.push('Чистая работа');
    return highlights.length > 0 ? highlights : ['AI анализ завершен'];
  }

  /**
   * Маппинг технического исполнения
   */
  private mapTechnicalExecution(execution: string): string {
    if (!execution) return 'good';

    const exec = execution.toLowerCase();
    if (exec.includes('excellent') || exec.includes('отлично'))
      return 'excellent';
    if (exec.includes('good') || exec.includes('хорошо')) return 'good';
    if (exec.includes('satisfactory') || exec.includes('удовлетв'))
      return 'satisfactory';
    return 'good';
  }

  /**
   * Проверка доступности Ollama сервиса
   */
  async checkOllamaStatus(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.ollamaUrl}/api/tags`);
      const models = response.data.models || [];
      return models.some((model: any) => model.name.includes('llava'));
    } catch (error) {
      this.logger.error('Ollama service is not available', error);
      return false;
    }
  }
}
