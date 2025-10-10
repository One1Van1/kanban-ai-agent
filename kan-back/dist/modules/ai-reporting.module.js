"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiReportingModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const search_tasks_service_1 = require("../features/jira-integration/search-tasks-correct/search-tasks.service");
const add_task_comment_service_1 = require("../features/jira-integration/add-task-comment/add-task-comment.service");
const move_task_service_1 = require("../features/jira-integration/move-task-correct/move-task.service");
const generate_report_controller_1 = require("../features/ai-reporting/generate-report/generate-report.controller");
const get_report_config_controller_1 = require("../features/ai-reporting/get-report-config/get-report-config.controller");
const get_report_health_controller_1 = require("../features/ai-reporting/get-report-health/get-report-health.controller");
const process_report_task_controller_1 = require("../features/ai-reporting/process-report-task/process-report-task.controller");
const generate_report_service_1 = require("../features/ai-reporting/generate-report/generate-report.service");
const get_report_config_service_1 = require("../features/ai-reporting/get-report-config/get-report-config.service");
const get_report_health_service_1 = require("../features/ai-reporting/get-report-health/get-report-health.service");
const process_report_task_service_1 = require("../features/ai-reporting/process-report-task/process-report-task.service");
let AiReportingModule = class AiReportingModule {
};
exports.AiReportingModule = AiReportingModule;
exports.AiReportingModule = AiReportingModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        controllers: [
            generate_report_controller_1.GenerateReportController,
            get_report_config_controller_1.GetReportConfigController,
            get_report_health_controller_1.GetReportHealthController,
            process_report_task_controller_1.ProcessReportTaskController,
        ],
        providers: [
            generate_report_service_1.GenerateReportService,
            get_report_config_service_1.GetReportConfigService,
            get_report_health_service_1.GetReportHealthService,
            process_report_task_service_1.ProcessReportTaskService,
            search_tasks_service_1.SearchTasksService,
            add_task_comment_service_1.AddTaskCommentService,
            move_task_service_1.MoveTaskService,
        ],
        exports: [
            generate_report_service_1.GenerateReportService,
            get_report_config_service_1.GetReportConfigService,
            get_report_health_service_1.GetReportHealthService,
            process_report_task_service_1.ProcessReportTaskService,
            search_tasks_service_1.SearchTasksService,
            add_task_comment_service_1.AddTaskCommentService,
            move_task_service_1.MoveTaskService,
        ],
    })
], AiReportingModule);
//# sourceMappingURL=ai-reporting.module.js.map