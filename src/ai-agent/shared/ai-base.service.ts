import { Injectable, Logger } from '@nestjs/common';
import { GetColumnTasksService } from '../../jira/get-column-tasks/get-column-tasks.service';
import { MoveTaskService } from '../../jira/move-task/move-task.service';
import { AddTaskCommentService } from '../../jira/add-task-comment/add-task-comment.service';
import { CheckEntityExistsService } from '../check-entity-exists/check-entity-exists.service';
import {
  TaskAnalysisResult,
  TaskProgressResult,
} from '../types/ai-agent.interface';

@Injectable()
export class AiBaseService {
  protected readonly logger = new Logger(AiBaseService.name);

  constructor(
    protected readonly getColumnTasksService: GetColumnTasksService,
    protected readonly moveTaskService: MoveTaskService,
    protected readonly addTaskCommentService: AddTaskCommentService,
    protected readonly checkEntityExistsService: CheckEntityExistsService,
  ) {}

  /**
   * Анализ задачи из колонки New (логика для сущностей)
   */
  protected analyzeNewTask(
    taskKey: string,
    summary: string,
    description?: string,
  ): TaskAnalysisResult {
    this.logger.log(`Analyzing new task: ${taskKey} - ${summary}`);

    const text = (summary + ' ' + (description || '')).toLowerCase();

    // Проверяем, является ли задача созданием сущности
    if (text.includes('создать сущность') || text.includes('create entity')) {
      return this.analyzeEntityCreationTask(taskKey, summary, description);
    }

    // Общая логика для других задач
    const clearKeywords = [
      'fix',
      'bug',
      'implement',
      'add',
      'create',
      'update',
      'delete',
      'refactor',
    ];
    const unclearKeywords = [
      'maybe',
      'somehow',
      'think',
      'probably',
      'something',
    ];

    const hasClearKeywords = clearKeywords.some((keyword) =>
      text.includes(keyword),
    );
    const hasUnclearKeywords = unclearKeywords.some((keyword) =>
      text.includes(keyword),
    );
    const hasEnoughDetail = text.length > 20;

    if (hasUnclearKeywords || !hasEnoughDetail) {
      return {
        taskKey,
        isUnderstandable: false,
        decision: 'move_to_questions',
        reason: 'Task description is unclear or lacks detail',
        suggestedComment:
          'AI: Задача требует уточнения. Описание неполное или содержит неопределенные формулировки.',
      };
    }

    if (hasClearKeywords && hasEnoughDetail) {
      return {
        taskKey,
        isUnderstandable: true,
        decision: 'move_to_progress',
        reason: 'Task is clear and well-defined',
        suggestedComment: 'AI: Задача понятна, перемещаю в работу.',
      };
    }

    return {
      taskKey,
      isUnderstandable: false,
      decision: 'stay_in_new',
      reason: 'Task needs more analysis',
    };
  }

