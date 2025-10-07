import { Injectable, Logger } from '@nestjs/common';

export interface KanbanPattern {
  name: string;
  description: string;
  triggers: string[];
  actions: string[];
  successCriteria: string[];
  riskFactors: string[];
  examples: string[];
}

export interface BusinessRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  priority: number;
  applicableColumns: string[];
  taskTypes: string[];
}

export interface IndustryBestPractice {
  industry: string;
  practice: string;
  description: string;
  implementation: string[];
  benefits: string[];
}

@Injectable()
export class KanbanKnowledgeBaseService {
  private readonly logger = new Logger(KanbanKnowledgeBaseService.name);

  private readonly patterns: KanbanPattern[] = [
    {
      name: 'Critical Bug Flow',
      description: 'Ускоренный процесс для критических багов',
      triggers: ['bug', 'critical', 'production'],
      actions: [
        'Немедленно уведомить команду',
        'Назначить старшего разработчика',
        'Создать hotfix ветку',
        'Уведомить стейкхолдеров',
      ],
      successCriteria: [
        'Исправление в течение 4 часов',
        'Уведомления отправлены всем заинтересованным',
        'Документация обновлена',
      ],
      riskFactors: [
        'Недостаток информации о баге',
        'Отсутствие ответственного разработчика',
        'Сложность воспроизведения',
      ],
      examples: [
        'Падение продакшн сервиса',
        'Критическая уязвимость безопасности',
        'Блокирующий баг для клиентов',
      ],
    },
    {
      name: 'Feature Development Flow',
      description: 'Стандартный процесс разработки новых функций',
      triggers: ['feature', 'enhancement', 'new'],
      actions: [
        'Провести планирование',
        'Создать техническое задание',
        'Назначить ответственного',
        'Запланировать ревью',
      ],
      successCriteria: [
        'ТЗ утверждено',
        'Временные рамки определены',
        'Ресурсы выделены',
      ],
      riskFactors: [
        'Неясные требования',
        'Недооценка сложности',
        'Зависимости от других команд',
      ],
      examples: [
        'Новая страница в приложении',
        'Интеграция с внешним API',
        'Улучшение UI/UX',
      ],
    },
    {
      name: 'Testing Phase Flow',
      description: 'Процесс тестирования задач',
      triggers: ['testing', 'qa', 'review'],
      actions: [
        'Назначить тестировщика',
        'Создать тест-кейсы',
        'Провести тестирование',
        'Документировать результаты',
      ],
      successCriteria: [
        'Все тесты пройдены',
        'Баги задокументированы',
        'Готовность к релизу',
      ],
      riskFactors: [
        'Недостаток времени на тестирование',
        'Неполное покрытие тестами',
        'Сложность настройки тестовой среды',
      ],
      examples: [
        'Функциональное тестирование',
        'Регрессионное тестирование',
        'Нагрузочное тестирование',
      ],
    },
  ];

  private readonly businessRules: BusinessRule[] = [
    {
      id: 'critical-bug-notification',
      name: 'Уведомление о критических багах',
      condition: 'taskType === "bug" && priority === "critical"',
      action: 'Отправить уведомление команде и стейкхолдерам',
      priority: 1,
      applicableColumns: ['To Do', 'In Progress'],
      taskTypes: ['bug'],
    },
    {
      id: 'high-priority-assignment',
      name: 'Назначение высокоприоритетных задач',
      condition: 'priority === "high" && assignee === null',
      action: 'Назначить старшего разработчика',
      priority: 2,
      applicableColumns: ['To Do', 'Backlog'],
      taskTypes: ['bug', 'feature', 'task'],
    },
    {
      id: 'testing-readiness-check',
      name: 'Проверка готовности к тестированию',
      condition: 'column === "Ready for Testing"',
      action: 'Проверить критерии готовности и назначить тестировщика',
      priority: 3,
      applicableColumns: ['Ready for Testing'],
      taskTypes: ['feature', 'bug', 'improvement'],
    },
    {
      id: 'blocked-task-escalation',
      name: 'Эскалация заблокированных задач',
      condition: 'status === "blocked" && blockedDays > 2',
      action: 'Эскалировать менеджеру проекта',
      priority: 1,
      applicableColumns: ['In Progress', 'Blocked'],
      taskTypes: ['all'],
    },
  ];

  private readonly industryPractices: IndustryBestPractice[] = [
    {
      industry: 'Software Development',
      practice: 'Definition of Done',
      description: 'Четкие критерии завершенности задач',
      implementation: [
        'Код написан и отревьюен',
        'Тесты написаны и проходят',
        'Документация обновлена',
        'Фича протестирована',
      ],
      benefits: [
        'Единое понимание готовности',
        'Повышение качества',
        'Уменьшение багов',
      ],
    },
    {
      industry: 'Agile Teams',
      practice: 'WIP Limits',
      description: 'Ограничение количества задач в работе',
      implementation: [
        'Установить лимиты для каждой колонки',
        'Мониторить соблюдение лимитов',
        'Фокусироваться на завершении задач',
      ],
      benefits: [
        'Улучшение flow',
        'Снижение времени выполнения',
        'Повышение качества',
      ],
    },
  ];

