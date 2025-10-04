import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

// Stable services (dependencies)
import { SearchTasksService } from '../features/jira-integration/search-tasks-correct/search-tasks.service';
import { AddTaskCommentService } from '../features/jira-integration/add-task-comment/add-task-comment.service';
import { MoveTaskService } from '../features/jira-integration/move-task-correct/move-task.service';

// Динамически загружаем контроллеры и сервисы
const featuresDir = path.resolve(__dirname, '../features/ai-reporting');
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
            const controllerPath = path.resolve(subDir, file);
            const controllerModule = require(controllerPath);
            Object.values(controllerModule).forEach((exportedClass: any) => {
              if (
                exportedClass &&
                typeof exportedClass === 'function' &&
                Reflect.getMetadata('path', exportedClass)
              ) {
                controllers.push(exportedClass);
              }
            });
          }

          // Загружаем сервисы (.js и .ts, исключая .d.ts)
          if (
            file.endsWith('.service.js') ||
            (file.endsWith('.service.ts') && !file.endsWith('.d.ts'))
          ) {
            const servicePath = path.resolve(subDir, file);
            const serviceModule = require(servicePath);
            Object.values(serviceModule).forEach((exportedClass: any) => {
              if (
                exportedClass &&
                typeof exportedClass === 'function' &&
                (Reflect.getMetadata('design:paramtypes', exportedClass) !==
                  undefined ||
                  exportedClass.name.endsWith('Service'))
              ) {
                providers.push(exportedClass);
              }
            });
          }
        });
      } catch (error) {
        console.warn(
          `Could not load files from ${dirent.name}:`,
          error.message,
        );
      }
    });
}

console.log('🤖 AI Reporting - Loaded controllers:', controllers);
console.log('🤖 AI Reporting - Controllers count:', controllers.length);
console.log(
  '🤖 AI Reporting - Controllers names:',
  controllers.map((ctrl) => ctrl.name),
);
console.log('🤖 AI Reporting - Providers count:', providers.length);
console.log(
  '🤖 AI Reporting - Providers names:',
  providers.map((prov) => prov.name),
);

@Module({
  imports: [ConfigModule],
  controllers: controllers,
  providers: [
    ...providers,
    SearchTasksService,
    AddTaskCommentService,
    MoveTaskService,
  ],
  exports: [
    ...providers,
    SearchTasksService,
    AddTaskCommentService,
    MoveTaskService,
  ],
})
export class AiReportingModule {}
