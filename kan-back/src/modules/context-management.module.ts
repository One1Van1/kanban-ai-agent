import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Controllers
import { ConfigureContextSourcesController } from '../features/context-management/configure-context-sources/configure-context-sources.controller';
import { FetchTaskContextController } from '../features/context-management/fetch-task-context/fetch-task-context.controller';
import { FetchRelatedTasksController } from '../features/context-management/fetch-related-tasks/fetch-related-tasks.controller';
import { FetchExternalContextController } from '../features/context-management/fetch-external-context/fetch-external-context.controller';

// Services
import { ConfigureContextSourcesService } from '../features/context-management/configure-context-sources/configure-context-sources.service';
import { FetchTaskContextService } from '../features/context-management/fetch-task-context/fetch-task-context.service';
import { FetchRelatedTasksService } from '../features/context-management/fetch-related-tasks/fetch-related-tasks.service';
import { FetchExternalContextService } from '../features/context-management/fetch-external-context/fetch-external-context.service';

@Module({
  imports: [ConfigModule],
  controllers: [
    ConfigureContextSourcesController,
    FetchTaskContextController,
    FetchRelatedTasksController,
    FetchExternalContextController,
  ],
  providers: [
    ConfigureContextSourcesService,
    FetchTaskContextService,
    FetchRelatedTasksService,
    FetchExternalContextService,
  ],
  exports: [
    ConfigureContextSourcesService,
    FetchTaskContextService,
    FetchRelatedTasksService,
    FetchExternalContextService,
  ],
})
export class ContextManagementModule {}