  /**
   * 🔍 Найти подходящий паттерн для задачи
   */
  findMatchingPattern(
    taskType: string,
    keywords: string[],
    columnName: string,
  ): KanbanPattern | null {
    this.logger.log(
      `🔍 Searching pattern for: ${taskType}, keywords: ${keywords.join(', ')}, column: ${columnName}`,
    );

    for (const pattern of this.patterns) {
      const matchScore = this.calculatePatternMatch(
        pattern,
        taskType,
        keywords,
      );

      if (matchScore > 0.6) {
        this.logger.log(
          `✅ Found matching pattern: ${pattern.name} (score: ${matchScore})`,
        );
        return pattern;
      }
    }

    this.logger.log('❌ No matching pattern found');
    return null;
  }

  /**
   * 📋 Получить применимые бизнес-правила
   */
  getApplicableBusinessRules(
    taskType: string,
    columnName: string,
    taskData: any,
  ): BusinessRule[] {
    this.logger.log(
      `📋 Getting business rules for: ${taskType} in ${columnName}`,
    );

    return this.businessRules
      .filter((rule) => {
        // Проверяем применимость к колонке
        const columnApplicable =
          rule.applicableColumns.includes(columnName) ||
          rule.applicableColumns.includes('all');

        // Проверяем применимость к типу задачи
        const typeApplicable =
          rule.taskTypes.includes(taskType) || rule.taskTypes.includes('all');

        return columnApplicable && typeApplicable;
      })
      .sort((a, b) => a.priority - b.priority);
  }

  /**
   * 🏭 Получить лучшие практики для отрасли
   */
  getIndustryBestPractices(
    industry: string = 'Software Development',
  ): IndustryBestPractice[] {
    return this.industryPractices.filter(
      (practice) =>
        practice.industry === industry || practice.industry === 'General',
    );
  }

  /**
   * 🎯 Получить рекомендации для оптимизации
   */
  getOptimizationRecommendations(
    taskType: string,
    columnName: string,
    timeInColumn: number,
  ): string[] {
    const recommendations: string[] = [];

    // Рекомендации на основе времени в колонке
    if (timeInColumn > 72) {
      // Более 3 дней
      recommendations.push(
        'Задача слишком долго в колонке - проверить блокеры',
      );
      recommendations.push('Рассмотреть разбиение на подзадачи');
    }

    // Рекомендации на основе типа задачи
    if (taskType === 'bug' && columnName === 'To Do') {
      recommendations.push('Баги должны приоритизироваться выше обычных задач');
    }

    if (taskType === 'epic' && columnName === 'In Progress') {
      recommendations.push('Epic слишком крупный - разбить на задачи');
    }

    // Рекомендации на основе колонки
    if (columnName === 'In Progress') {
      recommendations.push('Проверить WIP лимиты');
      recommendations.push('Убедиться в наличии ответственного');
    }

    if (columnName === 'Testing') {
      recommendations.push('Назначить тестировщика');
      recommendations.push('Подготовить тестовые данные');
    }

    return recommendations;
  }

  /**
   * 📊 Вычислить соответствие паттерна
   */
  private calculatePatternMatch(
    pattern: KanbanPattern,
    taskType: string,
    keywords: string[],
  ): number {
    let score = 0;
    const maxScore = pattern.triggers.length;

    for (const trigger of pattern.triggers) {
      if (taskType.toLowerCase().includes(trigger.toLowerCase())) {
        score += 1;
      }

      for (const keyword of keywords) {
        if (keyword.toLowerCase().includes(trigger.toLowerCase())) {
          score += 0.5;
        }
      }
    }

    return maxScore > 0 ? score / maxScore : 0;
  }

  /**
   * 📚 Добавить новый паттерн (для обучения системы)
   */
  addPattern(pattern: KanbanPattern): void {
    this.patterns.push(pattern);
    this.logger.log(`📚 Added new pattern: ${pattern.name}`);
  }

  /**
   * 📋 Добавить новое бизнес-правило
   */
  addBusinessRule(rule: BusinessRule): void {
    this.businessRules.push(rule);
    this.logger.log(`📋 Added new business rule: ${rule.name}`);
  }

  /**
   * 🏭 Добавить новую практику
   */
  addBestPractice(practice: IndustryBestPractice): void {
    this.industryPractices.push(practice);
    this.logger.log(`🏭 Added new best practice: ${practice.practice}`);
  }

  /**
   * 📊 Получить статистику базы знаний
   */
  getKnowledgeBaseStats(): {
    patterns: number;
    businessRules: number;
    bestPractices: number;
  } {
    return {
      patterns: this.patterns.length,
      businessRules: this.businessRules.length,
      bestPractices: this.industryPractices.length,
    };
  }
}
