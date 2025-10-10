"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchRelatedTasksResponseDto = exports.RelatedTasksStatsDto = exports.RelatedTaskDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const fetch_related_tasks_query_dto_1 = require("./fetch-related-tasks.query.dto");
class RelatedTaskDto {
    id;
    key;
    title;
    status;
    priority;
    assignee;
    relationshipType;
    createdAt;
    updatedAt;
}
exports.RelatedTaskDto = RelatedTaskDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Уникальный идентификатор связанной задачи',
        example: 'related-task-1',
    }),
    __metadata("design:type", String)
], RelatedTaskDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ключ задачи в системе управления проектами',
        example: 'TASK-1001',
    }),
    __metadata("design:type", String)
], RelatedTaskDto.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Название связанной задачи',
        example: 'Связанная задача 1 для task-uuid-123',
    }),
    __metadata("design:type", String)
], RelatedTaskDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Текущий статус задачи',
        example: 'In Progress',
    }),
    __metadata("design:type", String)
], RelatedTaskDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Приоритет задачи',
        example: 'High',
    }),
    __metadata("design:type", String)
], RelatedTaskDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Исполнитель задачи',
        example: 'user-1@example.com',
    }),
    __metadata("design:type", String)
], RelatedTaskDto.prototype, "assignee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: fetch_related_tasks_query_dto_1.RelationshipType,
        enumName: 'RelationshipType',
        example: fetch_related_tasks_query_dto_1.RelationshipType.RELATED_TO,
        description: 'Тип связи с основной задачей',
    }),
    __metadata("design:type", String)
], RelatedTaskDto.prototype, "relationshipType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Дата создания задачи',
        example: '2025-10-01T14:30:00Z',
    }),
    __metadata("design:type", String)
], RelatedTaskDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Дата последнего обновления задачи',
        example: '2025-10-05T14:30:00Z',
    }),
    __metadata("design:type", String)
], RelatedTaskDto.prototype, "updatedAt", void 0);
class RelatedTasksStatsDto {
    totalFound;
    returned;
    relationshipTypeDistribution;
}
exports.RelatedTasksStatsDto = RelatedTasksStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Общее количество найденных связанных задач',
        example: 7,
    }),
    __metadata("design:type", Number)
], RelatedTasksStatsDto.prototype, "totalFound", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Количество возвращенных задач (с учетом лимита)',
        example: 5,
    }),
    __metadata("design:type", Number)
], RelatedTasksStatsDto.prototype, "returned", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Распределение по типам связей',
        example: {
            related_to: 3,
            blocks: 1,
            subtask: 1,
            parent: 1,
        },
    }),
    __metadata("design:type", Object)
], RelatedTasksStatsDto.prototype, "relationshipTypeDistribution", void 0);
class FetchRelatedTasksResponseDto {
    success;
    taskId;
    relatedTasks;
    searchParams;
    stats;
    message;
    timestamp;
    constructor(success, taskId, relatedTasks, searchParams, message) {
        this.success = success;
        this.taskId = taskId;
        this.relatedTasks = relatedTasks;
        this.searchParams = searchParams;
        this.message = message;
        this.timestamp = new Date().toISOString();
        this.stats = {
            totalFound: relatedTasks.length,
            returned: relatedTasks.length,
            relationshipTypeDistribution: this.calculateDistribution(relatedTasks),
        };
    }
    calculateDistribution(tasks) {
        const distribution = {};
        tasks.forEach((task) => {
            const type = task.relationshipType;
            distribution[type] = (distribution[type] || 0) + 1;
        });
        return distribution;
    }
}
exports.FetchRelatedTasksResponseDto = FetchRelatedTasksResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Статус успешности операции',
        example: true,
    }),
    __metadata("design:type", Boolean)
], FetchRelatedTasksResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Идентификатор основной задачи',
        example: 'task-uuid-123',
    }),
    __metadata("design:type", String)
], FetchRelatedTasksResponseDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Список связанных задач',
        type: [RelatedTaskDto],
    }),
    __metadata("design:type", Array)
], FetchRelatedTasksResponseDto.prototype, "relatedTasks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Параметры запроса, использованные для поиска',
        type: fetch_related_tasks_query_dto_1.FetchRelatedTasksQueryDto,
    }),
    __metadata("design:type", fetch_related_tasks_query_dto_1.FetchRelatedTasksQueryDto)
], FetchRelatedTasksResponseDto.prototype, "searchParams", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Статистика по найденным связанным задачам',
        type: RelatedTasksStatsDto,
    }),
    __metadata("design:type", RelatedTasksStatsDto)
], FetchRelatedTasksResponseDto.prototype, "stats", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Сообщение о результате операции',
        example: 'Найдено 7 связанных задач',
    }),
    __metadata("design:type", String)
], FetchRelatedTasksResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Время выполнения запроса',
        example: '2025-10-05T14:30:00Z',
    }),
    __metadata("design:type", String)
], FetchRelatedTasksResponseDto.prototype, "timestamp", void 0);
//# sourceMappingURL=fetch-related-tasks.response.dto.js.map