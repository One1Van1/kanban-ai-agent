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
exports.FetchTaskContextResponseDto = exports.TaskContextDataDto = exports.TaskCustomFieldsDto = exports.TaskWorklogDto = exports.TaskAttachmentDto = exports.TaskCommentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class TaskCommentDto {
    id;
    author;
    content;
    createdAt;
}
exports.TaskCommentDto = TaskCommentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Уникальный идентификатор комментария',
        example: '1',
    }),
    __metadata("design:type", String)
], TaskCommentDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Автор комментария',
        example: 'AI Agent',
    }),
    __metadata("design:type", String)
], TaskCommentDto.prototype, "author", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Содержимое комментария',
        example: 'Автоматический анализ задачи',
    }),
    __metadata("design:type", String)
], TaskCommentDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Дата создания комментария',
        example: '2025-10-05T14:30:00Z',
    }),
    __metadata("design:type", String)
], TaskCommentDto.prototype, "createdAt", void 0);
class TaskAttachmentDto {
    id;
    fileName;
    fileSize;
    uploadedAt;
}
exports.TaskAttachmentDto = TaskAttachmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Уникальный идентификатор вложения',
        example: '1',
    }),
    __metadata("design:type", String)
], TaskAttachmentDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Имя файла',
        example: 'requirements.pdf',
    }),
    __metadata("design:type", String)
], TaskAttachmentDto.prototype, "fileName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Размер файла в байтах',
        example: 1024,
    }),
    __metadata("design:type", Number)
], TaskAttachmentDto.prototype, "fileSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Дата загрузки файла',
        example: '2025-10-05T14:30:00Z',
    }),
    __metadata("design:type", String)
], TaskAttachmentDto.prototype, "uploadedAt", void 0);
class TaskWorklogDto {
    id;
    author;
    timeSpent;
    description;
    loggedAt;
}
exports.TaskWorklogDto = TaskWorklogDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Уникальный идентификатор записи времени',
        example: '1',
    }),
    __metadata("design:type", String)
], TaskWorklogDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Автор записи времени',
        example: 'Developer',
    }),
    __metadata("design:type", String)
], TaskWorklogDto.prototype, "author", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Потраченное время',
        example: '2h',
    }),
    __metadata("design:type", String)
], TaskWorklogDto.prototype, "timeSpent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Описание работы',
        example: 'Анализ требований',
    }),
    __metadata("design:type", String)
], TaskWorklogDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Дата записи времени',
        example: '2025-10-05T14:30:00Z',
    }),
    __metadata("design:type", String)
], TaskWorklogDto.prototype, "loggedAt", void 0);
class TaskCustomFieldsDto {
    priority;
    estimatedHours;
    component;
}
exports.TaskCustomFieldsDto = TaskCustomFieldsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Приоритет задачи',
        example: 'High',
    }),
    __metadata("design:type", String)
], TaskCustomFieldsDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Оценочное время в часах',
        example: 8,
    }),
    __metadata("design:type", Number)
], TaskCustomFieldsDto.prototype, "estimatedHours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Компонент системы',
        example: 'Frontend',
    }),
    __metadata("design:type", String)
], TaskCustomFieldsDto.prototype, "component", void 0);
class TaskContextDataDto {
    taskId;
    description;
    comments;
    attachments;
    worklog;
    customFields;
}
exports.TaskContextDataDto = TaskContextDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Идентификатор задачи',
        example: 'task-uuid-123',
    }),
    __metadata("design:type", String)
], TaskContextDataDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Описание задачи',
        example: 'Контекст для задачи task-uuid-123',
    }),
    __metadata("design:type", String)
], TaskContextDataDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Комментарии к задаче',
        type: [TaskCommentDto],
    }),
    __metadata("design:type", Array)
], TaskContextDataDto.prototype, "comments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Вложения задачи',
        type: [TaskAttachmentDto],
    }),
    __metadata("design:type", Array)
], TaskContextDataDto.prototype, "attachments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Записи времени по задаче',
        type: [TaskWorklogDto],
    }),
    __metadata("design:type", Array)
], TaskContextDataDto.prototype, "worklog", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Дополнительные поля задачи',
        type: TaskCustomFieldsDto,
    }),
    __metadata("design:type", TaskCustomFieldsDto)
], TaskContextDataDto.prototype, "customFields", void 0);
class FetchTaskContextResponseDto {
    success;
    taskId;
    contextData;
    message;
    timestamp;
    constructor(success, taskId, contextData, message) {
        this.success = success;
        this.taskId = taskId;
        this.contextData = contextData;
        this.message = message;
        this.timestamp = new Date().toISOString();
    }
}
exports.FetchTaskContextResponseDto = FetchTaskContextResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Статус успешности операции',
        example: true,
    }),
    __metadata("design:type", Boolean)
], FetchTaskContextResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Идентификатор задачи',
        example: 'task-uuid-123',
    }),
    __metadata("design:type", String)
], FetchTaskContextResponseDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Данные контекста задачи',
        type: TaskContextDataDto,
    }),
    __metadata("design:type", TaskContextDataDto)
], FetchTaskContextResponseDto.prototype, "contextData", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Сообщение о результате операции',
        example: 'Контекст задачи успешно получен',
    }),
    __metadata("design:type", String)
], FetchTaskContextResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Время получения контекста',
        example: '2025-10-05T14:30:00Z',
    }),
    __metadata("design:type", String)
], FetchTaskContextResponseDto.prototype, "timestamp", void 0);
//# sourceMappingURL=fetch-task-context.response.dto.js.map