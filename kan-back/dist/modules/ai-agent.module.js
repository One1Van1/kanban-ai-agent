"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiAgentModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const config_2 = require("../config");
const agent_entity_1 = require("../entities/agent.entity");
const agent_instruction_entity_1 = require("../entities/agent-instruction.entity");
const task_history_entity_1 = require("../entities/task-history.entity");
const notifications_module_1 = require("./notifications.module");
const configure_agent_controller_1 = require("../features/ai-agent/configure-agent/configure-agent.controller");
const configure_column_instructions_controller_1 = require("../features/ai-agent/configure-column-instructions/configure-column-instructions.controller");
const create_agent_controller_1 = require("../features/ai-agent/create-agent/create-agent.controller");
const execute_agent_action_controller_1 = require("../features/ai-agent/execute-agent-action/execute-agent-action.controller");
const get_agent_activity_controller_1 = require("../features/ai-agent/get-agent-activity/get-agent-activity.controller");
const agent_learning_controller_1 = require("../features/ai-agent/agent-learning/agent-learning.controller");
const agent_role_controller_1 = require("../features/ai-agent/agent-role/agent-role.controller");
const configure_agent_service_1 = require("../features/ai-agent/configure-agent/configure-agent.service");
const configure_column_instructions_service_1 = require("../features/ai-agent/configure-column-instructions/configure-column-instructions.service");
const create_agent_service_1 = require("../features/ai-agent/create-agent/create-agent.service");
const execute_agent_action_service_1 = require("../features/ai-agent/execute-agent-action/execute-agent-action.service");
const get_agent_activity_service_1 = require("../features/ai-agent/get-agent-activity/get-agent-activity.service");
const instruction_executor_service_1 = require("../features/ai-agent/instruction-executor/instruction-executor.service");
const intelligent_agent_service_1 = require("../features/ai-agent/intelligent-agent/intelligent-agent.service");
const kanban_knowledge_base_service_1 = require("../features/ai-agent/kanban-knowledge-base/kanban-knowledge-base.service");
const agent_learning_service_1 = require("../features/ai-agent/agent-learning/agent-learning.service");
const agent_role_service_1 = require("../features/ai-agent/agent-role/agent-role.service");
const track_agent_in_task_controller_1 = require("../features/kanban-management/POST/track-agent-in-task/track-agent-in-task.controller");
const track_agent_in_task_service_1 = require("../features/kanban-management/POST/track-agent-in-task/track-agent-in-task.service");
let AiAgentModule = class AiAgentModule {
};
exports.AiAgentModule = AiAgentModule;
exports.AiAgentModule = AiAgentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forFeature(config_2.aiAgentConfig),
            config_1.ConfigModule.forFeature(config_2.claudeConfig),
            typeorm_1.TypeOrmModule.forFeature([agent_entity_1.Agent, agent_instruction_entity_1.AgentInstruction, task_history_entity_1.TaskHistory]),
            notifications_module_1.NotificationsModule,
        ],
        controllers: [
            configure_agent_controller_1.ConfigureAgentController,
            configure_column_instructions_controller_1.ConfigureColumnInstructionsController,
            create_agent_controller_1.CreateAgentController,
            execute_agent_action_controller_1.ExecuteAgentActionController,
            get_agent_activity_controller_1.GetAgentActivityController,
            track_agent_in_task_controller_1.TrackAgentInTaskController,
            agent_learning_controller_1.AgentLearningController,
            agent_role_controller_1.AgentRoleController,
        ],
        providers: [
            configure_agent_service_1.ConfigureAgentService,
            configure_column_instructions_service_1.ConfigureColumnInstructionsService,
            create_agent_service_1.CreateAgentService,
            execute_agent_action_service_1.ExecuteAgentActionService,
            get_agent_activity_service_1.GetAgentActivityService,
            track_agent_in_task_service_1.TrackAgentInTaskService,
            instruction_executor_service_1.InstructionExecutorService,
            intelligent_agent_service_1.IntelligentAgentService,
            kanban_knowledge_base_service_1.KanbanKnowledgeBaseService,
            agent_learning_service_1.AgentLearningService,
            agent_role_service_1.AgentRoleService,
        ],
        exports: [
            configure_agent_service_1.ConfigureAgentService,
            configure_column_instructions_service_1.ConfigureColumnInstructionsService,
            create_agent_service_1.CreateAgentService,
            execute_agent_action_service_1.ExecuteAgentActionService,
            get_agent_activity_service_1.GetAgentActivityService,
            track_agent_in_task_service_1.TrackAgentInTaskService,
            instruction_executor_service_1.InstructionExecutorService,
            intelligent_agent_service_1.IntelligentAgentService,
            kanban_knowledge_base_service_1.KanbanKnowledgeBaseService,
            agent_learning_service_1.AgentLearningService,
            agent_role_service_1.AgentRoleService,
        ],
    })
], AiAgentModule);
//# sourceMappingURL=ai-agent.module.js.map