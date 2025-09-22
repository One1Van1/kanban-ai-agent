import { Injectable, Logger } from '@nestjs/common';
import { AiBaseService } from '../shared/ai-base.service';
import {
  ExecuteTasksResponse,
  ExecuteTaskResult,
  EntityCreationResult,
} from './execute-tasks.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ExecuteTasksService extends AiBaseService {
  protected readonly logger = new Logger(ExecuteTasksService.name);

  async executeTasks(): Promise<ExecuteTasksResponse> {
    this.logger.log('🤖 Starting execution of tasks in In Progress column...');

    try {
      // Получаем все задачи из колонки In Progress
      const progressTasks = await this.getColumnTasksService.getTasksFromColumn(
        'In Progress',
        { maxResults: 50 },
      );

      this.logger.log(
        `Found ${progressTasks.tasks.length} tasks in In Progress column`,
      );

      const results: ExecuteTaskResult[] = [];
      let successfulExecutions = 0;

      // Выполняем каждую задачу
      for (const task of progressTasks.tasks) {
        this.logger.log(`🔄 Executing task: ${task.key} - ${task.summary}`);

        const result = await this.executeTask(
          task.key,
          task.summary,
          task.description,
        );

        if (result.success) {
          successfulExecutions++;
        }

        results.push(result);

        this.logger.log(
          `Task ${task.key}: ${result.success ? 'SUCCESS' : 'FAILED'} - ${result.reason}`,
        );
      }

      const response: ExecuteTasksResponse = {
        tasksExecuted: progressTasks.tasks.length,
        successfulExecutions,
        results,
      };

      this.logger.log(
        `✅ Execution completed: ${successfulExecutions}/${progressTasks.tasks.length} tasks executed successfully`,
      );

      return response;
    } catch (error) {
      this.logger.error(`Failed to execute tasks: ${error.message}`);
      throw error;
    }
  }

  /**
   * Выполняет конкретную задачу
   */
  private async executeTask(
    taskKey: string,
    summary: string,
    description?: string,
  ): Promise<ExecuteTaskResult> {
    const fullText = summary + ' ' + (description || '');
    const text = fullText.toLowerCase();

    try {
      // Проверяем, является ли задача созданием сущности
      if (text.includes('создать сущность') || text.includes('create entity')) {
        return await this.executeEntityCreationTask(taskKey, fullText);
      }

      // Для других типов задач пока возвращаем "не поддерживается"
      return {
        taskKey,
        executed: false,
        success: false,
        reason: 'Task type not supported for execution yet',
      };
    } catch (error) {
      this.logger.error(`Error executing task ${taskKey}: ${error.message}`);
      return {
        taskKey,
        executed: true,
        success: false,
        reason: 'Execution failed',
        error: error.message,
      };
    }
  }

  /**
   * Выполняет задачу создания сущности
   */
  private async executeEntityCreationTask(
    taskKey: string,
    fullText: string,
  ): Promise<ExecuteTaskResult> {
    this.logger.log(`🏗️ Executing entity creation task: ${taskKey}`);

    // Извлекаем название сущности
    let entityName = null;
    const entityNameMatch =
      fullText.match(/сущность\s+(\w+)/i) || fullText.match(/entity\s+(\w+)/i);
    if (entityNameMatch) {
      entityName = entityNameMatch[1];
    }

    if (!entityName) {
      return {
        taskKey,
        executed: true,
        success: false,
        reason: 'Could not extract entity name from task description',
      };
    }

    // Извлекаем поля сущности
    const fields = this.extractEntityFields(fullText);
    if (fields.length === 0) {
      return {
        taskKey,
        executed: true,
        success: false,
        reason: 'Could not extract entity fields from task description',
      };
    }

    // Создаем файл сущности
    try {
      const result = await this.createEntityFile(entityName, fields);

      this.logger.log(
        `✅ Entity ${entityName} created successfully at ${result.filePath}`,
      );

      return {
        taskKey,
        executed: true,
        success: true,
        reason: `Entity ${entityName} created with fields: ${fields.join(', ')}`,
        filesCreated: [result.filePath],
      };
    } catch (error) {
      return {
        taskKey,
        executed: true,
        success: false,
        reason: 'Failed to create entity file',
        error: error.message,
      };
    }
  }

  /**
   * Извлекает поля сущности из текста задачи
   */
  private extractEntityFields(text: string): string[] {
    const fields: string[] = [];

    // Ищем паттерн "поля: field1, field2, field3" или "fields: field1, field2"
    const fieldListPattern = /поля[^:]*:\s*([^.\n]+)/i;
    const fieldListMatch = text.match(fieldListPattern);

    if (fieldListMatch && fieldListMatch[1]) {
      const fieldsList = fieldListMatch[1]
        .split(',')
        .map((field) => field.trim().replace(/['"]/g, '')) // Убираем кавычки
        .filter((field) => field.length > 0);
      fields.push(...fieldsList);
    }

    // Убираем дубликаты
    return [...new Set(fields)];
  } /**
   * Создает файл сущности TypeORM
   */
  private async createEntityFile(
    entityName: string,
    fields: string[],
  ): Promise<EntityCreationResult> {
    const entitiesPath = path.join(
      process.cwd(),
      'src',
      'generated',
      'entities',
    );

    // Создаем папку если не существует
    if (!fs.existsSync(entitiesPath)) {
      fs.mkdirSync(entitiesPath, { recursive: true });
    }

    const fileName = `${entityName.toLowerCase()}.entity.ts`;
    const filePath = path.join(entitiesPath, fileName);

    // Генерируем содержимое файла
    const fileContent = this.generateEntityFileContent(entityName, fields);

    // Записываем файл
    fs.writeFileSync(filePath, fileContent, 'utf8');

    return {
      entityName,
      filePath,
      fields,
    };
  }

  /**
   * Генерирует содержимое файла сущности
   */
  private generateEntityFileContent(
    entityName: string,
    fields: string[],
  ): string {
    const imports = `import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';`;

    const className = entityName.charAt(0).toUpperCase() + entityName.slice(1);
    const tableName = entityName.toLowerCase() + 's';

    let classContent = `@Entity('${tableName}')\nexport class ${className} {\n`;

    // Добавляем поля
    fields.forEach((field) => {
      if (field === 'id') {
        classContent += `  @PrimaryGeneratedColumn()\n  ${field}: number;\n\n`;
      } else if (field === 'createdAt') {
        classContent += `  @CreateDateColumn()\n  ${field}: Date;\n\n`;
      } else if (field === 'updatedAt') {
        classContent += `  @UpdateDateColumn()\n  ${field}: Date;\n\n`;
      } else if (
        field.toLowerCase().includes('amount') ||
        field.toLowerCase().includes('price')
      ) {
        classContent += `  @Column('decimal', { precision: 10, scale: 2 })\n  ${field}: number;\n\n`;
      } else if (field.toLowerCase().includes('id') && field !== 'id') {
        classContent += `  @Column()\n  ${field}: number;\n\n`;
      } else {
        classContent += `  @Column()\n  ${field}: string;\n\n`;
      }
    });

    classContent += '}';

    return `${imports}\n\n${classContent}`;
  }
}
