"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextManagementModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const configure_context_sources_controller_1 = require("../features/context-management/configure-context-sources/configure-context-sources.controller");
const fetch_task_context_controller_1 = require("../features/context-management/fetch-task-context/fetch-task-context.controller");
const fetch_related_tasks_controller_1 = require("../features/context-management/fetch-related-tasks/fetch-related-tasks.controller");
const fetch_external_context_controller_1 = require("../features/context-management/fetch-external-context/fetch-external-context.controller");
const configure_context_sources_service_1 = require("../features/context-management/configure-context-sources/configure-context-sources.service");
const fetch_task_context_service_1 = require("../features/context-management/fetch-task-context/fetch-task-context.service");
const fetch_related_tasks_service_1 = require("../features/context-management/fetch-related-tasks/fetch-related-tasks.service");
const fetch_external_context_service_1 = require("../features/context-management/fetch-external-context/fetch-external-context.service");
let ContextManagementModule = class ContextManagementModule {
};
exports.ContextManagementModule = ContextManagementModule;
exports.ContextManagementModule = ContextManagementModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        controllers: [
            configure_context_sources_controller_1.ConfigureContextSourcesController,
            fetch_task_context_controller_1.FetchTaskContextController,
            fetch_related_tasks_controller_1.FetchRelatedTasksController,
            fetch_external_context_controller_1.FetchExternalContextController,
        ],
        providers: [
            configure_context_sources_service_1.ConfigureContextSourcesService,
            fetch_task_context_service_1.FetchTaskContextService,
            fetch_related_tasks_service_1.FetchRelatedTasksService,
            fetch_external_context_service_1.FetchExternalContextService,
        ],
        exports: [
            configure_context_sources_service_1.ConfigureContextSourcesService,
            fetch_task_context_service_1.FetchTaskContextService,
            fetch_related_tasks_service_1.FetchRelatedTasksService,
            fetch_external_context_service_1.FetchExternalContextService,
        ],
    })
], ContextManagementModule);
//# sourceMappingURL=context-management.module.js.map