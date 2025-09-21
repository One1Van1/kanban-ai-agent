import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

// Существующие модули (НЕ ИЗМЕНЯЕМ)
import { WebhookModule } from './webhook';
import { AIAnalysisModule } from './ai-analysis';
import { KanbanModule } from './kanban';
import { TaskExecutorModule } from './task-executor/task-executor.module';

// Новые модули Enhanced Workflow
import { EnhancedWorkflowModule } from './enhanced-workflow/enhanced-workflow.module';
import { StatusTransitionsModule } from './status-transitions/status-transitions.module';
import { WorkflowOrchestratorModule } from './workflow-orchestrator/workflow-orchestrator.module';

// Конфигурации
import appConfig from './config/app.config';
import jiraConfig from './config/jira.config';
import claudeConfig from './config/claude.config';

/**
 * Новый модуль для Enhanced Workflow
 * Работает ПАРАЛЛЕЛЬНО с существующим AppModule
 * НЕ ЗАМЕНЯЕТ существующую функциональность
 */
@Module({
  imports: [
    // Конфигурация
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jiraConfig, claudeConfig],
    }),
    HttpModule,

    // Существующие модули (импортируем, но НЕ изменяем)
    WebhookModule,
    AIAnalysisModule,
    KanbanModule,
    TaskExecutorModule,

    // Новые модули Enhanced Workflow
    StatusTransitionsModule,
    WorkflowOrchestratorModule,
    EnhancedWorkflowModule,
  ],
})
export class EnhancedAppModule {}
