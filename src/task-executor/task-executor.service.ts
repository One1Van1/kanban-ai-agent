import { Injectable, Logger } from '@nestjs/common';
import {
  TaskExecutionPlan,
  ExecutableAction,
  ActionType,
  ExecutionResult,
} from './interfaces/execution.interface';
import { CodeGeneratorService } from './services/code-generator.service';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class TaskExecutorService {
  private readonly logger = new Logger(TaskExecutorService.name);

  constructor(private readonly codeGenerator: CodeGeneratorService) {}

  /**
   * Анализирует задачу и создает план выполнения
   */
  analyzeTaskForExecution(
    taskKey: string,
    summary: string,
    description: string,
  ): TaskExecutionPlan | null {
    const lowerSummary = summary.toLowerCase();
    const lowerDescription = description.toLowerCase();

    // Определяем тип задачи по ключевым словам
    if (this.isEntityCreationTask(lowerSummary, lowerDescription)) {
      const entityName = this.extractEntityName(summary, description);
      if (entityName) {
        return this.createEntityExecutionPlan(
          taskKey,
          summary,
          description,
          entityName,
        );
      }
    }

    // Добавим другие типы задач позже
    return null;
  }

  /**
   * Выполняет план задачи
   */
  async executeTask(plan: TaskExecutionPlan): Promise<ExecutionResult[]> {
    const results: ExecutionResult[] = [];

    this.logger.log(
      `🚀 Начинаем выполнение задачи ${plan.taskKey}: ${plan.summary}`,
    );

    for (const action of plan.actions) {
      try {
        const result = await this.executeAction(action);
        results.push(result);

        if (!result.success) {
          this.logger.warn(`⚠️ Действие неуспешно: ${result.message}`);
          break; // Прерываем выполнение при ошибке
        }
      } catch (error) {
        const errorResult: ExecutionResult = {
          success: false,
          message: `Ошибка выполнения действия ${action.type}: ${error.message}`,
          error: error.message,
        };
        results.push(errorResult);
        break;
      }
    }

    return results;
  }

  /**
   * Выполняет отдельное действие
   */
  private async executeAction(
    action: ExecutableAction,
  ): Promise<ExecutionResult> {
    this.logger.log(
      `🔄 Выполняем действие: ${action.type} - ${action.description}`,
    );

    switch (action.type) {
      case ActionType.CREATE_ENTITY:
        if (action.entityName) {
          const basePath = process.cwd(); // Корневая папка проекта
          return this.codeGenerator.createEntityFiles(
            action.entityName,
            basePath,
          );
        }
        break;

      // Добавим другие типы действий позже
      default:
        return {
          success: false,
          message: `Неподдерживаемый тип действия: ${action.type}`,
        };
    }

    return {
      success: false,
      message: 'Не удалось выполнить действие',
    };
  }

  /**
   * Проверяет, является ли задача созданием сущности
   */
  private isEntityCreationTask(summary: string, description: string): boolean {
    const entityKeywords = [
      'создать сущность',
      'create entity',
      'добавить сущность',
      'сделать сущность',
      'новая сущность',
      'создать модель',
      'create model',
    ];

    const fullText = `${summary} ${description}`;

    this.logger.log(`🔍 Checking if entity creation task:`);
    this.logger.log(`📝 Summary: "${summary}"`);
    this.logger.log(`📄 Description: "${description}"`);
    this.logger.log(`🔎 Full text: "${fullText}"`);

    const isEntity = entityKeywords.some((keyword) => {
      const found = fullText.includes(keyword);
      this.logger.log(`🎯 Keyword "${keyword}": ${found ? '✅' : '❌'}`);
      return found;
    });

    this.logger.log(
      `🏁 Result: ${isEntity ? '✅ IS ENTITY' : '❌ NOT ENTITY'}`,
    );
    return isEntity;
  }

  /**
   * Извлекает название сущности из текста
   */
  private extractEntityName(
    summary: string,
    description: string,
  ): string | null {
    const fullText = `${summary} ${description}`;

    // Ищем паттерны вроде "создать сущность User" или "create entity Product"
    const patterns = [
      /создать сущность\s+(\w+)/i,
      /create entity\s+(\w+)/i,
      /сделать сущность\s+(\w+)/i,
      /добавить сущность\s+(\w+)/i,
      /сущность\s+(\w+)/i,
      /entity\s+(\w+)/i,
    ];

    for (const pattern of patterns) {
      const match = fullText.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }

  /**
   * Создает план выполнения для создания сущности
   */
  private createEntityExecutionPlan(
    taskKey: string,
    summary: string,
    description: string,
    entityName: string,
  ): TaskExecutionPlan {
    return {
      taskKey,
      summary,
      description,
      actions: [
        {
          type: ActionType.CREATE_ENTITY,
          description: `Создание полной сущности ${entityName} (Entity, Service, Controller, Module)`,
          entityName,
        },
      ],
      expectedResult: `Сущность ${entityName} будет создана со всеми необходимыми файлами`,
    };
  }
}
