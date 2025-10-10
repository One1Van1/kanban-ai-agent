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
exports.AddTaskCommentResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class AddTaskCommentResponseDto {
    success;
    taskKey;
    message;
    error;
    constructor(success, taskKey, message, error) {
        this.success = success;
        this.taskKey = taskKey;
        this.message = message;
        this.error = error;
    }
}
exports.AddTaskCommentResponseDto = AddTaskCommentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Статус успешности операции',
        example: true,
    }),
    __metadata("design:type", Boolean)
], AddTaskCommentResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ключ задачи в Jira',
        example: 'KAN-5',
    }),
    __metadata("design:type", String)
], AddTaskCommentResponseDto.prototype, "taskKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Сообщение о результате',
        example: 'Comment added successfully',
    }),
    __metadata("design:type", String)
], AddTaskCommentResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Сообщение об ошибке (если есть)',
        example: 'Task not found',
        required: false,
    }),
    __metadata("design:type", String)
], AddTaskCommentResponseDto.prototype, "error", void 0);
//# sourceMappingURL=add-task-comment.response.dto.js.map