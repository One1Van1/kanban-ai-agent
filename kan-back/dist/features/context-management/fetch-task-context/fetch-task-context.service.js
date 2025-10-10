"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchTaskContextService = void 0;
const common_1 = require("@nestjs/common");
const fetch_task_context_response_dto_1 = require("./fetch-task-context.response.dto");
let FetchTaskContextService = class FetchTaskContextService {
    async execute(taskId) {
        const taskContext = {
            taskId,
            description: `Контекст для задачи ${taskId}`,
            comments: [
                {
                    id: '1',
                    author: 'AI Agent',
                    content: 'Автоматический анализ задачи',
                    createdAt: new Date().toISOString(),
                },
            ],
            attachments: [
                {
                    id: '1',
                    fileName: 'requirements.pdf',
                    fileSize: 1024,
                    uploadedAt: new Date().toISOString(),
                },
            ],
            worklog: [
                {
                    id: '1',
                    author: 'Developer',
                    timeSpent: '2h',
                    description: 'Анализ требований',
                    loggedAt: new Date().toISOString(),
                },
            ],
            customFields: {
                priority: 'High',
                estimatedHours: 8,
                component: 'Frontend',
            },
        };
        return new fetch_task_context_response_dto_1.FetchTaskContextResponseDto(true, taskId, taskContext, 'Контекст задачи успешно получен');
    }
};
exports.FetchTaskContextService = FetchTaskContextService;
exports.FetchTaskContextService = FetchTaskContextService = __decorate([
    (0, common_1.Injectable)()
], FetchTaskContextService);
//# sourceMappingURL=fetch-task-context.service.js.map