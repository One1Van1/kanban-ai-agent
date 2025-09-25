import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProcessHaircutTaskDto } from './process-haircut-task.dto';
import {
  ProcessHaircutTaskResponse,
  TaskStatus,
  ProcessingAction,
  WorklogEntry,
  HaircutAnalysis,
} from './process-haircut-task.interface';
import axios from 'axios';

@Injectable()
export class ProcessHaircutTaskService {
  private readonly logger = new Logger(ProcessHaircutTaskService.name);

  constructor(private readonly configService: ConfigService) {}

  /**
   * Главный метод - обрабатывает задачу согласно инструкции:
   * 1. Проверяет что это стрижка в статусе Review
   * 2. Анализирует время выполнения и отчёт сотрудника
   * 3. Успешные задачи → Done с комментарием
   * 4. Проблемные задачи → Questions с вопросом
   */
  async processTask(
    taskData: ProcessHaircutTaskDto,
  ): Promise<ProcessHaircutTaskResponse> {
    this.logger.log(`🎯 Processing task: ${taskData.taskKey}`);

    try {
      // 1. Проверяем что это задача о стрижке
      if (!this.isHaircutTask(taskData)) {
        return {
          processed: false,
          action: ProcessingAction.SKIPPED,
          reason: 'Task is not related to haircuts',
          taskKey: taskData.taskKey,
        };
      }

      // 2. Проверяем статус - должен быть Review
      if (taskData.currentStatus !== TaskStatus.REVIEW) {
        return {
          processed: false,
          action: ProcessingAction.SKIPPED,
          reason: `Task status is ${taskData.currentStatus}, expected ${TaskStatus.REVIEW}`,
          taskKey: taskData.taskKey,
        };
      }

      // 3. Проводим анализ согласно инструкции
      const analysis = await this.performFullAnalysis(taskData);

      if (analysis.needsQuestion) {
        // Время превышено БЕЗ объяснения → Questions
        const jiraActions = await this.moveTaskToQuestions(
          taskData,
          analysis.questionComment || '',
        );

        return {
          processed: true,
          action: ProcessingAction.MOVED_TO_QUESTIONS,
          reason: 'Time exceeded without explanation - moved to Questions',
          taskKey: taskData.taskKey,
          masterName: taskData.assigneeName,
          analysis,
          jiraActions,
        };
      } else {
        // Задача выполнена успешно → Done
        const jiraActions = await this.moveTaskToDone(
          taskData,
          analysis.finalReport || '',
        );

        return {
          processed: true,
          action: ProcessingAction.MOVED_TO_DONE,
          reason: 'Task completed successfully - moved to Done',
          taskKey: taskData.taskKey,
          masterName: taskData.assigneeName,
          analysis,
          jiraActions,
        };
      }
    } catch (error) {
      this.logger.error(
        `Error processing task ${taskData.taskKey}: ${error.message}`,
        error.stack,
      );

      return {
        processed: false,
        action: ProcessingAction.ERROR,
        reason: 'Processing error occurred',
        taskKey: taskData.taskKey,
        error: {
          message: error.message,
          details: error.stack,
        },
      };
    }
  }

  /**
   * Проверяет является ли задача связанной со стрижками
   */
  private isHaircutTask(taskData: ProcessHaircutTaskDto): boolean {
    const haircutKeywords = ['стрижка', 'стричь', 'haircut', 'hair', 'волосы'];
    const text =
      `${taskData.taskSummary} ${taskData.taskDescription || ''}`.toLowerCase();

    return haircutKeywords.some((keyword) =>
      text.includes(keyword.toLowerCase()),
    );
  }

