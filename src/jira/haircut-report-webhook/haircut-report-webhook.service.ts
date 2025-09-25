import { Injectable, Logger } from '@nestjs/common';
import { HaircutReportWebhookDto } from './haircut-report-webhook.dto';
import {
  WebhookResponse,
  HaircutAnalysisData,
  HaircutWebhookEvent,
  TaskStatus,
  ChangeType,
} from './haircut-report-webhook.interface';

@Injectable()
export class HaircutReportWebhookService {
  private readonly logger = new Logger(HaircutReportWebhookService.name);

  constructor() {}

  /**
   * Обрабатывает webhook события от Jira
   */
  async processWebhook(webhookData: HaircutReportWebhookDto): Promise<any> {
    this.logger.log(`Processing webhook event: ${webhookData.webhookEvent}`);

    try {
      // Проверяем, что это интересующее нас событие
      if (!this.isRelevantEvent(webhookData)) {
        return {
          processed: false,
          reason: 'Event not relevant for haircut analysis',
        };
      }

      // Проверяем, что задача связана со стрижками
      if (!this.isHaircutTask(webhookData)) {
        return {
          processed: false,
          reason: 'Task is not related to haircuts',
        };
      }

      // Проверяем, что задача перешла в статус Review
      if (!this.isReviewStatusChange(webhookData)) {
        return {
          processed: false,
          reason: 'Task did not transition to Review status',
        };
      }

      // Извлекаем данные для анализа
      const analysisData = this.extractAnalysisData(webhookData);

      // Здесь должен быть вызов AI агента для анализа
      const analysisResult = await this.triggerHaircutAnalysis(analysisData);

      return {
        processed: true,
        taskKey: analysisData.taskKey,
        analysisTriggered: true,
        analysisResult: analysisResult,
      };
    } catch (error) {
      this.logger.error(
        `Error processing webhook: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Проверяет, является ли событие релевантным для анализа стрижек
   */
  private isRelevantEvent(webhookData: HaircutReportWebhookDto): boolean {
    const relevantEvents = [
      HaircutWebhookEvent.ISSUE_UPDATED,
      HaircutWebhookEvent.COMMENT_CREATED,
      HaircutWebhookEvent.COMMENT_UPDATED,
    ];

    return relevantEvents.includes(
      webhookData.webhookEvent as HaircutWebhookEvent,
    );
  }

  /**
   * Проверяет, связана ли задача со стрижками
   */
  private isHaircutTask(webhookData: HaircutReportWebhookDto): boolean {
    if (!webhookData.issue) return false;

    const haircutKeywords = ['стрижка', 'стричь', 'haircut', 'hair', 'волосы'];
    const summary = webhookData.issue.fields?.summary?.toLowerCase() || '';
    const description =
      webhookData.issue.fields?.description?.toLowerCase() || '';

    const text = `${summary} ${description}`;

    return haircutKeywords.some((keyword) =>
      text.includes(keyword.toLowerCase()),
    );
  }

  /**
   * Проверяет, была ли задача переведена в статус Review
   */
  private isReviewStatusChange(webhookData: HaircutReportWebhookDto): boolean {
    // Проверяем текущий статус
    const currentStatus = webhookData.issue?.fields?.status?.name;
    if (currentStatus !== TaskStatus.REVIEW) {
      return false;
    }

    // Если есть changelog, проверяем изменение статуса
    if (webhookData.changelog?.items) {
      const statusChange = webhookData.changelog.items.find(
        (item: any) => item.field === ChangeType.STATUS_CHANGE,
      );

      if (statusChange && statusChange.toString === TaskStatus.REVIEW) {
        return true;
      }
    }

    // Если нет changelog, считаем что это релевантное событие
    // (например, ручная проверка задач в статусе Review)
    return true;
  }

  /**
   * Извлекает данные для анализа из webhook'а
   */
  private extractAnalysisData(
    webhookData: HaircutReportWebhookDto,
  ): HaircutAnalysisData {
    const issue = webhookData.issue;

    return {
      taskKey: issue?.key || 'unknown',
      masterName:
        issue?.fields?.assignee?.displayName || webhookData.user?.displayName,
      timeSpent: this.extractTimeSpent(issue),
      questions: this.extractQuestions(issue),
      category: this.extractCategory(issue),
    };
  }

  /**
   * Извлекает потраченное время из worklog
   */
  private extractTimeSpent(issue: any): number | undefined {
    const worklogs = issue?.fields?.worklog?.worklogs || [];
    if (worklogs.length === 0) return undefined;

    const totalSeconds = worklogs.reduce((total: number, worklog: any) => {
      return total + (worklog.timeSpentSeconds || 0);
    }, 0);

    return totalSeconds;
  }

  /**
   * Извлекает вопросы из комментариев
   */
  private extractQuestions(issue: any): string[] {
    const comments = issue?.fields?.comment?.comments || [];
    const questions: string[] = [];

    comments.forEach((comment: any) => {
      const body = comment.body || '';
      // Ищем текст, который выглядит как вопросы
      const questionMatches = body.match(/[?？]/g);
      if (questionMatches) {
        questions.push(body.trim());
      }
    });

    return questions;
  }

  /**
   * Пытается определить категорию стрижки из названия и описания
   */
  private extractCategory(issue: any): string | undefined {
    const summary = issue?.fields?.summary?.toLowerCase() || '';
    const description = issue?.fields?.description?.toLowerCase() || '';
    const text = `${summary} ${description}`;

    const categories = [
      {
        name: 'Быстрая стрижка',
        keywords: ['быстра', 'простая', 'обычная', 'базовая'],
      },
      {
        name: 'Модельная стрижка',
        keywords: ['модельная', 'сложная', 'креативная'],
      },
      { name: 'Детская стрижка', keywords: ['детская', 'ребенок', 'малыш'] },
      { name: 'Женская стрижка', keywords: ['женская', 'дамская'] },
      { name: 'Мужская стрижка', keywords: ['мужская'] },
    ];

    for (const category of categories) {
      const found = category.keywords.some((keyword) => text.includes(keyword));
      if (found) {
        return category.name;
      }
    }

    return undefined;
  }

  /**
   * Запускает анализ стрижки через AI агента
   * TODO: Интегрировать с AI агентом из ai-reporting-agent
   */
  private async triggerHaircutAnalysis(
    analysisData: HaircutAnalysisData,
  ): Promise<any> {
    this.logger.log(
      `Triggering haircut analysis for task: ${analysisData.taskKey}`,
    );

    // TODO: Здесь должен быть вызов сервиса анализа стрижек
    // const aiReportingService = // ... получить сервис
    // return await aiReportingService.analyzeCompletedHaircutTask(analysisData);

    // Пока что возвращаем мок-результат
    return {
      success: true,
      taskAnalyzed: analysisData.taskKey,
      mockResult: 'Analysis would be triggered here',
      extractedData: analysisData,
    };
  }
}
