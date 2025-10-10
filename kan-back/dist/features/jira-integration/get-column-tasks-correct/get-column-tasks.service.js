"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetColumnTasksService = void 0;
const common_1 = require("@nestjs/common");
const jira_base_service_1 = require("../../../shared/jira/jira-base.service");
const get_column_tasks_response_dto_1 = require("./get-column-tasks.response.dto");
let GetColumnTasksService = class GetColumnTasksService extends jira_base_service_1.JiraBaseService {
    async execute(requestDto) {
        try {
            let jql = `status = "${requestDto.columnStatus}"`;
            if (requestDto.assignee) {
                jql += ` AND assignee = "${requestDto.assignee}"`;
            }
            if (requestDto.priority) {
                jql += ` AND priority = "${requestDto.priority}"`;
            }
            const result = await this.searchTasks(jql, 0, requestDto.maxResults ? parseInt(requestDto.maxResults.toString()) : 50);
            return new get_column_tasks_response_dto_1.GetColumnTasksResponseDto(result.issues, requestDto.columnStatus, result.total);
        }
        catch (error) {
            this.logger.error(`Failed to get tasks for column status: ${requestDto.columnStatus}`, error.stack);
            throw error;
        }
    }
};
exports.GetColumnTasksService = GetColumnTasksService;
exports.GetColumnTasksService = GetColumnTasksService = __decorate([
    (0, common_1.Injectable)()
], GetColumnTasksService);
//# sourceMappingURL=get-column-tasks.service.js.map