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
import { StoreTaskHistoryController } from '../features/database-management/store-task-history/store-task-history.controller';
import { StoreTaskHistoryService } from '../features/database-management/store-task-history/store-task-history.service';

// Get Agent Task History
import { GetAgentTaskHistoryController } from '../features/database-management/get-agent-task-history/get-agent-task-history.controller';
import { GetAgentTaskHistoryService } from '../features/database-management/get-agent-task-history/get-agent-task-history.service';

// Get Task History
import { GetTaskHistoryController } from '../features/database-management/get-task-history/get-task-history.controller';
import { GetTaskHistoryService } from '../features/database-management/get-task-history/get-task-history.service';

// Get Task Statistics
import { GetTaskStatisticsController } from '../features/database-management/get-task-statistics/get-task-statistics.controller';
import { GetTaskStatisticsService } from '../features/database-management/get-task-statistics/get-task-statistics.service';

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
