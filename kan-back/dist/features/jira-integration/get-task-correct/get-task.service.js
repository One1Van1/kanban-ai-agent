"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTaskService = void 0;
const common_1 = require("@nestjs/common");
const jira_base_service_1 = require("../../../shared/jira/jira-base.service");
const get_task_response_dto_1 = require("./get-task.response.dto");
let GetTaskService = class GetTaskService extends jira_base_service_1.JiraBaseService {
    async execute(taskKey) {
        const task = await this.getTask(taskKey);
        return new get_task_response_dto_1.GetTaskResponseDto(task);
    }
};
exports.GetTaskService = GetTaskService;
exports.GetTaskService = GetTaskService = __decorate([
    (0, common_1.Injectable)()
], GetTaskService);
//# sourceMappingURL=get-task.service.js.map