  /**
   * Специальный анализ задач создания сущностей
   */
  private analyzeEntityCreationTask(
    taskKey: string,
    summary: string,
    description?: string,
  ): TaskAnalysisResult {
    this.logger.log(`Analyzing entity creation task: ${taskKey}`);

    const fullText = summary + ' ' + (description || '');

    // ВРЕМЕННЫЙ ОТЛАДОЧНЫЙ ВЫВОД
    this.logger.log(`🔍 DEBUG: Full text for analysis: "${fullText}"`);
    this.logger.log(`🔍 DEBUG: Summary: "${summary}"`);
    this.logger.log(`🔍 DEBUG: Description: "${description}"`);

    // Извлекаем название сущности - ищем разные паттерны
    let entityName = null;

    // Паттерн 1: "сущность Order" или "entity Order" (через пробел)
    let entityNameMatch =
      fullText.match(/сущность\s+(\w+)/i) || fullText.match(/entity\s+(\w+)/i);
    if (entityNameMatch) {
      entityName = entityNameMatch[1];
    }

    // Паттерн 2: "Создать сущность Order" или "Create entity Order" (через пробелы)
    if (!entityName) {
      entityNameMatch =
        fullText.match(/создать\s+сущность\s+(\w+)/i) ||
        fullText.match(/create\s+entity\s+(\w+)/i);
      if (entityNameMatch) {
        entityName = entityNameMatch[1];
      }
    }

    // Паттерн 3: Ищем слово с заглавной буквы после "сущность" с любыми разделителями
    if (!entityName) {
      entityNameMatch =
        fullText.match(/сущность\s+([A-Z]\w+)/i) ||
        fullText.match(/entity\s+([A-Z]\w+)/i);
      if (entityNameMatch) {
        entityName = entityNameMatch[1];
      }
    }

    // Паттерн 4: Ищем любое слово после "сущность" (более гибко)
    if (!entityName) {
      entityNameMatch =
        fullText.match(/сущность\s+(\w+)/gi) ||
        fullText.match(/entity\s+(\w+)/gi);
      if (entityNameMatch && entityNameMatch[0]) {
        // Берем первое найденное слово после "сущность"
        const match = entityNameMatch[0].match(/\s+(\w+)/i);
        if (match) {
          entityName = match[1];
        }
      }
    }

    if (!entityName) {
      return {
        taskKey,
        isUnderstandable: false,
        decision: 'move_to_questions',
        reason: 'Entity name not specified',
        suggestedComment:
          'AI: Не указано название сущности. Пожалуйста, уточните какую сущность нужно создать.',
      };
    }

    // Проверяем наличие описания полей
    const hasFields = this.checkEntityFieldsDescription(fullText);

    if (!hasFields) {
      return {
        taskKey,
        isUnderstandable: false,
        decision: 'move_to_questions',
        reason: 'Entity fields not described',
        suggestedComment: `AI: Не хватает информации - нет описания полей сущности ${entityName}. Пожалуйста, укажите какие поля должны быть у сущности.`,
      };
    }

    return {
      taskKey,
      isUnderstandable: true,
      decision: 'move_to_progress',
      reason: `Entity creation task for ${entityName} is well-defined with fields`,
      suggestedComment: `AI: Задача создания сущности ${entityName} понятна. Описание полей присутствует, перемещаю в работу.`,
    };
  }

  /**
   * Проверяет наличие описания полей сущности
   */
  private checkEntityFieldsDescription(text: string): boolean {
    const fieldKeywords = [
      'поля',
      'fields',
      'поле',
      'field',
      'свойства',
      'properties',
      'атрибуты',
    ];
    const hasFieldKeywords = fieldKeywords.some((keyword) =>
      text.toLowerCase().includes(keyword),
    );

    // Проверяем наличие типичных полей
    const commonFields = [
      'id',
      'name',
      'title',
      'status',
      'amount',
      'userId',
      'createdAt',
      'updatedAt',
      'totalAmount', // Добавляем поле из вашего примера
    ];
    const hasCommonFields = commonFields.some((field) =>
      text.toLowerCase().includes(field.toLowerCase()),
    );

    // Дополнительная проверка: ищем паттерны вида "поля: id, name, status"
    const fieldListPattern = /поля[^:]*:([^.]+)/i;
    const fieldListMatch = text.match(fieldListPattern);
    const hasFieldList = fieldListMatch && fieldListMatch[1].includes(',');

    return hasFieldKeywords || hasCommonFields || !!hasFieldList;
  }

  /**
   * Анализ задачи из колонки In Progress (логика для сущностей)
   */
  protected async analyzeProgressTask(
    taskKey: string,
    summary: string,
    description?: string,
  ): Promise<TaskProgressResult> {
    this.logger.log(`Analyzing progress task: ${taskKey} - ${summary}`);

    const text = (summary + ' ' + (description || '')).toLowerCase();

    // Проверяем, является ли задача созданием сущности
    if (text.includes('создать сущность') || text.includes('create entity')) {
      return this.analyzeEntityProgressTask(taskKey, summary, description);
    }

    // Общая логика для других задач
    const completedKeywords = [
      'done',
      'completed',
      'finished',
      'ready',
      'implemented',
    ];
    const workingKeywords = ['wip', 'working', 'progress', 'developing'];

    const isCompleted = completedKeywords.some((keyword) =>
      text.includes(keyword),
    );
    const isWorking = workingKeywords.some((keyword) => text.includes(keyword));

    if (isCompleted) {
      return {
        taskKey,
        isCompleted: true,
        decision: 'move_to_review',
        reason: 'Task appears to be completed',
        suggestedComment: 'AI: Задача выполнена, перемещаю в ревью.',
      };
    }

    if (isWorking) {
      return {
        taskKey,
        isCompleted: false,
        decision: 'stay_in_progress',
        reason: 'Task is still in progress',
      };
    }

    // По умолчанию оставляем в прогрессе
    return {
      taskKey,
      isCompleted: false,
      decision: 'stay_in_progress',
      reason: 'Task status unclear, keeping in progress',
    };
  }

