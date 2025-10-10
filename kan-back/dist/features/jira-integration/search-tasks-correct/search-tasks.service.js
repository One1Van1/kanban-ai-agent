"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchTasksService = void 0;
const common_1 = require("@nestjs/common");
const jira_base_service_1 = require("../../../shared/jira/jira-base.service");
const search_tasks_response_dto_1 = require("./search-tasks.response.dto");
let SearchTasksService = class SearchTasksService extends jira_base_service_1.JiraBaseService {
    async execute(requestDto) {
        try {
            const result = await this.searchTasks(requestDto.jql, requestDto.startAt || 0, requestDto.maxResults || 20);
            return new search_tasks_response_dto_1.SearchTasksResponseDto(result.issues, result.total, result.startAt, result.maxResults);
        }
        catch (error) {
            this.logger.error(`Failed to search tasks with JQL: ${requestDto.jql}`, error.stack);
            throw error;
        }
    }
};
exports.SearchTasksService = SearchTasksService;
exports.SearchTasksService = SearchTasksService = __decorate([
    (0, common_1.Injectable)()
], SearchTasksService);
//# sourceMappingURL=search-tasks.service.js.map