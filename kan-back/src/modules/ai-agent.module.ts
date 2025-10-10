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

// 🧠 Новые контроллеры для интеллектуальных функций
import { AgentLearningController } from '../features/ai-agent/agent-learning/agent-learning.controller';
import { AgentRoleController } from '../features/ai-agent/agent-role/agent-role.controller';

// Services
import { ConfigureAgentService } from '../features/ai-agent/configure-agent/configure-agent.service';
import { ConfigureColumnInstructionsService } from '../features/ai-agent/configure-column-instructions/configure-column-instructions.service';
import { CreateAgentService } from '../features/ai-agent/create-agent/create-agent.service';
import { ExecuteAgentActionService } from '../features/ai-agent/execute-agent-action/execute-agent-action.service';
import { GetAgentActivityService } from '../features/ai-agent/get-agent-activity/get-agent-activity.service';

import { InstructionExecutorService } from '../features/ai-agent/instruction-executor/instruction-executor.service';

// 🧠 Новые интеллектуальные сервисы
import { IntelligentAgentService } from '../features/ai-agent/intelligent-agent/intelligent-agent.service';
import { KanbanKnowledgeBaseService } from '../features/ai-agent/kanban-knowledge-base/kanban-knowledge-base.service';
import { AgentLearningService } from '../features/ai-agent/agent-learning/agent-learning.service';
import { AgentRoleService } from '../features/ai-agent/agent-role/agent-role.service';
import { TrackAgentInTaskController } from 'kan-back/src/features/kanban-management/POST/track-agent-in-task/track-agent-in-task.controller';
import { TrackAgentInTaskService } from 'kan-back/src/features/kanban-management/POST/track-agent-in-task/track-agent-in-task.service';

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
    InstructionExecutorService,
    // 🧠 Экспортируем новые сервисы для использования в других модулях
    IntelligentAgentService,
    KanbanKnowledgeBaseService,
    AgentLearningService,
    AgentRoleService,
  ],
})
export class AiAgentModule {}
