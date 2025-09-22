import { Injectable, Logger } from '@nestjs/common';
import { CheckEntityExistsResponse } from './check-entity-exists.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CheckEntityExistsService {
  private readonly logger = new Logger(CheckEntityExistsService.name);

  /**
   * Проверяет существование сущности в проекте
   */
  async checkEntityExists(
    entityName: string,
  ): Promise<CheckEntityExistsResponse> {
    this.logger.log(`🔍 Checking if entity "${entityName}" exists...`);

    try {
      // Ищем в папке src/generated/entities/
      const entitiesPath = path.join(
        process.cwd(),
        'src',
        'generated',
        'entities',
      );
      const entityFileName = `${entityName.toLowerCase()}.entity.ts`;
      const fullPath = path.join(entitiesPath, entityFileName);

      this.logger.log(`Looking for entity file: ${fullPath}`);

      if (fs.existsSync(fullPath)) {
        // Читаем файл и извлекаем поля
        const fileContent = fs.readFileSync(fullPath, 'utf8');
        const fields = this.extractEntityFields(fileContent);

        this.logger.log(
          `✅ Entity "${entityName}" found with fields: ${fields.join(', ')}`,
        );

        return {
          entityName,
          exists: true,
          filePath: fullPath,
          fields,
        };
      } else {
        this.logger.log(`❌ Entity "${entityName}" not found`);

        return {
          entityName,
          exists: false,
        };
      }
    } catch (error) {
      this.logger.error(
        `Error checking entity "${entityName}":`,
        error.message,
      );
      return {
        entityName,
        exists: false,
      };
    }
  }

  /**
   * Извлекает поля из файла сущности
   */
  private extractEntityFields(fileContent: string): string[] {
    const fields: string[] = [];

    // Простой парсинг полей - ищем строки с @Column или @PrimaryGeneratedColumn
    const lines = fileContent.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Если строка содержит декоратор колонки
      if (
        line.includes('@Column') ||
        line.includes('@PrimaryGeneratedColumn')
      ) {
        // Следующая строка должна содержать имя поля
        if (i + 1 < lines.length) {
          const nextLine = lines[i + 1].trim();
          const fieldMatch = nextLine.match(/^(\w+):/);
          if (fieldMatch) {
            fields.push(fieldMatch[1]);
          }
        }
      }
    }

    return fields;
  }
}
