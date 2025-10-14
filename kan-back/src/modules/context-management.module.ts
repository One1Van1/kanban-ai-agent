import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Controllers
import { ConfigureContextSourcesController } from '../features/context-management/configure-context-sources/configure-context-sources.controller';
import { FetchTaskContextController } from '../features/context-management/fetch-task-context/fetch-task-context.controller';
import { FetchRelatedTasksController } from '../features/context-management/fetch-related-tasks/fetch-related-tasks.controller';
import { FetchExternalContextController } from '../features/context-management/fetch-external-context/fetch-external-context.controller';
import { GetFlowVariablesController } from '../features/context-management/get-flow-variables/get-flow-variables.controller';
import { SetFlowVariablesController } from '../features/context-management/set-flow-variables/set-flow-variables.controller';

// Services
import { ConfigureContextSourcesService } from '../features/context-management/configure-context-sources/configure-context-sources.service';
import { FetchTaskContextService } from '../features/context-management/fetch-task-context/fetch-task-context.service';
import { FetchRelatedTasksService } from '../features/context-management/fetch-related-tasks/fetch-related-tasks.service';
import { FetchExternalContextService } from '../features/context-management/fetch-external-context/fetch-external-context.service';
import { GetFlowVariablesService } from '../features/context-management/get-flow-variables/get-flow-variables.service';
import { SetFlowVariablesService } from '../features/context-management/set-flow-variables/set-flow-variables.service';

@Module({
  imports: [ConfigModule],
  controllers: [
    ConfigureContextSourcesController,
    FetchTaskContextController,
    FetchRelatedTasksController,
    FetchExternalContextController,
    GetFlowVariablesController, // 📊 Получение переменных Flow
    SetFlowVariablesController, // ✏️ Установка переменных Flow
  ],
  providers: [
    ConfigureContextSourcesService,
    FetchTaskContextService,
    FetchRelatedTasksService,
    FetchExternalContextService,
    GetFlowVariablesService, // 📊 Сервис работы с переменными Flow
    SetFlowVariablesService, // ✏️ Сервис установки переменных Flow
  ],
  exports: [
    ConfigureContextSourcesService,
    FetchTaskContextService,
    FetchRelatedTasksService,
    FetchExternalContextService,
    GetFlowVariablesService, // 📊 Экспорт сервиса переменных
    SetFlowVariablesService, // ✏️ Экспорт сервиса установки переменных
  ],
})
export class ContextManagementModule {}
