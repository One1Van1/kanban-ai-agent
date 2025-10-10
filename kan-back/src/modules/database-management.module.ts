import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from '../entities/agent.entity';
import { AgentInstruction } from '../entities/agent-instruction.entity';
import { TaskHistory } from '../entities/task-history.entity';
import { NotificationLog } from '../entities/notification-log.entity';

// Store Agent Config
import { StoreAgentConfigController } from '../features/database-management/store-agent-config/store-agent-config.controller';
import { StoreAgentConfigService } from '../features/database-management/store-agent-config/store-agent-config.service';

// Store Task History
import { StoreTaskHistoryController } from 'kan-back/src/features/kanban-management/POST/store-task-history/store-task-history.controller';
import { StoreTaskHistoryService } from 'kan-back/src/features/kanban-management/POST/store-task-history/store-task-history.service';

// Get Agent Task History
import { GetAgentTaskHistoryController } from 'kan-back/src/features/kanban-management/GET/get-agent-task-history/get-agent-task-history.controller';
import { GetAgentTaskHistoryService } from 'kan-back/src/features/kanban-management/GET/get-agent-task-history/get-agent-task-history.service';

// Get Task History
import { GetTaskHistoryController } from 'kan-back/src/features/kanban-management/GET/get-task-history/get-task-history.controller';
import { GetTaskHistoryService } from 'kan-back/src/features/kanban-management/GET/get-task-history/get-task-history.service';

// Get Task Statistics
import { GetTaskStatisticsService } from 'kan-back/src/features/kanban-management/GET/get-task-statistics/get-task-statistics.service';
import { GetTaskStatisticsController } from 'kan-back/src/features/kanban-management/GET/get-task-statistics/get-task-statistics.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Agent,
      AgentInstruction,
      TaskHistory,
      NotificationLog,
    ]),
  ],
  controllers: [
    StoreAgentConfigController,
    StoreTaskHistoryController,
    GetAgentTaskHistoryController,
    GetTaskHistoryController,
    GetTaskStatisticsController,
  ],
  providers: [
    StoreAgentConfigService,
    StoreTaskHistoryService,
    GetAgentTaskHistoryService,
    GetTaskHistoryService,
    GetTaskStatisticsService,
  ],
  exports: [StoreAgentConfigService, StoreTaskHistoryService, TypeOrmModule],
})
export class DatabaseManagementModule {}
