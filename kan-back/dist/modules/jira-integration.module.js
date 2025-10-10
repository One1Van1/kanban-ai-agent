"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiraIntegrationModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const agent_entity_1 = require("../entities/agent.entity");
const agent_instruction_entity_1 = require("../entities/agent-instruction.entity");
const add_task_comment_controller_1 = require("../features/jira-integration/add-task-comment/add-task-comment.controller");
const attach_file_controller_1 = require("../features/jira-integration/attach-file-correct/attach-file.controller");
const get_column_tasks_controller_1 = require("../features/jira-integration/get-column-tasks-correct/get-column-tasks.controller");
const get_task_controller_1 = require("../features/jira-integration/get-task-correct/get-task.controller");
const get_task_transitions_controller_1 = require("../features/jira-integration/get-task-transitions-correct/get-task-transitions.controller");
const health_check_controller_1 = require("../features/jira-integration/health-check-correct/health-check.controller");
const jira_webhook_handler_controller_1 = require("../features/jira-integration/jira-webhook-handler-correct/jira-webhook-handler.controller");
const move_task_controller_1 = require("../features/jira-integration/move-task-correct/move-task.controller");
const process_webhook_before_after_controller_1 = require("../features/jira-integration/process-webhook-before-after/process-webhook-before-after.controller");
const search_tasks_controller_1 = require("../features/jira-integration/search-tasks-correct/search-tasks.controller");
const time_validation_webhook_controller_1 = require("../features/jira-integration/time-validation-webhook-correct/time-validation-webhook.controller");
const add_task_comment_service_1 = require("../features/jira-integration/add-task-comment/add-task-comment.service");
const attach_file_service_1 = require("../features/jira-integration/attach-file-correct/attach-file.service");
const get_column_tasks_service_1 = require("../features/jira-integration/get-column-tasks-correct/get-column-tasks.service");
const get_task_service_1 = require("../features/jira-integration/get-task-correct/get-task.service");
const get_task_transitions_service_1 = require("../features/jira-integration/get-task-transitions-correct/get-task-transitions.service");
const health_check_service_1 = require("../features/jira-integration/health-check-correct/health-check.service");
const jira_webhook_handler_service_1 = require("../features/jira-integration/jira-webhook-handler-correct/jira-webhook-handler.service");
const move_task_service_1 = require("../features/jira-integration/move-task-correct/move-task.service");
const process_webhook_before_after_service_1 = require("../features/jira-integration/process-webhook-before-after/process-webhook-before-after.service");
const search_tasks_service_1 = require("../features/jira-integration/search-tasks-correct/search-tasks.service");
const time_validation_webhook_service_1 = require("../features/jira-integration/time-validation-webhook-correct/time-validation-webhook.service");
let JiraIntegrationModule = class JiraIntegrationModule {
};
exports.JiraIntegrationModule = JiraIntegrationModule;
exports.JiraIntegrationModule = JiraIntegrationModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule, typeorm_1.TypeOrmModule.forFeature([agent_entity_1.Agent, agent_instruction_entity_1.AgentInstruction])],
        controllers: [
            add_task_comment_controller_1.AddTaskCommentController,
            attach_file_controller_1.AttachFileController,
            get_column_tasks_controller_1.GetColumnTasksController,
            get_task_controller_1.GetTaskController,
            get_task_transitions_controller_1.GetTaskTransitionsController,
            health_check_controller_1.HealthCheckController,
            jira_webhook_handler_controller_1.JiraWebhookHandlerController,
            move_task_controller_1.MoveTaskController,
            process_webhook_before_after_controller_1.ProcessWebhookBeforeAfterController,
            search_tasks_controller_1.SearchTasksController,
            time_validation_webhook_controller_1.TimeValidationWebhookController,
        ],
        providers: [
            add_task_comment_service_1.AddTaskCommentService,
            attach_file_service_1.AttachFileService,
            get_column_tasks_service_1.GetColumnTasksService,
            get_task_service_1.GetTaskService,
            get_task_transitions_service_1.GetTaskTransitionsService,
            health_check_service_1.HealthCheckService,
            jira_webhook_handler_service_1.JiraWebhookHandlerService,
            move_task_service_1.MoveTaskService,
            process_webhook_before_after_service_1.ProcessWebhookBeforeAfterService,
            search_tasks_service_1.SearchTasksService,
            time_validation_webhook_service_1.TimeValidationWebhookService,
        ],
        exports: [
            add_task_comment_service_1.AddTaskCommentService,
            attach_file_service_1.AttachFileService,
            get_column_tasks_service_1.GetColumnTasksService,
            get_task_service_1.GetTaskService,
            get_task_transitions_service_1.GetTaskTransitionsService,
            health_check_service_1.HealthCheckService,
            jira_webhook_handler_service_1.JiraWebhookHandlerService,
            move_task_service_1.MoveTaskService,
            process_webhook_before_after_service_1.ProcessWebhookBeforeAfterService,
            search_tasks_service_1.SearchTasksService,
            time_validation_webhook_service_1.TimeValidationWebhookService,
        ],
    })
], JiraIntegrationModule);
//# sourceMappingURL=jira-integration.module.js.map