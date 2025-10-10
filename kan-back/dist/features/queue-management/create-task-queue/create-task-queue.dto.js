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
exports.CreateTaskQueueResponseDto = exports.CreateTaskQueueRequestDto = exports.TaskPriority = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var TaskPriority;
(function (TaskPriority) {
    TaskPriority["LOW"] = "low";
    TaskPriority["NORMAL"] = "normal";
    TaskPriority["HIGH"] = "high";
    TaskPriority["CRITICAL"] = "critical";
})(TaskPriority || (exports.TaskPriority = TaskPriority = {}));
class CreateTaskQueueRequestDto {
    taskId;
    taskType;
    data;
    priority;
    delay;
    attempts;
}
exports.CreateTaskQueueRequestDto = CreateTaskQueueRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique task identifier' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTaskQueueRequestDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Type of task to process' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTaskQueueRequestDto.prototype, "taskType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Task data payload' }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateTaskQueueRequestDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: TaskPriority, default: TaskPriority.NORMAL }),
    (0, class_validator_1.IsEnum)(TaskPriority),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTaskQueueRequestDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Delay in milliseconds before processing',
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateTaskQueueRequestDto.prototype, "delay", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Maximum number of retry attempts' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateTaskQueueRequestDto.prototype, "attempts", void 0);
class CreateTaskQueueResponseDto {
    success;
    jobId;
    taskId;
    queueName;
    message;
}
exports.CreateTaskQueueResponseDto = CreateTaskQueueResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Success status' }),
    __metadata("design:type", Boolean)
], CreateTaskQueueResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Queue job ID' }),
    __metadata("design:type", String)
], CreateTaskQueueResponseDto.prototype, "jobId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Task ID' }),
    __metadata("design:type", String)
], CreateTaskQueueResponseDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Queue name' }),
    __metadata("design:type", String)
], CreateTaskQueueResponseDto.prototype, "queueName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Response message' }),
    __metadata("design:type", String)
], CreateTaskQueueResponseDto.prototype, "message", void 0);
//# sourceMappingURL=create-task-queue.dto.js.map