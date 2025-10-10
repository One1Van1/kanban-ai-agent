"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseManagementModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const agent_entity_1 = require("../entities/agent.entity");
const agent_instruction_entity_1 = require("../entities/agent-instruction.entity");
const task_history_entity_1 = require("../entities/task-history.entity");
const notification_log_entity_1 = require("../entities/notification-log.entity");
const store_agent_config_controller_1 = require("../features/database-management/store-agent-config/store-agent-config.controller");
const store_agent_config_service_1 = require("../features/database-management/store-agent-config/store-agent-config.service");
const store_task_history_controller_1 = require("kan-back/src/features/kanban-management/POST/store-task-history/store-task-history.controller");
const store_task_history_service_1 = require("kan-back/src/features/kanban-management/POST/store-task-history/store-task-history.service");
const get_agent_task_history_controller_1 = require("kan-back/src/features/kanban-management/GET/get-agent-task-history/get-agent-task-history.controller");
const get_agent_task_history_service_1 = require("kan-back/src/features/kanban-management/GET/get-agent-task-history/get-agent-task-history.service");
const get_task_history_controller_1 = require("kan-back/src/features/kanban-management/GET/get-task-history/get-task-history.controller");
const get_task_history_service_1 = require("kan-back/src/features/kanban-management/GET/get-task-history/get-task-history.service");
const get_task_statistics_service_1 = require("kan-back/src/features/kanban-management/GET/get-task-statistics/get-task-statistics.service");
const get_task_statistics_controller_1 = require("kan-back/src/features/kanban-management/GET/get-task-statistics/get-task-statistics.controller");
let DatabaseManagementModule = class DatabaseManagementModule {
};
exports.DatabaseManagementModule = DatabaseManagementModule;
exports.DatabaseManagementModule = DatabaseManagementModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                agent_entity_1.Agent,
                agent_instruction_entity_1.AgentInstruction,
                task_history_entity_1.TaskHistory,
                notification_log_entity_1.NotificationLog,
            ]),
        ],
        controllers: [
            store_agent_config_controller_1.StoreAgentConfigController,
            store_task_history_controller_1.StoreTaskHistoryController,
            get_agent_task_history_controller_1.GetAgentTaskHistoryController,
            get_task_history_controller_1.GetTaskHistoryController,
            get_task_statistics_controller_1.GetTaskStatisticsController,
        ],
        providers: [
            store_agent_config_service_1.StoreAgentConfigService,
            store_task_history_service_1.StoreTaskHistoryService,
            get_agent_task_history_service_1.GetAgentTaskHistoryService,
            get_task_history_service_1.GetTaskHistoryService,
            get_task_statistics_service_1.GetTaskStatisticsService,
        ],
        exports: [store_agent_config_service_1.StoreAgentConfigService, store_task_history_service_1.StoreTaskHistoryService, typeorm_1.TypeOrmModule],
    })
], DatabaseManagementModule);
//# sourceMappingURL=database-management.module.js.map