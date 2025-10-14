import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { aiAgentConfig, claudeConfig } from '../config';
import { Agent } from '../entities/agent.entity';
import { AgentInstruction } from '../entities/agent-instruction.entity';
import { TaskHistory } from '../entities/task-history.entity';

// Import notifications module for Telegram service
import { NotificationsModule } from './notifications.module';

// Controllers
import { ConfigureAgentController } from '../features/ai-agent/configure-agent/configure-agent.controller';
import { ConfigureColumnInstructionsController } from '../features/ai-agent/configure-column-instructions/configure-column-instructions.controller';
import { CreateAgentController } from '../features/ai-agent/create-agent/create-agent.controller';
import { ExecuteAgentActionController } from '../features/ai-agent/execute-agent-action/execute-agent-action.controller';
import { GetAgentActivityController } from '../features/ai-agent/get-agent-activity/get-agent-activity.controller';
import { ExecuteFlowController } from '../features/ai-agent/execute-flow/execute-flow.controller';
import { GetAvailableModelsController } from '../features/ai-agent/get-available-models/get-available-models.controller';
import { GetFlowExecutionStatusController } from '../features/ai-agent/get-flow-execution-status/get-flow-execution-status.controller';
import { PauseFlowExecutionController } from '../features/ai-agent/pause-flow-execution/pause-flow-execution.controller';
import { ResumeFlowExecutionController } from '../features/ai-agent/resume-flow-execution/resume-flow-execution.controller';
import { CancelFlowExecutionController } from '../features/ai-agent/cancel-flow-execution/cancel-flow-execution.controller';

// New Agent Retrieval Controllers
import { GetAllAgentsController } from '../features/ai-agent/get-all-agents/get-all-agents.controller';
import { GetAgentByIdController } from '../features/ai-agent/get-agent-by-id/get-agent-by-id.controller';
import { GetAgentsByBoardTypeController } from '../features/ai-agent/get-agents-by-board-type/get-agents-by-board-type.controller';

// 🧠 Новые контроллеры для интеллектуальных функций
import { AgentLearningController } from '../features/ai-agent/agent-learning/agent-learning.controller';
import { AgentRoleController } from '../features/ai-agent/agent-role/agent-role.controller';

// Services
import { ConfigureAgentService } from '../features/ai-agent/configure-agent/configure-agent.service';
import { ConfigureColumnInstructionsService } from '../features/ai-agent/configure-column-instructions/configure-column-instructions.service';
import { CreateAgentService } from '../features/ai-agent/create-agent/create-agent.service';
import { ExecuteAgentActionService } from '../features/ai-agent/execute-agent-action/execute-agent-action.service';
import { GetAgentActivityService } from '../features/ai-agent/get-agent-activity/get-agent-activity.service';
import { ExecuteFlowService } from '../features/ai-agent/execute-flow/execute-flow.service';
import { GetAvailableModelsService } from '../features/ai-agent/get-available-models/get-available-models.service';
import { GetFlowExecutionStatusService } from '../features/ai-agent/get-flow-execution-status/get-flow-execution-status.service';
import { PauseFlowExecutionService } from '../features/ai-agent/pause-flow-execution/pause-flow-execution.service';
import { ResumeFlowExecutionService } from '../features/ai-agent/resume-flow-execution/resume-flow-execution.service';
import { CancelFlowExecutionService } from '../features/ai-agent/cancel-flow-execution/cancel-flow-execution.service';

// New Agent Retrieval Services
import { GetAllAgentsService } from '../features/ai-agent/get-all-agents/get-all-agents.service';
import { GetAgentByIdService } from '../features/ai-agent/get-agent-by-id/get-agent-by-id.service';
import { GetAgentsByBoardTypeService } from '../features/ai-agent/get-agents-by-board-type/get-agents-by-board-type.service';

import { InstructionExecutorService } from '../features/ai-agent/instruction-executor/instruction-executor.service';

