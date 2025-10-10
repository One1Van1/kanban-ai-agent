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
exports.CreateTaskResponseDto = exports.CreatedTaskDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CreatedTaskDto {
    id;
    taskId;
    taskKey;
    taskTitle;
    initialColumn;
    initialStatus;
    action;
    createdAt;
    context;
    constructor(taskHistory) {
        this.id = taskHistory.id;
        this.taskId = taskHistory.taskId;
        this.taskKey = taskHistory.taskKey;
        this.taskTitle = taskHistory.taskTitle;
        this.initialColumn = taskHistory.toColumn || '';
        this.initialStatus = taskHistory.toStatus || '';
        this.action = taskHistory.action;
        this.createdAt = taskHistory.createdAt;
        this.context = taskHistory.context || {};
    }
}
exports.CreatedTaskDto = CreatedTaskDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-123', description: 'Created task history ID' }),
    __metadata("design:type", String)
], CreatedTaskDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PROJ-123', description: 'Task ID' }),
    __metadata("design:type", String)
], CreatedTaskDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PROJ-123', description: 'Task key' }),
    __metadata("design:type", String)
], CreatedTaskDto.prototype, "taskKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Fix user authentication bug',
        description: 'Task title',
    }),
    __metadata("design:type", String)
], CreatedTaskDto.prototype, "taskTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'To Do', description: 'Initial column' }),
    __metadata("design:type", String)
], CreatedTaskDto.prototype, "initialColumn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'pending', description: 'Initial status' }),
    __metadata("design:type", String)
], CreatedTaskDto.prototype, "initialStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'created', description: 'Action performed' }),
    __metadata("design:type", String)
], CreatedTaskDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-10-09T12:00:00Z',
        description: 'Creation timestamp',
    }),
    __metadata("design:type", Date)
], CreatedTaskDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: {}, description: 'Task context and metadata' }),
    __metadata("design:type", Object)
], CreatedTaskDto.prototype, "context", void 0);
class CreateTaskResponseDto {
    task;
    success;
    message;
    constructor(taskHistory) {
        this.task = new CreatedTaskDto(taskHistory);
        this.success = true;
        this.message = 'Task created successfully';
    }
}
exports.CreateTaskResponseDto = CreateTaskResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: CreatedTaskDto,
        description: 'Created task information',
    }),
    __metadata("design:type", CreatedTaskDto)
], CreateTaskResponseDto.prototype, "task", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Whether task creation was successful',
    }),
    __metadata("design:type", Boolean)
], CreateTaskResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Task created successfully',
        description: 'Success message',
    }),
    __metadata("design:type", String)
], CreateTaskResponseDto.prototype, "message", void 0);
//# sourceMappingURL=create-task.response.dto.js.map