  /**
   * Специальный анализ задач создания сущностей в Progress
   */
  private async analyzeEntityProgressTask(
    taskKey: string,
    summary: string,
    description?: string,
  ): Promise<TaskProgressResult> {
    this.logger.log(`Analyzing entity progress task: ${taskKey}`);

    const fullText = summary + ' ' + (description || '');

    // Извлекаем название сущности
    const entityNameMatch =
      fullText.match(/сущность\s+(\w+)/i) || fullText.match(/entity\s+(\w+)/i);
    const entityName = entityNameMatch ? entityNameMatch[1] : null;

    if (!entityName) {
      return {
        taskKey,
        isCompleted: false,
        decision: 'stay_in_progress',
        reason: 'Cannot determine entity name',
        suggestedComment:
          'AI: Не удалось определить название сущности для проверки готовности.',
      };
    }

    // Проверяем существование сущности через check-entity-exists endpoint
    try {
      const entityExists = await this.checkEntityExists(entityName);

      if (entityExists) {
        return {
          taskKey,
          isCompleted: true,
          decision: 'move_to_review',
          reason: `Entity ${entityName} exists in project`,
          suggestedComment: `AI: Сущность ${entityName} создана и найдена в проекте. Перемещаю в ревью.`,
        };
      } else {
        return {
          taskKey,
          isCompleted: false,
          decision: 'stay_in_progress',
          reason: `Entity ${entityName} not found in project`,
          suggestedComment: `AI: Сущность ${entityName} ещё не создана. Оставляю в работе.`,
        };
      }
    } catch (error) {
      this.logger.error(`Error checking entity existence: ${error.message}`);
      return {
        taskKey,
        isCompleted: false,
        decision: 'stay_in_progress',
        reason: 'Error checking entity existence',
      };
    }
  }

  /**
   * Проверяет существование сущности через CheckEntityExistsService
   */
  private async checkEntityExists(entityName: string): Promise<boolean> {
    try {
      const result =
        await this.checkEntityExistsService.checkEntityExists(entityName);
      return result.exists;
    } catch (error) {
      this.logger.error(`Failed to check entity existence: ${error.message}`);
      return false;
    }
  }

  /**
   * Выполняет решение по анализу задачи из New
   */
  protected async executeTaskDecision(
    result: TaskAnalysisResult,
  ): Promise<boolean> {
    try {
      if (result.decision === 'move_to_progress') {
        // Перемещаем в In Progress
        await this.moveTaskService.moveTaskToColumn(
          result.taskKey,
          'In Progress',
        );
        this.logger.log(`Moved task ${result.taskKey} to In Progress`);
      } else if (result.decision === 'move_to_questions') {
        // Перемещаем в Questions
        await this.moveTaskService.moveTaskToColumn(
          result.taskKey,
          'Questions',
        );
        this.logger.log(`Moved task ${result.taskKey} to Questions`);
      }

      // Добавляем комментарий если есть
      if (result.suggestedComment) {
        await this.addTaskCommentService.addCommentToTask(
          result.taskKey,
          result.suggestedComment,
        );
      }

      return true;
    } catch (error) {
      this.logger.error(`Failed to execute task decision: ${error.message}`);
      return false;
    }
  }

  /**
   * Выполняет решение по анализу задачи из Progress
   */
  protected async executeProgressDecision(
    result: TaskProgressResult,
  ): Promise<boolean> {
    try {
      if (result.decision === 'move_to_review') {
        // Перемещаем в Review
        await this.moveTaskService.moveTaskToColumn(result.taskKey, 'Review');
        this.logger.log(`Moved task ${result.taskKey} to Review`);
      }

      // Добавляем комментарий если есть
      if (result.suggestedComment) {
        await this.addTaskCommentService.addCommentToTask(
          result.taskKey,
          result.suggestedComment,
        );
      }

      return true;
    } catch (error) {
      this.logger.error(
        `Failed to execute progress decision: ${error.message}`,
      );
      return false;
    }
  }
}
