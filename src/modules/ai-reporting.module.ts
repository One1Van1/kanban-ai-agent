import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

// Stable services (dependencies)
import { SearchTasksModule } from '../jira/search-tasks/search-tasks.module';
import { AddTaskCommentModule } from '../jira/add-task-comment/add-task-comment.module';
import { MoveTaskModule } from '../jira/move-task/move-task.module';

// Динамически загружаем контроллеры и сервисы
const featuresDir = path.resolve(__dirname, '../features/ai-reporting');
const controllers: any[] = [];
const providers: any[] = [];

if (fs.existsSync(featuresDir)) {
    fs.readdirSync(featuresDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .forEach(dirent => {
            try {
                const subDir = path.join(featuresDir, dirent.name);
                const files = fs.readdirSync(subDir);

                files.forEach(file => {

                    // Загружаем контроллеры (.js и .ts, исключая .d.ts)
                    if (
                        file.endsWith('.controller.js') ||
                        (file.endsWith('.controller.ts') && !file.endsWith('.d.ts'))
                    ) {
                        const controllerPath = path.resolve(subDir, file);
                        const controllerModule = require(controllerPath);
                        Object.values(controllerModule).forEach((exportedClass: any) => {
                            if (exportedClass && typeof exportedClass === 'function' &&
                                Reflect.getMetadata('path', exportedClass)) {
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
                            if (exportedClass && typeof exportedClass === 'function' &&
                                (Reflect.getMetadata('design:paramtypes', exportedClass) !== undefined ||
                                 exportedClass.name.endsWith('Service'))) {
                                providers.push(exportedClass);
                            }
                        });
                    }
                });
            } catch (error) {
                console.warn(`Could not load files from ${dirent.name}:`, error.message);
            }
        });
}

console.log('🤖 AI Reporting - Loaded controllers:', controllers);
console.log('🤖 AI Reporting - Controllers count:', controllers.length);
console.log('🤖 AI Reporting - Controllers names:', controllers.map(ctrl => ctrl.name));
console.log('🤖 AI Reporting - Providers count:', providers.length);
console.log('🤖 AI Reporting - Providers names:', providers.map(prov => prov.name));

@Module({
    imports: [
        ConfigModule,
        SearchTasksModule,
        AddTaskCommentModule,
        MoveTaskModule,
    ],
    controllers: controllers,
    providers: providers,
    exports: providers
})
export class AiReportingModule { }