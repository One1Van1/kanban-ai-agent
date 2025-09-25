import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HaircutTaskAnalysisInput,
  HaircutTaskAnalysisResult,
  HaircutCategory,
  ClientType,
  TimeAnalysisStatus,
  TimeAnalysisResult,
  ClientInfo,
  CategoryInfo,
  PriceCalculation,
  TimeExplanation,
  JiraTaskData,
  HAIRCUT_TIME_LIMITS,
  HAIRCUT_PRICES,
  EXPLANATION_KEYWORDS,
  CATEGORY_CHANGE_KEYWORDS,
  CLIENT_TYPE_KEYWORDS,
  DISCOUNT_CONFIG,
} from './analyze-completed-haircut-tasks.interface';
import axios from 'axios';

@Injectable()
export class AnalyzeCompletedHaircutTasksService {
  private readonly logger = new Logger(
    AnalyzeCompletedHaircutTasksService.name,
  );

  constructor(private readonly configService: ConfigService) {}

  /**
   * Основной метод анализа выполненной задачи по стрижке
   */
  async analyzeTask(
    input: HaircutTaskAnalysisInput,
  ): Promise<HaircutTaskAnalysisResult> {
    const startTime = Date.now();

    try {
      this.logger.log(`🔍 Starting analysis for task ${input.issueKey}`);

      // 1. Определяем категорию стрижки из описания
      const originalCategory = this.extractCategoryFromDescription(
        input.taskDescription,
      );

      // 2. Извлекаем информацию о клиенте из комментария
      const clientInfo = this.extractClientInfo(input.employeeComment);

      // 3. Анализируем время выполнения
      const timeAnalysis = this.analyzeExecutionTime(
        originalCategory,
        input.actualTimeMinutes,
      );

      // 4. Проверяем наличие объяснения превышения времени
      const explanation = this.analyzeTimeExplanation(
        input.employeeComment,
        timeAnalysis.status,
      );

      // 5. Определяем финальную категорию (может быть обновлена из объяснения)
      const categoryInfo = this.processCategoryInfo(
        originalCategory,
        explanation,
      );

      // 6. Пересчитываем время с учётом возможного изменения категории
      const finalTimeAnalysis = categoryInfo.wasUpdated
        ? this.analyzeExecutionTime(
            categoryInfo.updated!,
            input.actualTimeMinutes,
          )
        : timeAnalysis;

      // 7. Рассчитываем стоимость
      const finalCategory = categoryInfo.updated || categoryInfo.original;
      const priceCalculation = this.calculatePrice(finalCategory, clientInfo);

      // 8. Определяем, нужно ли задавать вопросы сотруднику
      const requiresQuestion = this.shouldAskQuestion(
        finalTimeAnalysis,
        explanation,
      );

      // 9. Формируем итоговый отчёт
      const finalReport = this.generateFinalReport(
        categoryInfo,
        finalTimeAnalysis,
        clientInfo,
        priceCalculation,
        explanation,
      );

      const result: HaircutTaskAnalysisResult = {
        issueKey: input.issueKey,
        success: true,
        category: categoryInfo,
        timeAnalysis: finalTimeAnalysis,
        client: clientInfo,
        explanation: explanation.hasExplanation ? explanation : undefined,
        price: priceCalculation,
        requiresQuestion,
        moveToQuestions: requiresQuestion,
        agentComment: requiresQuestion
          ? this.generateQuestionComment(finalTimeAnalysis, originalCategory)
          : undefined,
        finalReport,
        timestamp: new Date().toISOString(),
        processingTimeMs: Date.now() - startTime,
      };

      this.logger.log(
        `✅ Analysis completed for ${input.issueKey}. Requires question: ${requiresQuestion}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `❌ Analysis failed for ${input.issueKey}: ${error.message}`,
      );

      return {
        issueKey: input.issueKey,
        success: false,
        category: { original: HaircutCategory.FAST, wasUpdated: false },
        timeAnalysis: {
          status: TimeAnalysisStatus.WITHIN_NORM,
          actualTime: 0,
          normativeTime: { min: 0, max: 0 },
        },
        client: { type: ClientType.NEW, isRegular: false, discountPercent: 0 },
        price: {
          basePrice: 0,
          discount: 0,
          finalPrice: 0,
          category: HaircutCategory.FAST,
        },
        requiresQuestion: false,
        moveToQuestions: false,
        finalReport: `❌ Ошибка анализа: ${error.message}`,
        timestamp: new Date().toISOString(),
        processingTimeMs: Date.now() - startTime,
      };
    }
  }

  /**
   * Анализ задачи из данных Jira
   */
  async analyzeFromJiraData(
    jiraData: JiraTaskData,
  ): Promise<HaircutTaskAnalysisResult> {
    // Извлекаем время выполнения из worklog
    const actualTimeMinutes = this.extractTimeFromJira(jiraData);

    // Извлекаем последний комментарий сотрудника
    const employeeComment = this.extractEmployeeComment(jiraData);

    const input: HaircutTaskAnalysisInput = {
      issueKey: jiraData.key,
      taskTitle: jiraData.fields.summary,
      taskDescription: jiraData.fields.description,
      employeeComment,
      actualTimeMinutes,
    };

    return this.analyzeTask(input);
  }

  /**
   * Получение данных задачи из Jira API
   */
  async fetchJiraTask(issueKey: string): Promise<JiraTaskData> {
    try {
      const jiraUrl = this.configService.get<string>('jira.baseUrl');
      const jiraAuth = this.configService.get<string>('jira.authToken');

      const response = await axios.get(
        `${jiraUrl}/rest/api/3/issue/${issueKey}`,
        {
          headers: {
            Authorization: `Bearer ${jiraAuth}`,
            'Content-Type': 'application/json',
          },
          params: {
            expand: 'changelog,worklog,comment',
          },
        },
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to fetch Jira task ${issueKey}: ${error.message}`,
      );
      throw new Error(`Unable to fetch task data: ${error.message}`);
    }
  }

