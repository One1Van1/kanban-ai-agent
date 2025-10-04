import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  ProcessWebhookBeforeAfterDto,
  ProcessWebhookBeforeAfterResponseDto,
} from './process-webhook-before-after.dto';
import {
  IWebhookProcessingResult,
  IPhotoExtractionResult,
  IClaudeAnalysisResult,
} from './process-webhook-before-after.interface';

@Injectable()
export class ProcessWebhookBeforeAfterService {
  private readonly logger = new Logger(ProcessWebhookBeforeAfterService.name);
  private readonly baseUrl: string;
  private readonly processingTasks = new Set<string>(); // 🔒 Защита от параллельной обработки

  constructor(private readonly configService: ConfigService) {
    this.baseUrl =
      this.configService.get<string>('app.baseUrl') || 'http://localhost:3000';
  }

  /**
   * Главный метод обработки webhook'а для Claude анализа
   * Автоматически анализирует задачи со статусом Review + фотографии
   */
  async processWebhookBeforeAfter(
    dto: ProcessWebhookBeforeAfterDto,
  ): Promise<ProcessWebhookBeforeAfterResponseDto> {
    const { issue, webhookEvent } = dto;
    const taskKey = issue?.key;

    this.logger.log(
      `🎯 Processing Claude webhook: ${webhookEvent} for task ${taskKey}`,
    );

    // 🔒 Проверка на параллельную обработку
    if (this.processingTasks.has(taskKey!)) {
      this.logger.warn(
        `🔒 Task ${taskKey} is already being processed, skipping`,
      );
      return {
        success: true,
        message: 'Task is already being processed',
        processed: false,
        taskKey,
        timestamp: new Date().toISOString(),
      };
    }

    // Добавляем задачу в обработку
    this.processingTasks.add(taskKey!);

    try {
      // 1. Валидация условий для Claude анализа
      const validationResult = await this.validateClaudeConditions(dto);
      if (!validationResult.shouldProcess) {
        this.processingTasks.delete(taskKey!); // 🧹 Очистка перед выходом
        return {
          success: true,
          message: validationResult.reason,
          processed: false,
          taskKey,
          timestamp: new Date().toISOString(),
        };
      }

      // 2. Извлечение фотографий ДО/ПОСЛЕ из Jira
      const photosResult = await this.extractBeforeAfterPhotos(taskKey!);
      if (!photosResult.success) {
        this.logger.warn(
          `📷 No photos found for ${taskKey}: ${photosResult.message}`,
        );

        // 🚫 Нет фото → перемещаем в Questions + комментарий
        await this.moveTaskToQuestionsWithComment(taskKey!);

        this.processingTasks.delete(taskKey!); // 🧹 Очистка перед выходом
        return {
          success: true,
          message: `Task moved to Questions: no photos found`,
          processed: true,
          taskKey,
          timestamp: new Date().toISOString(),
        };
      }

      // 3. Анализ фотографий через Claude
      const claudeResult = await this.analyzeWithClaude(taskKey!, photosResult);

      // 4. Обработка результатов и комментарий в Jira
      await this.postResultsToJira(taskKey!, claudeResult);

      // 5. ✅ Есть фото → перемещаем в Done
      await this.moveTaskToDone(taskKey!);

      this.logger.log(`✅ Claude webhook completed for ${taskKey}`);

      return {
        success: true,
        message: 'Claude analysis completed successfully',
        processed: true,
        taskKey,
        analysis: claudeResult.analysis || undefined,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(
        `❌ Claude webhook failed for ${taskKey}:`,
        error.message,
      );

      return {
        success: false,
        message: 'Claude webhook processing failed',
        processed: false,
        taskKey,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    } finally {
      // 🧹 Убираем задачу из обработки
      this.processingTasks.delete(taskKey!);
    }
  }

  /**
   * Проверяет условия для запуска Claude анализа
   */
  private async validateClaudeConditions(
    dto: ProcessWebhookBeforeAfterDto,
  ): Promise<{
    shouldProcess: boolean;
    reason: string;
  }> {
    const { issue, webhookEvent } = dto;
    const taskKey = issue?.key;

    // Проверяем тип события
    if (!['jira:issue_updated'].includes(webhookEvent)) {
      return {
        shouldProcess: false,
        reason: `Event type ${webhookEvent} not supported for Claude analysis`,
      };
    }

    // Проверяем наличие ключевых слов стрижки
    const haircutKeywords = [
      'стрижк',
      'haircut',
      'причёск',
      'парикмахер',
      'hair',
      'волос',
      'укладк',
      'стиль',
      'подстриг',
      'окрашивание',
      'маникюр',
    ];

    const summary = (issue?.fields?.summary || '').toLowerCase();
    const description = (issue?.fields?.description || '').toLowerCase();
    const hasHaircutKeywords = haircutKeywords.some(
      (keyword) => summary.includes(keyword) || description.includes(keyword),
    );

    if (!hasHaircutKeywords) {
      return {
        shouldProcess: false,
        reason: 'Task does not contain haircut-related keywords',
      };
    }

    // Проверяем статус (Review, Testing, Done)
    const currentStatus = issue?.fields?.status?.name;
    const triggerStatuses = ['Review', 'Testing', 'Done'];

    if (!triggerStatuses.includes(currentStatus)) {
      return {
        shouldProcess: false,
        reason: `Status ${currentStatus} not in trigger list [${triggerStatuses.join(', ')}]`,
      };
    }

    // 🚫 НОВАЯ ПРОВЕРКА: Уже есть анализ Claude?
    const hasExistingAnalysis = await this.checkExistingClaudeAnalysis(
      taskKey!,
    );
    if (hasExistingAnalysis) {
      // 📸 Дополнительная проверка: если есть анализ "НЕТ РЕЗУЛЬТАТА", но сейчас появились фото
      const hasPhotosNow = await this.hasPhotoAttachments(taskKey!);
      const hasNoResultComment = await this.hasNoResultComment(taskKey!);

      if (hasNoResultComment && hasPhotosNow) {
        this.logger.log(
          `🔄 Re-processing ${taskKey}: photos added after 'no result' analysis`,
        );
        return {
          shouldProcess: true,
          reason: 'Photos added after previous no-result analysis',
        };
      }

      // ✅ НОВАЯ ЛОГИКА: Если есть успешный анализ, переносим в Done
      const hasSuccessfulAnalysis = await this.hasSuccessfulClaudeAnalysis(
        taskKey!,
      );
      if (hasSuccessfulAnalysis && currentStatus !== 'Done') {
        this.logger.log(
          `✅ Found successful Claude analysis for ${taskKey}, moving to Done`,
        );
        // Переносим в Done без повторного анализа
        await this.moveTaskToDone(taskKey!);
        return {
          shouldProcess: false,
          reason: 'Task moved to Done: successful analysis already exists',
        };
      }

      return {
        shouldProcess: false,
        reason: 'Claude analysis already exists for this task',
      };
    }

    return {
      shouldProcess: true,
      reason: 'All conditions met for Claude analysis',
    };
  }

  /**
   * Проверяет, есть ли уже анализ Claude в комментариях задачи
   */
  private async checkExistingClaudeAnalysis(taskKey: string): Promise<boolean> {
    try {
      const jiraConfig = {
        baseURL: this.configService.get<string>('jira.baseUrl'),
        auth: {
          username: this.configService.get<string>('jira.email') || '',
          password: this.configService.get<string>('jira.apiToken') || '',
        },
      };

      const response = await axios.get(
        `/rest/api/3/issue/${taskKey}/comment`,
        jiraConfig,
      );

      const comments = response.data.comments || [];
      const hasClaudeAnalysis = comments.some((comment: any) => {
        const bodyText =
          typeof comment.body === 'string'
            ? comment.body
            : comment.body?.content
              ? comment.body.content
                  .map(
                    (c: any) =>
                      c.content?.map((t: any) => t.text || '').join('') || '',
                  )
                  .join('')
              : '';

        return (
          bodyText &&
          (bodyText.includes('АНАЛИЗ CLAUDE') ||
            bodyText.includes('Claude Vision API') ||
            bodyText.includes('🤖'))
        );
      });

      if (hasClaudeAnalysis) {
        this.logger.log(`🔍 Found existing Claude analysis for ${taskKey}`);
      }

      return hasClaudeAnalysis;
    } catch (error) {
      this.logger.warn(
        `Failed to check existing comments for ${taskKey}: ${error.message}`,
      );
      return false; // В случае ошибки разрешаем анализ
    }
  }

  /**
   * Извлекает фотографии ДО/ПОСЛЕ из задачи Jira
   */
  private async extractBeforeAfterPhotos(
    taskKey: string,
  ): Promise<IPhotoExtractionResult> {
    try {
      // Получаем полные данные задачи включая attachments
      const jiraConfig = {
        baseURL: this.configService.get<string>('jira.baseUrl'),
        auth: {
          username: this.configService.get<string>('jira.email') || '',
          password: this.configService.get<string>('jira.apiToken') || '',
        },
      };

      const response = await axios.get(
        `/rest/api/3/issue/${taskKey}?expand=attachment`,
        jiraConfig,
      );

      const attachments = response.data.fields.attachment || [];
      if (attachments.length === 0) {
        return { success: false, message: 'No attachments found' };
      }

      // Фильтруем только изображения
      const imageAttachments = attachments.filter(
        (att: any) => att.mimeType && att.mimeType.startsWith('image/'),
      );

      if (imageAttachments.length < 2) {
        return {
          success: false,
          message: `Need at least 2 photos, found ${imageAttachments.length}`,
        };
      }

      // Сначала пробуем найти по ключевым словам
      const beforeKeywords = ['before', 'до', 'pre', 'исходн', 'начальн'];
      const afterKeywords = [
        'after',
        'после',
        'post',
        'result',
        'итог',
        'финальн',
      ];

      let beforePhoto = imageAttachments.find((att: any) =>
        beforeKeywords.some((keyword) =>
          att.filename.toLowerCase().includes(keyword),
        ),
      );

      let afterPhoto = imageAttachments.find((att: any) =>
        afterKeywords.some((keyword) =>
          att.filename.toLowerCase().includes(keyword),
        ),
      );

      // Если не нашли по ключевым словам, используем время создания
      if (!beforePhoto || !afterPhoto) {
        this.logger.log(
          '🕒 Photos not found by keywords, using time-based detection',
        );

        // Сортируем по времени создания (самый ранний = ДО, самый поздний = ПОСЛЕ)
        const sortedByTime = imageAttachments.sort(
          (a: any, b: any) =>
            new Date(a.created).getTime() - new Date(b.created).getTime(),
        );

        beforePhoto = sortedByTime[0]; // Самый ранний
        afterPhoto = sortedByTime[sortedByTime.length - 1]; // Самый поздний

        this.logger.log(
          `📷 Auto-detected: Before="${beforePhoto.filename}" (${beforePhoto.created}), After="${afterPhoto.filename}" (${afterPhoto.created})`,
        );
      }

      if (!beforePhoto || !afterPhoto) {
        return {
          success: false,
          message: `Missing photos - Before: ${beforePhoto ? 'found' : 'missing'}, After: ${afterPhoto ? 'found' : 'missing'}`,
        };
      }

      // Загружаем содержимое фотографий
      const beforeContent = await this.downloadPhotoAsBase64(
        beforePhoto.content,
        jiraConfig,
      );
      const afterContent = await this.downloadPhotoAsBase64(
        afterPhoto.content,
        jiraConfig,
      );

      return {
        success: true,
        message: 'Photos extracted successfully',
        beforePhoto: {
          filename: beforePhoto.filename,
          content: beforeContent,
          url: beforePhoto.content,
        },
        afterPhoto: {
          filename: afterPhoto.filename,
          content: afterContent,
          url: afterPhoto.content,
        },
      };
    } catch (error) {
      this.logger.error(
        `Error extracting photos from ${taskKey}:`,
        error.message,
      );
      return {
        success: false,
        message: `Photo extraction failed: ${error.message}`,
      };
    }
  }

  /**
   * Загружает фото из Jira и конвертирует в base64
   */
  private async downloadPhotoAsBase64(
    photoUrl: string,
    jiraConfig: any,
  ): Promise<string> {
    try {
      const response = await axios.get(photoUrl, {
        ...jiraConfig,
        responseType: 'arraybuffer',
      });

      const buffer = Buffer.from(response.data);
      return buffer.toString('base64');
    } catch (error) {
      this.logger.error(
        `Error downloading photo from ${photoUrl}:`,
        error.message,
      );
      throw new Error(`Photo download failed: ${error.message}`);
    }
  }

  /**
   * Отправляет фотографии на анализ в Claude
   */
  private async analyzeWithClaude(
    taskKey: string,
    photosResult: IPhotoExtractionResult,
  ): Promise<IClaudeAnalysisResult> {
    try {
      const claudeRequest = {
        taskKey,
        beforePhoto: photosResult.beforePhoto!.content,
        afterPhoto: photosResult.afterPhoto!.content,
        declaredCategory: 'Автоматический анализ через webhook',
      };

      this.logger.log(`📸 Sending photos to Claude for analysis: ${taskKey}`);

      const response = await axios.post(
        `${this.baseUrl}/photo-analysis/analyze-before-after`,
        claudeRequest,
        {
          timeout: 60000, // 60 секунд для Claude анализа
          headers: { 'Content-Type': 'application/json' },
        },
      );

      if (response.data.success) {
        return {
          success: true,
          message: 'Claude analysis completed',
          analysis: response.data.analysis,
        };
      } else {
        throw new Error(response.data.message || 'Claude analysis failed');
      }
    } catch (error) {
      this.logger.error(
        `Claude analysis failed for ${taskKey}:`,
        error.message,
      );
      return {
        success: false,
        message: `Claude analysis error: ${error.message}`,
        analysis: null,
      };
    }
  }

  /**
   * Публикует результаты Claude анализа в комментарий Jira
   */
  private async postResultsToJira(
    taskKey: string,
    claudeResult: IClaudeAnalysisResult,
  ): Promise<void> {
    if (!claudeResult.success || !claudeResult.analysis) {
      this.logger.warn(
        `Skipping Jira comment for ${taskKey}: no analysis results`,
      );
      return;
    }

    // ✅ Убираем блокирующую проверку - если метод вызван, значит комментарий нужен
    this.logger.log(`📝 Adding Claude analysis comment for ${taskKey}`);

    try {
      const analysis = claudeResult.analysis;

      const comment = `🤖 *АНАЛИЗ CLAUDE 3.5 SONNET* 🤖

📊 *РЕЗУЛЬТАТ АНАЛИЗА СТРИЖКИ*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 *Информация о клиенте:*
• Пол: ${analysis.clientInfo?.gender || 'не определен'}
• Стиль стрижки: ${analysis.clientInfo?.haircutStyle || 'стандартная'}

🎯 *Категория:* ${analysis.transformation.category}
⭐ *Общая оценка:* ${analysis.quality.overallScore}/10
📊 *Сложность:* ${analysis.transformation.difficultyLevel}/10

🔍 *Детальная оценка:*
• Ровность стрижки: ${analysis.quality.evenness}/10
• Переходы: ${analysis.quality.transitions}/10  
• Симметрия: ${analysis.quality.symmetry}/10
• Чистота работы: ${analysis.quality.cleanliness}/10
• Соответствие стилю: ${analysis.quality.styleCompliance}/10

📝 *Визуальные изменения:*
${analysis.transformation.visualChanges.map((change: string) => `• ${change}`).join('\n')}

🛠️ *Техника выполнения:*
${analysis.transformation.technique}

💡 *Рекомендации для улучшения:*
${analysis.recommendations.map((rec: string) => `• ${rec}`).join('\n')}

🤖 *Анализ выполнен автоматически через Claude Vision API*`;

      await axios.post(
        `${this.baseUrl}/jira/tasks/${taskKey}/comment`,
        { comment },
        {
          timeout: 10000,
          headers: { 'Content-Type': 'application/json' },
        },
      );

      this.logger.log(`💬 Claude results posted to ${taskKey}`);
    } catch (error) {
      this.logger.error(`Failed to post results to ${taskKey}:`, error.message);
      throw error;
    }
  }

  /**
   * Перемещает задачу в колонку Questions с комментарием о том, что нет фото
   */
  private async moveTaskToQuestionsWithComment(taskKey: string): Promise<void> {
    try {
      // 1. Добавляем комментарий
      const comment = `❌ **НЕТ РЕЗУЛЬТАТА ВЫПОЛНЕНИЯ РАБОТЫ**

📷 В задаче отсутствуют фотографии результата работы (до/после).
Пожалуйста, прикрепите фотографии для анализа качества.

🤖 *Автоматическая проверка системы*`;

      await axios.post(
        `${this.baseUrl}/jira/tasks/${taskKey}/comment`,
        { comment },
        {
          timeout: 10000,
          headers: { 'Content-Type': 'application/json' },
        },
      );

      // 2. Перемещаем в Questions
      await axios.post(
        `${this.baseUrl}/jira/tasks/${taskKey}/move`,
        { targetStatus: 'Questions' },
        {
          timeout: 10000,
          headers: { 'Content-Type': 'application/json' },
        },
      );

      this.logger.log(`🔄 Task ${taskKey} moved to Questions: no photos found`);
    } catch (error) {
      this.logger.error(
        `Failed to move ${taskKey} to Questions:`,
        error.message,
      );
      throw error;
    }
  }

  /**
   * Перемещает задачу в колонку Done после успешного анализа
   */
  private async moveTaskToDone(taskKey: string): Promise<void> {
    try {
      await axios.post(
        `${this.baseUrl}/jira/tasks/${taskKey}/move`,
        { targetColumn: 'Done' },
        {
          timeout: 10000,
          headers: { 'Content-Type': 'application/json' },
        },
      );

      this.logger.log(
        `✅ Task ${taskKey} moved to Done after successful analysis`,
      );
    } catch (error) {
      this.logger.error(`Failed to move ${taskKey} to Done:`, error.message);
      throw error;
    }
  }

  /**
   * Проверяет, есть ли прикрепленные фотографии в задаче
   */
  private async hasPhotoAttachments(taskKey: string): Promise<boolean> {
    try {
      const jiraConfig = {
        baseURL: this.configService.get<string>('jira.baseUrl'),
        auth: {
          username: this.configService.get<string>('jira.email') || '',
          password: this.configService.get<string>('jira.apiToken') || '',
        },
      };

      const response = await axios.get(
        `/rest/api/3/issue/${taskKey}`,
        jiraConfig,
      );

      const attachments = response.data.fields?.attachment || [];
      return attachments.length > 0;
    } catch (error) {
      this.logger.error(
        `Failed to check photos for ${taskKey}:`,
        error.message,
      );
      return false;
    }
  }

  /**
   * Проверяет, есть ли комментарий "НЕТ РЕЗУЛЬТАТА ВЫПОЛНЕНИЯ РАБОТЫ"
   */
  private async hasNoResultComment(taskKey: string): Promise<boolean> {
    try {
      const jiraConfig = {
        baseURL: this.configService.get<string>('jira.baseUrl'),
        auth: {
          username: this.configService.get<string>('jira.email') || '',
          password: this.configService.get<string>('jira.apiToken') || '',
        },
      };

      const response = await axios.get(
        `/rest/api/3/issue/${taskKey}/comment`,
        jiraConfig,
      );

      const comments = response.data.comments || [];
      return comments.some((comment: any) => {
        const bodyText =
          typeof comment.body === 'string'
            ? comment.body
            : comment.body?.content
              ? comment.body.content
                  .map(
                    (c: any) =>
                      c.content?.map((t: any) => t.text || '').join('') || '',
                  )
                  .join('')
              : '';

        return (
          bodyText && bodyText.includes('НЕТ РЕЗУЛЬТАТА ВЫПОЛНЕНИЯ РАБОТЫ')
        );
      });
    } catch (error) {
      this.logger.error(
        `Failed to check comments for ${taskKey}:`,
        error.message,
      );
      return false;
    }
  }

  /**
   * Проверяет, есть ли успешный анализ Claude (не "НЕТ РЕЗУЛЬТАТА")
   */
  private async hasSuccessfulClaudeAnalysis(taskKey: string): Promise<boolean> {
    try {
      const jiraConfig = {
        baseURL: this.configService.get<string>('jira.baseUrl'),
        auth: {
          username: this.configService.get<string>('jira.email') || '',
          password: this.configService.get<string>('jira.apiToken') || '',
        },
      };

      const response = await axios.get(
        `/rest/api/3/issue/${taskKey}/comment`,
        jiraConfig,
      );

      const comments = response.data.comments || [];

      // Ищем комментарий с анализом Claude
      const hasClaudeAnalysis = comments.some((comment: any) => {
        const bodyText =
          typeof comment.body === 'string'
            ? comment.body
            : comment.body?.content
              ? comment.body.content
                  .map(
                    (c: any) =>
                      c.content?.map((t: any) => t.text || '').join('') || '',
                  )
                  .join('')
              : '';

        // Есть анализ Claude И это НЕ "нет результата"
        return (
          bodyText &&
          (bodyText.includes('АНАЛИЗ CLAUDE') ||
            bodyText.includes('Claude Vision API') ||
            bodyText.includes('🤖')) &&
          !bodyText.includes('НЕТ РЕЗУЛЬТАТА ВЫПОЛНЕНИЯ РАБОТЫ')
        );
      });

      if (hasClaudeAnalysis) {
        this.logger.log(`✅ Found successful Claude analysis for ${taskKey}`);
      }

      return hasClaudeAnalysis;
    } catch (error) {
      this.logger.warn(
        `Failed to check successful analysis for ${taskKey}: ${error.message}`,
      );
      return false; // В случае ошибки не перемещаем
    }
  }

  /**
   * Проверка состояния сервиса
   */
  async getServiceHealth(): Promise<{
    status: string;
    claudeEndpoint: string;
    timestamp: string;
  }> {
    return {
      status: 'healthy',
      claudeEndpoint: `${this.baseUrl}/photo-analysis-agent/analyze-before-after-photos`,
      timestamp: new Date().toISOString(),
    };
  }
}
