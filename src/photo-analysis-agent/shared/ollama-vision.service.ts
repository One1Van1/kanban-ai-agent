import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OllamaVisionService {
  private readonly logger = new Logger(OllamaVisionService.name);
  private readonly ollamaUrl = 'http://localhost:11434';

  /**
   * Анализ изображения с помощью Llava модели
   */
  async analyzeImage(
    imageUrlOrBase64: string,
    isBase64: boolean = false,
    category: string = 'Обычная стрижка',
  ): Promise<any> {
    try {
      let imageData: string;

      if (isBase64) {
        // Check image size and optimize if needed
        const sizeKB = (imageUrlOrBase64.length * 3) / 4 / 1024;
        this.logger.log(`🔍 Analyzing base64 image (${sizeKB.toFixed(1)}KB)`);

        // If image is too large, we could implement resizing here
        if (sizeKB > 100) {
          this.logger.warn(
            `⚠️ Large image detected (${sizeKB.toFixed(1)}KB) - Ollama may have resource issues`,
          );
        }

        imageData = imageUrlOrBase64;
      } else {
        // Download image and convert to base64
        const response = await axios.get(imageUrlOrBase64, {
          responseType: 'arraybuffer',
        });
        const buffer = Buffer.from(response.data);
        imageData = buffer.toString('base64');
        this.logger.log(`🔍 Analyzing image: ${imageUrlOrBase64}`);
      }

      const prompt = this.buildAnalysisPrompt(category);

      const requestData = {
        model: 'llava',
        prompt,
        images: [imageData],
        stream: false,
        options: {
          temperature: 0.1,
          top_p: 0.9,
        },
      };

      this.logger.log('📤 Sending request to Ollama...');

      // Log the prompt for debugging
      this.logger.debug(`🔍 Analysis prompt: ${prompt.substring(0, 300)}...`);

      const response = await axios.post(
        `${this.ollamaUrl}/api/generate`,
        requestData,
        { timeout: 60000 },
      );

      if (response.data && response.data.response) {
        this.logger.log('✅ Analysis completed');

        // Извлекаем JSON из ответа, очищая от markdown форматирования
        let jsonResponse = response.data.response.trim();

        // Удаляем markdown блоки ```json ... ```
        jsonResponse = jsonResponse
          .replace(/^```json\s*/i, '')
          .replace(/\s*```$/i, '')
          .trim();

        try {
          return JSON.parse(jsonResponse);
        } catch (parseError) {
          this.logger.warn(
            'Failed to parse JSON from Ollama response, attempting to extract JSON',
          );

          // Пытаемся найти JSON объект в ответе
          const jsonMatch = jsonResponse.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
          }

          throw new Error(
            `Invalid JSON format in Ollama response: ${parseError.message}`,
          );
        }
      } else {
        throw new Error('Invalid response from Ollama');
      }
    } catch (error) {
      this.logger.error('Error analyzing image with Ollama:', error.message);
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
Ты - эксперт по парикмахерскому искусству. Проанализируй эту фотографию стрижки и дай подробную оценку КАЧЕСТВА ВЫПОЛНЕНИЯ.

ЗАЯВЛЕННАЯ КАТЕГОРИЯ: "${declaredCategory}"

ВАЖНО: Не меняй заявленную категорию! Просто оцени качество выполнения для данной категории.

Оцени по шкале от 1 до 10:
1. РОВНОСТЬ - насколько ровно выполнена стрижка
2. ПЕРЕХОДЫ - плавность переходов между длинами
3. СИММЕТРИЯ - симметричность стрижки
4. ЧИСТОТА РАБОТЫ - аккуратность, отсутствие торчащих волос
5. СООТВЕТСТВИЕ СТИЛЮ - соответствие заявленной категории

ВАЖНО! КАТЕГОРИИ СТРИЖЕК - внимательно определи правильную:

🔥 БЫСТРАЯ СТРИЖКА (20-30 мин):
- Волосы стрижены машинкой под одну насадку или с минимальными переходами
- Простые формы: бокс, полубокс, "под ноль"
- Минимум работы ножницами
- Быстрое исполнение, основной инструмент - машинка
- ПРИЗНАКИ: очень короткие бока, четкие линии, минимум градации

⭐ ОБЫЧНАЯ СТРИЖКА (30-60 мин):
- Классические мужские стрижки с плавными переходами
- Использование ножниц + машинка
- Средняя сложность, градиентные переходы
- Более детальная проработка формы
- ПРИЗНАКИ: плавные переходы, работа ножницами, средняя длина

🎨 КРЕАТИВНАЯ СТРИЖКА (60+ мин):
- Сложные формы, узоры, нестандартные решения
- Асимметрия, окрашивание, укладки
- Высокая сложность исполнения
- ПРИЗНАКИ: необычные формы, цветовые акценты, сложная геометрия

ВНИМАТЕЛЬНО посмотри на фото и определи:
- Какими инструментами делалась стрижка (только машинка или ножницы тоже)?
- Есть ли плавные переходы или четкие линии?
- Какова общая сложность исполнения?

КЛЮЧЕВЫЕ ПРИЗНАКИ:
🔥 БЫСТРАЯ = только машинка, четкие линии, одна длина, минимум градации
⭐ ОБЫЧНАЯ = машинка + ножницы, плавные переходы, средняя градация  
🎨 КРЕАТИВНАЯ = сложная форма, необычные элементы, высокая градация

ОБЯЗАТЕЛЬНО: Если видишь короткие бока под машинку и простую форму - это БЫСТРАЯ СТРИЖКА!

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
  "detected_category": "${declaredCategory}",
  "category_matches": true,
  "technical_execution": "good",
  "issues": ["Небольшая неровность слева", "Переходы можно улучшить"],
  "highlights": ["Отличная симметрия", "Чистая работа"],
  "recommendations": ["Больше внимания к деталям"]
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
          detectedCategory: declaredCategory, // Always use declared category
          categoryMatches: true, // Always true since we trust the declared category
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