  /**
   * Полный анализ задачи согласно инструкции
   */
  private async performFullAnalysis(
    taskData: ProcessHaircutTaskDto,
  ): Promise<HaircutAnalysis> {
    // 1. Определяем категорию из заголовка и описания задачи
    const fullText = `${taskData.taskSummary || ''} ${taskData.taskDescription || ''}`;
    this.logger.log(`🔍 Full text for analysis: "${fullText}"`);
    let category = this.extractCategory(fullText);
    this.logger.log(`📝 Initial category detected: ${category}`);

    // 2. Анализируем время
    const timeData = this.analyzeTime(taskData);

    // 3. Получаем отчёт сотрудника
    const employeeReport = this.buildEmployeeComment(taskData);

    // 4. Проверяем тип клиента
    const isRegularClient = this.checkIfRegularClient(employeeReport);

    // 5. Проверяем есть ли объяснение превышения времени
    const hasExplanation = this.hasTimeExceedExplanation(employeeReport);

    // 6. Проверяем изменение категории в отчёте
    const newCategory = this.extractCategoryFromReport(employeeReport);
    if (newCategory) {
      category = newCategory;
    }

    // 7. Пересчитываем время для новой категории
    const finalTimeData = this.analyzeTimeForCategory(
      timeData.actualMinutes,
      category,
    );

    // 8. Рассчитываем стоимость
    const pricing = this.calculatePricing(category, isRegularClient);

    // 9. Определяем нужен ли вопрос в Questions
    const needsQuestion =
      finalTimeData.timeStatus === 'exceeded' && !hasExplanation;

    return {
      category,
      actualTimeMinutes: timeData.actualMinutes,
      expectedTimeRange: finalTimeData.expectedRange,
      timeStatus: finalTimeData.timeStatus,
      hasExplanation,
      explanation: hasExplanation
        ? this.extractExplanation(employeeReport)
        : undefined,
      isRegularClient,
      basePrice: pricing.basePrice,
      discount: pricing.discount,
      finalPrice: pricing.finalPrice,
      needsQuestion,
      questionComment: needsQuestion
        ? this.buildQuestionComment(
            timeData.actualMinutes,
            category,
            finalTimeData.expectedRange,
          )
        : undefined,
      finalReport: !needsQuestion
        ? this.buildFinalReport(
            category,
            finalTimeData.timeStatus,
            isRegularClient,
            pricing,
            hasExplanation,
            employeeReport,
          )
        : undefined,
    };
  }

  /**
   * Перемещает задачу в Questions с комментарием-вопросом
   */
  private async moveTaskToQuestions(
    taskData: ProcessHaircutTaskDto,
    questionComment: string,
  ) {
    return this.performJiraTransition(
      taskData.taskKey,
      TaskStatus.QUESTIONS,
      questionComment,
    );
  }

  /**
   * Перемещает задачу в Done с итоговым отчётом
   */
  private async moveTaskToDone(
    taskData: ProcessHaircutTaskDto,
    finalReport: string,
  ) {
    return this.performJiraTransition(
      taskData.taskKey,
      TaskStatus.DONE,
      finalReport,
    );
  }

