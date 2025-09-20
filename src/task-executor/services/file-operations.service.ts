import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class FileOperationsService {
  private readonly logger = new Logger(FileOperationsService.name);

  async createFile(filePath: string, content: string): Promise<boolean> {
    try {
      // Создаем директорию если не существует
      const dir = path.dirname(filePath);
      await this.ensureDirectory(dir);

      // Создаем файл
      await fs.writeFile(filePath, content, 'utf8');
      this.logger.log(`✅ Файл создан: ${filePath}`);
      return true;
    } catch (error) {
      this.logger.error(`❌ Ошибка создания файла ${filePath}:`, error);
      return false;
    }
  }

  async createDirectory(dirPath: string): Promise<boolean> {
    try {
      await fs.mkdir(dirPath, { recursive: true });
      this.logger.log(`✅ Директория создана: ${dirPath}`);
      return true;
    } catch (error) {
      this.logger.error(`❌ Ошибка создания директории ${dirPath}:`, error);
      return false;
    }
  }

  async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async readFile(filePath: string): Promise<string | null> {
    try {
      return await fs.readFile(filePath, 'utf8');
    } catch (error) {
      this.logger.error(`❌ Ошибка чтения файла ${filePath}:`, error);
      return null;
    }
  }

  private async ensureDirectory(dir: string): Promise<void> {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }

  /**
   * Получает корневую директорию проекта
   */
  getProjectRoot(): string {
    return process.cwd();
  }

  /**
   * Создает путь относительно корня проекта
   */
  getProjectPath(...segments: string[]): string {
    return path.join(this.getProjectRoot(), ...segments);
  }
}
