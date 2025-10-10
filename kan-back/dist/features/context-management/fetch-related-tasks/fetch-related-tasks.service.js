"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchRelatedTasksService = void 0;
const common_1 = require("@nestjs/common");
const fetch_related_tasks_query_dto_1 = require("./fetch-related-tasks.query.dto");
const fetch_related_tasks_response_dto_1 = require("./fetch-related-tasks.response.dto");
let FetchRelatedTasksService = class FetchRelatedTasksService {
    async execute(taskId, query) {
        const relatedTasks = this.generateMockRelatedTasks(taskId, query);
        return new fetch_related_tasks_response_dto_1.FetchRelatedTasksResponseDto(true, taskId, relatedTasks, query, `Найдено ${relatedTasks.length} связанных задач`);
    }
    generateMockRelatedTasks(taskId, query) {
        const tasks = [];
        const limit = query.limit || 10;
        for (let i = 1; i <= Math.min(limit, 5); i++) {
            tasks.push({
                id: `related-task-${i}`,
                key: `TASK-${1000 + i}`,
                title: `Связанная задача ${i} для ${taskId}`,
                status: i % 2 === 0 ? 'In Progress' : 'To Do',
                priority: i % 3 === 0 ? 'High' : i % 2 === 0 ? 'Medium' : 'Low',
                assignee: `user-${i}@example.com`,
                relationshipType: this.getRelationshipType(i, query.relationshipType),
                createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
            });
        }
        if (query.includeSubtasks) {
            tasks.push({
                id: `subtask-1`,
                key: 'SUBTASK-001',
                title: `Подзадача для ${taskId}`,
                status: 'To Do',
                priority: 'Medium',
                assignee: 'developer@example.com',
                relationshipType: fetch_related_tasks_query_dto_1.RelationshipType.SUBTASK,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
        }
        if (query.includeParents) {
            tasks.push({
                id: `parent-task-1`,
                key: 'PARENT-001',
                title: `Родительская задача для ${taskId}`,
                status: 'In Progress',
                priority: 'High',
                assignee: 'manager@example.com',
                relationshipType: fetch_related_tasks_query_dto_1.RelationshipType.PARENT,
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date().toISOString(),
            });
        }
        return tasks.slice(0, limit);
    }
    getRelationshipType(index, filterType) {
        if (filterType) {
            return filterType;
        }
        const types = [
            fetch_related_tasks_query_dto_1.RelationshipType.RELATED_TO,
            fetch_related_tasks_query_dto_1.RelationshipType.BLOCKS,
            fetch_related_tasks_query_dto_1.RelationshipType.BLOCKED_BY,
            fetch_related_tasks_query_dto_1.RelationshipType.DEPENDS_ON,
        ];
        return types[index % types.length];
    }
};
exports.FetchRelatedTasksService = FetchRelatedTasksService;
exports.FetchRelatedTasksService = FetchRelatedTasksService = __decorate([
    (0, common_1.Injectable)()
], FetchRelatedTasksService);
//# sourceMappingURL=fetch-related-tasks.service.js.map