  /**
   * Извлечение категории стрижки из описания задачи
   */
  private extractCategoryFromDescription(description: string): HaircutCategory {
    if (!description) return HaircutCategory.FAST;

    const desc = description.toLowerCase();

    if (desc.includes('креативная') || desc.includes('creative')) {
      return HaircutCategory.CREATIVE;
    }
    if (desc.includes('обычная') || desc.includes('regular')) {
      return HaircutCategory.REGULAR;
    }

    return HaircutCategory.FAST; // по умолчанию
  }

  /**
   * Извлечение информации о клиенте из комментария
   */
  private extractClientInfo(comment: string): ClientInfo {
    if (!comment) {
      return {
        type: ClientType.NEW,
        isRegular: false,
        discountPercent: 0,
      };
    }

    const commentLower = comment.toLowerCase();

    // Проверяем на постоянного клиента
    const isRegular = CLIENT_TYPE_KEYWORDS[ClientType.REGULAR].some((keyword) =>
      commentLower.includes(keyword),
    );

    return {
      type: isRegular ? ClientType.REGULAR : ClientType.NEW,
      isRegular,
      discountPercent: isRegular ? DISCOUNT_CONFIG.REGULAR_CLIENT_PERCENT : 0,
    };
  }

  /**
   * Анализ времени выполнения
   */
  private analyzeExecutionTime(
    category: HaircutCategory,
    actualTime: number,
  ): TimeAnalysisResult {
    const limits = HAIRCUT_TIME_LIMITS[category];

    if (actualTime < limits.min) {
      return {
        status: TimeAnalysisStatus.UNDER_NORM,
        actualTime,
        normativeTime: limits,
        deviation: limits.min - actualTime,
      };
    }

    if (actualTime > limits.max) {
      return {
        status: TimeAnalysisStatus.EXCEEDED,
        actualTime,
        normativeTime: limits,
        deviation: actualTime - limits.max,
      };
    }

    return {
      status: TimeAnalysisStatus.WITHIN_NORM,
      actualTime,
      normativeTime: limits,
    };
  }

  /**
   * Анализ объяснения превышения времени
   */
  private analyzeTimeExplanation(
    comment: string,
    timeStatus: TimeAnalysisStatus,
  ): TimeExplanation {
    if (timeStatus !== TimeAnalysisStatus.EXCEEDED || !comment) {
      return { hasExplanation: false, isValid: true };
    }

    const commentLower = comment.toLowerCase();

    // Ищем объяснение причин
    const hasExplanation = EXPLANATION_KEYWORDS.some((keyword) =>
      commentLower.includes(keyword),
    );

    if (!hasExplanation) {
      return { hasExplanation: false, isValid: false };
    }

    // Ищем смену категории в объяснении
    let categoryChangeRequested: HaircutCategory | undefined;

    if (
      CATEGORY_CHANGE_KEYWORDS.some((keyword) => commentLower.includes(keyword))
    ) {
      if (commentLower.includes('креативная')) {
        categoryChangeRequested = HaircutCategory.CREATIVE;
      } else if (commentLower.includes('обычная')) {
        categoryChangeRequested = HaircutCategory.REGULAR;
      } else if (commentLower.includes('быстрая')) {
        categoryChangeRequested = HaircutCategory.FAST;
      }
    }

    // Извлекаем причину
    const reason = this.extractReasonFromComment(comment);

    return {
      hasExplanation: true,
      reason,
      categoryChangeRequested,
      isValid: true,
    };
  }

