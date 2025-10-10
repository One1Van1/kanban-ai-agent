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
exports.StoreTaskHistoryRequestDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class StoreTaskHistoryRequestDto {
    agentId;
    taskId;
    taskKey;
    taskTitle;
    action;
    fromStatus;
    toStatus;
    fromColumn;
    toColumn;
    context;
    agentResponse;
    executedInstruction;
    status;
    error;
    processingTimeMs;
}
exports.StoreTaskHistoryRequestDto = StoreTaskHistoryRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-string', description: 'ID агента' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], StoreTaskHistoryRequestDto.prototype, "agentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'TASK-123', description: 'ID задачи' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StoreTaskHistoryRequestDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PROJ-123', description: 'Ключ задачи' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StoreTaskHistoryRequestDto.prototype, "taskKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Implement user authentication',
        description: 'Заголовок задачи',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StoreTaskHistoryRequestDto.prototype, "taskTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'status_changed', description: 'Тип действия' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StoreTaskHistoryRequestDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'To Do',
        description: 'Статус откуда',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StoreTaskHistoryRequestDto.prototype, "fromStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'In Progress',
        description: 'Статус куда',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StoreTaskHistoryRequestDto.prototype, "toStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'COLUMN_TODO',
        description: 'Колонка откуда',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StoreTaskHistoryRequestDto.prototype, "fromColumn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'COLUMN_PROGRESS',
        description: 'Колонка куда',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StoreTaskHistoryRequestDto.prototype, "toColumn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: {}, description: 'Контекст задачи', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], StoreTaskHistoryRequestDto.prototype, "context", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: {}, description: 'Ответ агента', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], StoreTaskHistoryRequestDto.prototype, "agentResponse", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Analyze task and add estimates',
        description: 'Выполненная инструкция',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StoreTaskHistoryRequestDto.prototype, "executedInstruction", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'pending',
        description: 'Статус обработки',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StoreTaskHistoryRequestDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Error message',
        description: 'Ошибка при обработке',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StoreTaskHistoryRequestDto.prototype, "error", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1500,
        description: 'Время обработки в миллисекундах',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], StoreTaskHistoryRequestDto.prototype, "processingTimeMs", void 0);
//# sourceMappingURL=store-task-history.request.dto.js.map