import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { aiAgentConfig } from '../config';
import * as fs from 'fs';
import * as path from 'path';

// Динамически загружаем контроллеры и сервисы
const featuresDir = path.resolve(__dirname, '../features/ai-agent');
const controllers: any[] = [];
const providers: any[] = [];

if (fs.existsSync(featuresDir)) {
  fs.readdirSync(featuresDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .forEach((dirent) => {
      try {
        const subDir = path.join(featuresDir, dirent.name);
        const files = fs.readdirSync(subDir);

        files.forEach((file) => {
          // Загружаем контроллеры (.js и .ts, исключая .d.ts)
          if (
            file.endsWith('.controller.js') ||
            (file.endsWith('.controller.ts') && !file.endsWith('.d.ts'))
          ) {
            const filePath = path.join(subDir, file.replace(/\.(js|ts)$/, ''));
            try {
              const module = require(filePath);
              Object.values(module).forEach((exportedItem: any) => {
                if (
                  typeof exportedItem === 'function' &&
                  exportedItem.name &&
                  exportedItem.name.endsWith('Controller')
                ) {
                  controllers.push(exportedItem);
                }
              });
            } catch (err) {
              console.warn(
                `Ошибка загрузки контроллера ${filePath}:`,
                err.message,
              );
            }
          }

          // Загружаем сервисы (.js и .ts, исключая .d.ts и .spec.ts)
          if (
            (file.endsWith('.service.js') ||
              (file.endsWith('.service.ts') && !file.endsWith('.d.ts'))) &&
            !file.includes('.spec.')
          ) {
            const filePath = path.join(subDir, file.replace(/\.(js|ts)$/, ''));
            try {
              const module = require(filePath);
              Object.values(module).forEach((exportedItem: any) => {
                if (
                  typeof exportedItem === 'function' &&
                  exportedItem.name &&
                  exportedItem.name.endsWith('Service')
                ) {
                  providers.push(exportedItem);
                }
              });
            } catch (err) {
              console.warn(`Ошибка загрузки сервиса ${filePath}:`, err.message);
            }
          }
        });
      } catch (err) {
        console.error(`Ошибка обработки директории ${dirent.name}:`, err);
      }
    });
}

@Module({
  imports: [ConfigModule.forFeature(aiAgentConfig)],
  controllers,
  providers,
  exports: providers,
})
export class AiAgentModule {}
