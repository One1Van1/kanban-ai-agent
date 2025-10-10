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
exports.MoveTaskResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class MoveTaskResponseDto {
    success;
    taskKey;
    previousStatus;
    newStatus;
    message;
    updatedTask;
    error;
    constructor(success, taskKey, previousStatus, newStatus, message, updatedTask, error) {
        this.success = success;
        this.taskKey = taskKey;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
        this.message = message;
        this.updatedTask = updatedTask;
        this.error = error;
    }
}
exports.MoveTaskResponseDto = MoveTaskResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Статус успешности операции',
        example: true,
    }),
    __metadata("design:type", Boolean)
], MoveTaskResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ключ задачи в Jira',
        example: 'KAN-5',
    }),
    __metadata("design:type", String)
], MoveTaskResponseDto.prototype, "taskKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Предыдущий статус',
        example: 'In Progress',
    }),
    __metadata("design:type", String)
], MoveTaskResponseDto.prototype, "previousStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Новый статус',
        example: 'Done',
    }),
    __metadata("design:type", String)
], MoveTaskResponseDto.prototype, "newStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Сообщение о результате',
        example: 'Task moved successfully',
    }),
    __metadata("design:type", String)
], MoveTaskResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Обновленная задача',
        required: false,
    }),
    __metadata("design:type", Object)
], MoveTaskResponseDto.prototype, "updatedTask", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Сообщение об ошибке (если есть)',
        required: false,
    }),
    __metadata("design:type", String)
], MoveTaskResponseDto.prototype, "error", void 0);
//# sourceMappingURL=move-task.response.dto.js.map