// 🧠 Новые интеллектуальные сервисы
import { IntelligentAgentService } from '../features/ai-agent/intelligent-agent/intelligent-agent.service';
import { KanbanKnowledgeBaseService } from '../features/ai-agent/kanban-knowledge-base/kanban-knowledge-base.service';
import { AgentLearningService } from '../features/ai-agent/agent-learning/agent-learning.service';
import { AgentRoleService } from '../features/ai-agent/agent-role/agent-role.service';
import { TrackAgentInTaskController } from '../features/kanban-management/POST/track-agent-in-task/track-agent-in-task.controller';
import { TrackAgentInTaskService } from '../features/kanban-management/POST/track-agent-in-task/track-agent-in-task.service';

@Module({
  imports: [
    ConfigModule.forFeature(aiAgentConfig),
    ConfigModule.forFeature(claudeConfig), // Claude AI config
    TypeOrmModule.forFeature([Agent, AgentInstruction, TaskHistory]), // Добавили TaskHistory для learning
    NotificationsModule, // For Telegram service
  ],
  controllers: [
    ConfigureAgentController,
    ConfigureColumnInstructionsController,
    CreateAgentController,
    ExecuteAgentActionController,
    GetAgentActivityController,
    TrackAgentInTaskController,
    ExecuteFlowController, // 🚀 Новый Flow Execution Controller
    GetAvailableModelsController, // 🤖 Получение доступных AI моделей
    GetFlowExecutionStatusController, // 📊 Мониторинг статуса выполнения Flow
    PauseFlowExecutionController, // ⏸️ Приостановка выполнения Flow
    ResumeFlowExecutionController, // ▶️ Возобновление выполнения Flow
    CancelFlowExecutionController, // ❌ Отмена выполнения Flow
    // New Agent Retrieval Controllers
    GetAllAgentsController,
    GetAgentByIdController,
    GetAgentsByBoardTypeController,
    // 🧠 Новые контроллеры для интеллектуальных функций
    AgentLearningController, // Обучение и метрики производительности
    AgentRoleController, // Управление ролями и специализацией
  ],
  providers: [
    ConfigureAgentService,
    ConfigureColumnInstructionsService,
    CreateAgentService,
    ExecuteAgentActionService,
    GetAgentActivityService,
    TrackAgentInTaskService,
    ExecuteFlowService, // 🚀 Новый Flow Execution Service
    GetAvailableModelsService, // 🤖 Сервис получения доступных AI моделей
    GetFlowExecutionStatusService, // 📊 Сервис мониторинга статуса Flow
    PauseFlowExecutionService, // ⏸️ Сервис приостановки выполнения Flow
    ResumeFlowExecutionService, // ▶️ Сервис возобновления выполнения Flow
    CancelFlowExecutionService, // ❌ Сервис отмены выполнения Flow
    // New Agent Retrieval Services
    GetAllAgentsService,
    GetAgentByIdService,
    GetAgentsByBoardTypeService,
    InstructionExecutorService, // 🚀 Enhanced AI-powered instruction executor
    // 🧠 Новые интеллектуальные сервисы
    IntelligentAgentService, // Многоуровневый анализ и принятие решений
    KanbanKnowledgeBaseService, // База знаний канбан-процессов
    AgentLearningService, // Система обучения и анализа производительности
    AgentRoleService, // Система ролей и специализации агентов
  ],
  exports: [
    ConfigureAgentService,
    ConfigureColumnInstructionsService,
    CreateAgentService,
    ExecuteAgentActionService,
    GetAgentActivityService,
    TrackAgentInTaskService,
    ExecuteFlowService, // 🚀 Экспорт Flow Execution Service
    GetAvailableModelsService, // 🤖 Экспорт сервиса доступных AI моделей
    GetFlowExecutionStatusService, // 📊 Экспорт сервиса мониторинга статуса
    PauseFlowExecutionService, // ⏸️ Экспорт сервиса приостановки Flow
    ResumeFlowExecutionService, // ▶️ Экспорт сервиса возобновления Flow
    CancelFlowExecutionService, // ❌ Экспорт сервиса отмены Flow
    InstructionExecutorService,
    // 🧠 Экспортируем новые сервисы для использования в других модулях
    IntelligentAgentService,
    KanbanKnowledgeBaseService,
    AgentLearningService,
    AgentRoleService,
  ],
})
export class AiAgentModule {}
