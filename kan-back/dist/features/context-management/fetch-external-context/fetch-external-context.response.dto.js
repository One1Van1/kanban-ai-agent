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
exports.FetchExternalContextResponseDto = exports.ExternalContextStatsDto = exports.ExternalSourceContextDto = exports.ExternalContextItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const fetch_external_context_query_dto_1 = require("./fetch-external-context.query.dto");
class ExternalContextItemDto {
    id;
    title;
    content;
    url;
    author;
    createdAt;
    relevanceScore;
    metadata;
}
exports.ExternalContextItemDto = ExternalContextItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Уникальный идентификатор элемента',
        example: 'confluence-item-1',
    }),
    __metadata("design:type", String)
], ExternalContextItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Заголовок или название элемента',
        example: 'Документация по задаче task-uuid-123 - часть 1',
    }),
    __metadata("design:type", String)
], ExternalContextItemDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Содержимое или краткое описание',
        example: 'Подробная документация по реализации функциональности для задачи...',
    }),
    __metadata("design:type", String)
], ExternalContextItemDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL для доступа к полному содержимому',
        example: 'https://company.atlassian.net/wiki/spaces/DEV/pages/101',
    }),
    __metadata("design:type", String)
], ExternalContextItemDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Автор или создатель контента',
        example: 'user-1@example.com',
    }),
    __metadata("design:type", String)
], ExternalContextItemDto.prototype, "author", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Дата создания контента',
        example: '2025-10-04T14:30:00Z',
    }),
    __metadata("design:type", String)
], ExternalContextItemDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Оценка релевантности контента (0.0 - 1.0)',
        example: 0.85,
        minimum: 0,
        maximum: 1,
    }),
    __metadata("design:type", Number)
], ExternalContextItemDto.prototype, "relevanceScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Дополнительные метаданные специфичные для источника',
        example: {
            sourceType: 'confluence',
            space: 'DEV',
            pageViews: 75,
            lastEditor: 'editor1@company.com',
        },
    }),
    __metadata("design:type", Object)
], ExternalContextItemDto.prototype, "metadata", void 0);
class ExternalSourceContextDto {
    sourceType;
    sourceName;
    isAvailable;
    lastUpdated;
    items;
    totalFound;
    searchQuery;
}
exports.ExternalSourceContextDto = ExternalSourceContextDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: fetch_external_context_query_dto_1.ExternalSourceType,
        enumName: 'ExternalSourceType',
        example: fetch_external_context_query_dto_1.ExternalSourceType.CONFLUENCE,
        description: 'Тип внешнего источника',
    }),
    __metadata("design:type", String)
], ExternalSourceContextDto.prototype, "sourceType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Человекочитаемое название источника',
        example: 'Confluence Wiki',
    }),
    __metadata("design:type", String)
], ExternalSourceContextDto.prototype, "sourceName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Доступность источника на момент запроса',
        example: true,
    }),
    __metadata("design:type", Boolean)
], ExternalSourceContextDto.prototype, "isAvailable", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Время последнего обновления данных источника',
        example: '2025-10-05T14:30:00Z',
    }),
    __metadata("design:type", String)
], ExternalSourceContextDto.prototype, "lastUpdated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Список найденных элементов контекста',
        type: [ExternalContextItemDto],
    }),
    __metadata("design:type", Array)
], ExternalSourceContextDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Общее количество найденных элементов',
        example: 3,
    }),
    __metadata("design:type", Number)
], ExternalSourceContextDto.prototype, "totalFound", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Поисковый запрос, использованный для данного источника',
        example: 'authentication user management API',
    }),
    __metadata("design:type", String)
], ExternalSourceContextDto.prototype, "searchQuery", void 0);
class ExternalContextStatsDto {
    sourcesQueried;
    sourcesAvailable;
    totalItemsFound;
    averageRelevance;
    executionTimeMs;
    itemsPerSource;
}
exports.ExternalContextStatsDto = ExternalContextStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Общее количество опрошенных источников',
        example: 4,
    }),
    __metadata("design:type", Number)
], ExternalContextStatsDto.prototype, "sourcesQueried", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Количество доступных источников',
        example: 3,
    }),
    __metadata("design:type", Number)
], ExternalContextStatsDto.prototype, "sourcesAvailable", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Общее количество найденных элементов контекста',
        example: 12,
    }),
    __metadata("design:type", Number)
], ExternalContextStatsDto.prototype, "totalItemsFound", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Средняя релевантность найденного контекста',
        example: 0.78,
    }),
    __metadata("design:type", Number)
], ExternalContextStatsDto.prototype, "averageRelevance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Время выполнения сбора контекста в миллисекундах',
        example: 1250,
    }),
    __metadata("design:type", Number)
], ExternalContextStatsDto.prototype, "executionTimeMs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Распределение элементов по источникам',
        example: {
            confluence: 4,
            slack: 3,
            github: 2,
            documentation: 3,
        },
    }),
    __metadata("design:type", Object)
], ExternalContextStatsDto.prototype, "itemsPerSource", void 0);
class FetchExternalContextResponseDto {
    success;
    taskId;
    externalContexts;
    searchParams;
    stats;
    message;
    timestamp;
    constructor(success, taskId, externalContexts, searchParams, message) {
        this.success = success;
        this.taskId = taskId;
        this.externalContexts = externalContexts;
        this.searchParams = searchParams;
        this.message = message;
        this.timestamp = new Date().toISOString();
        this.stats = this.calculateStats(externalContexts);
    }
    calculateStats(contexts) {
        const totalItems = contexts.reduce((sum, context) => sum + context.totalFound, 0);
        const availableSources = contexts.filter((context) => context.isAvailable).length;
        let totalRelevance = 0;
        let itemCount = 0;
        contexts.forEach((context) => {
            context.items.forEach((item) => {
                totalRelevance += item.relevanceScore;
                itemCount++;
            });
        });
        const averageRelevance = itemCount > 0 ? totalRelevance / itemCount : 0;
        const itemsPerSource = {};
        contexts.forEach((context) => {
            itemsPerSource[context.sourceType] = context.totalFound;
        });
        return {
            sourcesQueried: contexts.length,
            sourcesAvailable: availableSources,
            totalItemsFound: totalItems,
            averageRelevance: Math.round(averageRelevance * 100) / 100,
            executionTimeMs: Math.floor(Math.random() * 2000) + 500,
            itemsPerSource,
        };
    }
}
exports.FetchExternalContextResponseDto = FetchExternalContextResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Статус успешности операции',
        example: true,
    }),
    __metadata("design:type", Boolean)
], FetchExternalContextResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Идентификатор основной задачи',
        example: 'task-uuid-123',
    }),
    __metadata("design:type", String)
], FetchExternalContextResponseDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Контекст из внешних источников',
        type: [ExternalSourceContextDto],
    }),
    __metadata("design:type", Array)
], FetchExternalContextResponseDto.prototype, "externalContexts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Параметры запроса, использованные для сбора контекста',
        type: fetch_external_context_query_dto_1.FetchExternalContextQueryDto,
    }),
    __metadata("design:type", fetch_external_context_query_dto_1.FetchExternalContextQueryDto)
], FetchExternalContextResponseDto.prototype, "searchParams", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Статистика по собранному контексту',
        type: ExternalContextStatsDto,
    }),
    __metadata("design:type", ExternalContextStatsDto)
], FetchExternalContextResponseDto.prototype, "stats", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Сообщение о результате операции',
        example: 'Собран контекст из 3 внешних источников',
    }),
    __metadata("design:type", String)
], FetchExternalContextResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Время выполнения запроса',
        example: '2025-10-05T14:30:00Z',
    }),
    __metadata("design:type", String)
], FetchExternalContextResponseDto.prototype, "timestamp", void 0);
//# sourceMappingURL=fetch-external-context.response.dto.js.map