  /**
   * Обработка информации о категории
   */
  private processCategoryInfo(
    original: HaircutCategory,
    explanation?: TimeExplanation,
  ): CategoryInfo {
    if (explanation?.categoryChangeRequested) {
      return {
        original,
        updated: explanation.categoryChangeRequested,
        wasUpdated: true,
        updateReason: explanation.reason,
      };
    }

    return {
      original,
      wasUpdated: false,
    };
  }

  /**
   * Расчёт стоимости
   */
  private calculatePrice(
    category: HaircutCategory,
    clientInfo: ClientInfo,
  ): PriceCalculation {
    const basePrice = HAIRCUT_PRICES[category];
    const discount = Math.round(basePrice * (clientInfo.discountPercent / 100));
    const finalPrice = basePrice - discount;

    return {
      basePrice,
      discount,
      finalPrice,
      category,
    };
  }

  /**
   * Определение необходимости задать вопрос
   */
  private shouldAskQuestion(
    timeAnalysis: TimeAnalysisResult,
    explanation?: TimeExplanation,
  ): boolean {
    // Если время в пределах нормы - вопросов не задаём
    if (timeAnalysis.status !== TimeAnalysisStatus.EXCEEDED) {
      return false;
    }

    // Если есть объяснение - вопросов не задаём
    if (explanation?.hasExplanation) {
      return false;
    }

    // Время превышено и нет объяснения - нужен вопрос
    return true;
  }

  /**
   * Генерация комментария с вопросом
   */
  private generateQuestionComment(
    timeAnalysis: TimeAnalysisResult,
    category: HaircutCategory,
  ): string {
    const { min, max } = timeAnalysis.normativeTime;
    const normText = max === Infinity ? `${min}+ мин` : `${min}-${max} мин`;

    return `❓ Время выполнения (${timeAnalysis.actualTime} мин) превышает норматив для ${category} (${normText}).
Точно ли указана нужная категория стрижки?
Если категория верная, объясните причину превышения времени.`;
  }

  /**
   * Генерация итогового отчёта
   */
  private generateFinalReport(
    category: CategoryInfo,
    timeAnalysis: TimeAnalysisResult,
    client: ClientInfo,
    price: PriceCalculation,
    explanation?: TimeExplanation,
  ): string {
    let report = '✅ Анализ завершён: ';

    // Информация о категории
    if (category.wasUpdated) {
      report += `Категория обновлена на "${category.updated}" согласно фактически выполненной работе. `;
    }

    // Информация о времени
    if (timeAnalysis.status === TimeAnalysisStatus.WITHIN_NORM) {
      report += 'Время соответствует категории стрижки, ';
    } else if (
      timeAnalysis.status === TimeAnalysisStatus.EXCEEDED &&
      explanation?.hasExplanation
    ) {
      report += 'Время превышено по объективным причинам, ';
    }

    // Информация о клиенте и цене
    const clientText = client.isRegular
      ? `постоянный (скидка ${client.discountPercent}%)`
      : 'не постоянный';
    report += `клиент ${clientText}, цена ${price.finalPrice} рублей.`;

    // Дополнительная информация о превышении
    if (
      timeAnalysis.status === TimeAnalysisStatus.EXCEEDED &&
      explanation?.hasExplanation &&
      explanation.reason
    ) {
      report += `\n⚠️ Время превышено по объективным причинам (${explanation.reason}).`;
    }

    return report;
  }

  /**
   * Извлечение времени выполнения из данных Jira
   */
  private extractTimeFromJira(jiraData: JiraTaskData): number {
    if (jiraData.fields.timetracking?.timeSpentSeconds) {
      return Math.round(jiraData.fields.timetracking.timeSpentSeconds / 60);
    }

    if (jiraData.fields.worklog?.worklogs?.length) {
      const totalSeconds = jiraData.fields.worklog.worklogs.reduce(
        (sum, worklog) => sum + worklog.timeSpentSeconds,
        0,
      );
      return Math.round(totalSeconds / 60);
    }

    return 0;
  }

  /**
   * Извлечение комментария сотрудника
   */
  private extractEmployeeComment(jiraData: JiraTaskData): string {
    if (!jiraData.fields.comment?.comments?.length) {
      return '';
    }

    // Берём последний комментарий
    const lastComment = jiraData.fields.comment.comments.sort(
      (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime(),
    )[0];

    return lastComment.body || '';
  }

  /**
   * Извлечение причины из комментария
   */
  private extractReasonFromComment(comment: string): string {
    // Простая логика извлечения - берём часть после ключевых слов
    const sentences = comment.split(/[.!?]/);

    for (const sentence of sentences) {
      for (const keyword of EXPLANATION_KEYWORDS) {
        if (sentence.toLowerCase().includes(keyword)) {
          return sentence.trim();
        }
      }
    }

    return 'превышение времени по объективным причинам';
  }
}