  /**
   * Выполняет переход в Jira с комментарием
   */
  private async performJiraTransition(
    taskKey: string,
    targetStatus: TaskStatus,
    comment: string,
  ) {
    const baseURL = this.configService.get<string>('jira.baseUrl');
    const username = this.configService.get<string>('jira.email');
    const password = this.configService.get<string>('jira.apiToken');

    this.logger.log(
      `🔄 Moving ${taskKey} to ${targetStatus} with comment: "${comment}"`,
    );

    if (!baseURL || !username || !password) {
      this.logger.warn(
        'Jira configuration missing - cannot perform transition',
      );
      return {
        transitionExecuted: false,
        commentAdded: false,
        transitionId: null,
      };
    }

    try {
      const auth = { username, password };

      // Получаем доступные переходы
      const transitionsResponse = await axios.get(
        `/rest/api/3/issue/${taskKey}/transitions`,
        { baseURL, auth },
      );

      // Ищем нужный переход
      const transition = transitionsResponse.data.transitions.find(
        (t: any) => t.to.name === targetStatus,
      );

      if (!transition) {
        throw new Error(`No transition to ${targetStatus} found`);
      }

      // 1. Сначала выполняем переход
      await axios.post(
        `/rest/api/3/issue/${taskKey}/transitions`,
        {
          transition: { id: transition.id },
        },
        { baseURL, auth },
      );

      this.logger.log(`✅ Task ${taskKey} moved to ${targetStatus}`);

      // 2. Затем добавляем комментарий
      if (comment && comment.trim()) {
        await axios.post(
          `/rest/api/3/issue/${taskKey}/comment`,
          {
            body: {
              type: 'doc',
              version: 1,
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: comment,
                    },
                  ],
                },
              ],
            },
          },
          { baseURL, auth },
        );

        this.logger.log(`💬 Comment added to ${taskKey}`);
      }

      return {
        transitionExecuted: true,
        commentAdded: true,
        transitionId: transition.id,
      };
    } catch (error) {
      this.logger.error(
        `Failed to move task to ${targetStatus}: ${error.message}`,
      );

      if (error.response) {
        this.logger.error(`Jira API Error Status: ${error.response.status}`);
        this.logger.error(
          `Jira API Error Data:`,
          JSON.stringify(error.response.data, null, 2),
        );
      }

      return {
        transitionExecuted: false,
        commentAdded: false,
        transitionId: null,
      };
    }
  }

  /**
   * Определяет категорию стрижки из описания задачи
   */
  private extractCategory(description: string): string {
    if (!description) return 'Обычная стрижка';

    const desc = description.toLowerCase();

    // Быстрая стрижка
    const fastKeywords = [
      'быстра',
      'быструю',
      'быстрой',
      'быстрая',
      'под насадку',
      'коротко',
      'простая',
      'простую',
    ];
    if (fastKeywords.some((keyword) => desc.includes(keyword))) {
      return 'Быстрая стрижка';
    }

    // Креативная стрижка
    const creativeKeywords = [
      'креативна',
      'креативную',
      'креативной',
      'креативная',
      'окраск',
      'окрашив',
      'покраск',
      'цвет',
      'укладк',
      'стайлинг',
      'волн',
      'сложна',
      'сложную',
      'сложной',
      'сложная',
      'модельн',
      'стильн',
      'эксклюзивн',
      'плетени',
      'коса',
      'локоны',
    ];
    if (creativeKeywords.some((keyword) => desc.includes(keyword))) {
      return 'Креативная стрижка';
    }

    return 'Обычная стрижка';
  }

  /**
   * Анализирует время выполнения
   */
  private analyzeTime(taskData: ProcessHaircutTaskDto) {
    const totalSeconds = (taskData.worklogEntries || []).reduce(
      (sum, entry) => sum + (entry.timeSpentSeconds || 0),
      0,
    );
    const actualMinutes = Math.round(totalSeconds / 60);

    return { actualMinutes };
  }

  /**
   * Анализирует время для конкретной категории
   */
  private analyzeTimeForCategory(actualMinutes: number, category: string) {
    let minTime: number, maxTime: number;

    switch (category) {
      case 'Быстрая стрижка':
        minTime = 20;
        maxTime = 30;
        break;
      case 'Креативная стрижка':
        minTime = 90;
        maxTime = 999;
        break;
      default: // Обычная стрижка
        minTime = 30;
        maxTime = 60;
    }

    const expectedRange =
      maxTime === 999 ? `${minTime}+ мин` : `${minTime}-${maxTime} мин`;

    let timeStatus: 'within_norm' | 'exceeded' | 'insufficient';
    if (actualMinutes < minTime) {
      timeStatus = 'insufficient';
    } else if (actualMinutes > maxTime && maxTime !== 999) {
      timeStatus = 'exceeded';
    } else {
      timeStatus = 'within_norm';
    }

    return { expectedRange, timeStatus };
  }

  /**
   * Проверяет является ли клиент постоянным
   */
  private checkIfRegularClient(employeeReport: string): boolean {
    const report = employeeReport.toLowerCase();
    return (
      report.includes('постоянный клиент') ||
      report.includes('постоянная клиентка')
    );
  }

  /**
   * Проверяет есть ли объяснение превышения времени
   */
  private hasTimeExceedExplanation(employeeReport: string): boolean {
    const report = employeeReport.toLowerCase();
    const explanationKeywords = [
      'был сложный',
      'была сложная',
      'нервный',
      'нервная',
      'технические проблемы',
      'пришлось переделать',
      'просил дополнительн',
      'попросил добавить',
      'возникли проблемы',
      'на самом деле это была',
    ];

    return explanationKeywords.some((keyword) => report.includes(keyword));
  }

  /**
   * Извлекает новую категорию из отчёта сотрудника
   */
  private extractCategoryFromReport(employeeReport: string): string | null {
    const report = employeeReport.toLowerCase();

    if (report.includes('на самом деле это была быстрая')) {
      return 'Быстрая стрижка';
    }
    if (
      report.includes('на самом деле это была креативная') ||
      report.includes('на самом деле это была стрижка с окраской')
    ) {
      return 'Креативная стрижка';
    }
    if (report.includes('на самом деле это была обычная')) {
      return 'Обычная стрижка';
    }

    return null;
  }

  /**
   * Извлекает объяснение из отчёта
   */
  private extractExplanation(employeeReport: string): string {
    // Упрощённое извлечение - можно улучшить
    return employeeReport;
  }

  /**
   * Рассчитывает стоимость
   */
  private calculatePricing(category: string, isRegularClient: boolean) {
    let basePrice: number;

    switch (category) {
      case 'Быстрая стрижка':
        basePrice = 400;
        break;
      case 'Креативная стрижка':
        basePrice = 1500;
        break;
      default: // Обычная стрижка
        basePrice = 800;
    }

    const discount = isRegularClient ? Math.round(basePrice * 0.1) : 0;
    const finalPrice = basePrice - discount;

    return { basePrice, discount, finalPrice };
  }

  /**
   * Строит комментарий с вопросом для Questions
   */
  private buildQuestionComment(
    actualMinutes: number,
    category: string,
    expectedRange: string,
  ): string {
    return (
      `❓ Время выполнения (${actualMinutes} мин) превышает норматив для ${category.toLowerCase()} (${expectedRange}).
` +
      `Точно ли указана нужная категория стрижки?
` +
      `Если категория верная, объясните причину превышения времени.`
    );
  }

  /**
   * Строит итоговый отчёт
   */
  private buildFinalReport(
    category: string,
    timeStatus: string,
    isRegularClient: boolean,
    pricing: any,
    hasExplanation: boolean,
    employeeReport: string,
  ): string {
    let report = `✅ Анализ завершён: `;

    if (hasExplanation && timeStatus === 'exceeded') {
      report += `Категория обновлена на "${category}" согласно выполненной работе. `;
    }

    report += `Сотрудник выполнил ${category.toLowerCase()}, `;
    report += `клиент ${isRegularClient ? 'постоянный' : 'не постоянный'}`;

    if (isRegularClient) {
      report += ` (скидка 10%)`;
    }

    report += `, цена ${pricing.finalPrice} рублей`;

    if (timeStatus === 'exceeded' && hasExplanation) {
      report += `.
⚠️ Время превышено по объективным причинам (${this.extractExplanation(employeeReport)}).`;
    }

    return report;
  }

  /**
   * Создает комментарий сотрудника для анализа
   */
  private buildEmployeeComment(taskData: ProcessHaircutTaskDto): string {
    const worklogComments = (taskData.worklogEntries || [])
      .map((entry) => entry.comment)
      .filter((comment) => comment && comment.trim().length > 0)
      .join(' ');

    const taskComments = (taskData.comments || [])
      .map((comment) => comment.body)
      .filter((body) => body && body.trim().length > 0)
      .join(' ');

    return `${worklogComments} ${taskComments}`.trim();
  }
}
