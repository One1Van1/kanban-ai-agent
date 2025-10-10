"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchExternalContextService = void 0;
const common_1 = require("@nestjs/common");
const fetch_external_context_query_dto_1 = require("./fetch-external-context.query.dto");
const fetch_external_context_response_dto_1 = require("./fetch-external-context.response.dto");
let FetchExternalContextService = class FetchExternalContextService {
    async execute(taskId, query) {
        const externalContexts = await this.fetchFromExternalSources(taskId, query);
        return new fetch_external_context_response_dto_1.FetchExternalContextResponseDto(true, taskId, externalContexts, query, `Собран контекст из ${externalContexts.length} внешних источников`);
    }
    async fetchFromExternalSources(taskId, query) {
        const contexts = [];
        const sources = query.sources || Object.values(fetch_external_context_query_dto_1.ExternalSourceType);
        const maxResults = query.maxResultsPerSource || 5;
        for (const source of sources) {
            const sourceContext = await this.fetchFromSource(source, taskId, query, maxResults);
            if (sourceContext) {
                contexts.push(sourceContext);
            }
        }
        return contexts;
    }
    async fetchFromSource(sourceType, taskId, query, maxResults) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        const mockData = this.generateMockDataForSource(sourceType, taskId, query, maxResults);
        return {
            sourceType,
            sourceName: this.getSourceName(sourceType),
            isAvailable: true,
            lastUpdated: new Date().toISOString(),
            items: mockData,
            totalFound: mockData.length,
            searchQuery: query.keywords?.join(' ') || `task-${taskId}`,
        };
    }
    generateMockDataForSource(sourceType, taskId, query, maxResults) {
        const items = [];
        const itemCount = Math.min(maxResults, Math.floor(Math.random() * 3) + 1);
        for (let i = 1; i <= itemCount; i++) {
            items.push({
                id: `${sourceType}-item-${i}`,
                title: this.generateTitleForSource(sourceType, i, taskId),
                content: this.generateContentForSource(sourceType, i, taskId),
                url: this.generateUrlForSource(sourceType, i),
                author: `user-${i}@example.com`,
                createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
                relevanceScore: Math.random() * 0.5 + 0.5,
                metadata: this.generateMetadataForSource(sourceType, i),
            });
        }
        return items;
    }
    getSourceName(sourceType) {
        const names = {
            [fetch_external_context_query_dto_1.ExternalSourceType.CONFLUENCE]: 'Confluence Wiki',
            [fetch_external_context_query_dto_1.ExternalSourceType.SLACK]: 'Slack Conversations',
            [fetch_external_context_query_dto_1.ExternalSourceType.GITHUB]: 'GitHub Repository',
            [fetch_external_context_query_dto_1.ExternalSourceType.DOCUMENTATION]: 'Technical Documentation',
            [fetch_external_context_query_dto_1.ExternalSourceType.KNOWLEDGE_BASE]: 'Knowledge Base',
            [fetch_external_context_query_dto_1.ExternalSourceType.PREVIOUS_TICKETS]: 'Previous Tickets',
            [fetch_external_context_query_dto_1.ExternalSourceType.CODE_REPOSITORY]: 'Code Repository',
            [fetch_external_context_query_dto_1.ExternalSourceType.API_DOCUMENTATION]: 'API Documentation',
        };
        return names[sourceType] || sourceType;
    }
    generateTitleForSource(sourceType, index, taskId) {
        const titles = {
            [fetch_external_context_query_dto_1.ExternalSourceType.CONFLUENCE]: `Документация по задаче ${taskId} - часть ${index}`,
            [fetch_external_context_query_dto_1.ExternalSourceType.SLACK]: `Обсуждение задачи ${taskId} в канале #development`,
            [fetch_external_context_query_dto_1.ExternalSourceType.GITHUB]: `Pull Request #${100 + index} связанный с ${taskId}`,
            [fetch_external_context_query_dto_1.ExternalSourceType.DOCUMENTATION]: `Техническая документация - раздел ${index}`,
            [fetch_external_context_query_dto_1.ExternalSourceType.KNOWLEDGE_BASE]: `База знаний - статья ${index} по теме`,
            [fetch_external_context_query_dto_1.ExternalSourceType.PREVIOUS_TICKETS]: `Похожая задача PREV-${100 + index}`,
            [fetch_external_context_query_dto_1.ExternalSourceType.CODE_REPOSITORY]: `Код модуля ${index} для ${taskId}`,
            [fetch_external_context_query_dto_1.ExternalSourceType.API_DOCUMENTATION]: `API эндпоинт документация v${index}`,
        };
        return titles[sourceType] || `${sourceType} item ${index}`;
    }
    generateContentForSource(sourceType, index, taskId) {
        const contents = {
            [fetch_external_context_query_dto_1.ExternalSourceType.CONFLUENCE]: `Подробная документация по реализации функциональности для задачи ${taskId}. Включает архитектурные решения и примеры кода.`,
            [fetch_external_context_query_dto_1.ExternalSourceType.SLACK]: `Разработчики обсуждали подходы к решению задачи ${taskId}. Были предложены несколько вариантов реализации.`,
            [fetch_external_context_query_dto_1.ExternalSourceType.GITHUB]: `Изменения в коде для решения аналогичной проблемы. Может служить основой для задачи ${taskId}.`,
            [fetch_external_context_query_dto_1.ExternalSourceType.DOCUMENTATION]: `Техническая документация описывает требования и ограничения для данного типа задач.`,
            [fetch_external_context_query_dto_1.ExternalSourceType.KNOWLEDGE_BASE]: `Статья в базе знаний содержит best practices и рекомендации по решению подобных задач.`,
            [fetch_external_context_query_dto_1.ExternalSourceType.PREVIOUS_TICKETS]: `Ранее решенная похожая задача с подробным описанием процесса и результатов.`,
            [fetch_external_context_query_dto_1.ExternalSourceType.CODE_REPOSITORY]: `Существующий код модуля, который может быть адаптирован для текущей задачи.`,
            [fetch_external_context_query_dto_1.ExternalSourceType.API_DOCUMENTATION]: `Документация API эндпоинтов, которые будут использоваться в рамках задачи.`,
        };
        return (contents[sourceType] || `Content from ${sourceType} for item ${index}`);
    }
    generateUrlForSource(sourceType, index) {
        const baseUrls = {
            [fetch_external_context_query_dto_1.ExternalSourceType.CONFLUENCE]: 'https://company.atlassian.net/wiki/spaces/DEV/pages',
            [fetch_external_context_query_dto_1.ExternalSourceType.SLACK]: 'https://company.slack.com/archives/C1234567890',
            [fetch_external_context_query_dto_1.ExternalSourceType.GITHUB]: 'https://github.com/company/project/pull',
            [fetch_external_context_query_dto_1.ExternalSourceType.DOCUMENTATION]: 'https://docs.company.com/technical',
            [fetch_external_context_query_dto_1.ExternalSourceType.KNOWLEDGE_BASE]: 'https://kb.company.com/articles',
            [fetch_external_context_query_dto_1.ExternalSourceType.PREVIOUS_TICKETS]: 'https://company.atlassian.net/browse/PREV',
            [fetch_external_context_query_dto_1.ExternalSourceType.CODE_REPOSITORY]: 'https://github.com/company/project/blob/main/src',
            [fetch_external_context_query_dto_1.ExternalSourceType.API_DOCUMENTATION]: 'https://api.company.com/docs',
        };
        return `${baseUrls[sourceType] || 'https://example.com'}/${100 + index}`;
    }
    generateMetadataForSource(sourceType, index) {
        const baseMetadata = {
            sourceType,
            indexPosition: index,
            lastAccessed: new Date().toISOString(),
        };
        switch (sourceType) {
            case fetch_external_context_query_dto_1.ExternalSourceType.GITHUB:
                return {
                    ...baseMetadata,
                    branch: 'main',
                    commitHash: `abc123${index}`,
                    filesChanged: Math.floor(Math.random() * 10) + 1,
                };
            case fetch_external_context_query_dto_1.ExternalSourceType.SLACK:
                return {
                    ...baseMetadata,
                    channel: '#development',
                    messageCount: Math.floor(Math.random() * 20) + 5,
                    participants: [`user${index}`, 'developer', 'manager'],
                };
            case fetch_external_context_query_dto_1.ExternalSourceType.CONFLUENCE:
                return {
                    ...baseMetadata,
                    space: 'DEV',
                    pageViews: Math.floor(Math.random() * 100) + 50,
                    lastEditor: `editor${index}@company.com`,
                };
            default:
                return baseMetadata;
        }
    }
};
exports.FetchExternalContextService = FetchExternalContextService;
exports.FetchExternalContextService = FetchExternalContextService = __decorate([
    (0, common_1.Injectable)()
], FetchExternalContextService);
//# sourceMappingURL=fetch-external-context.service.js.map