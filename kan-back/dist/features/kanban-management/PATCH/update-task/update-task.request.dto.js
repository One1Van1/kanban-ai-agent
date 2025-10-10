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
exports.UpdateTaskRequestDto = exports.TaskPriority = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var TaskPriority;
(function (TaskPriority) {
    TaskPriority["LOW"] = "low";
    TaskPriority["MEDIUM"] = "medium";
    TaskPriority["HIGH"] = "high";
    TaskPriority["URGENT"] = "urgent";
    TaskPriority["CRITICAL"] = "critical";
})(TaskPriority || (exports.TaskPriority = TaskPriority = {}));
class UpdateTaskRequestDto {
    title;
    description;
    priority;
    assigneeEmail;
    assigneeName;
    taskKey;
    tags;
    dueDate;
    estimatedHours;
    context;
    updateReason;
    updatedByEmail;
    updatedByName;
    agentId;
    triggerType = 'manual';
    preservePosition = true;
    sendNotifications = true;
}
exports.UpdateTaskRequestDto = UpdateTaskRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Обновленное название задачи',
        description: 'New title for the task',
        maxLength: 500,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateTaskRequestDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Обновленное описание задачи с новыми требованиями',
        description: 'New description for the task',
        maxLength: 5000,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(5000),
    __metadata("design:type", String)
], UpdateTaskRequestDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: TaskPriority,
        example: TaskPriority.HIGH,
        description: 'New priority level for the task',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(TaskPriority),
    __metadata("design:type", String)
], UpdateTaskRequestDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'new.assignee@example.com',
        description: 'Email of the new assignee',
        maxLength: 255,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateTaskRequestDto.prototype, "assigneeEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'New Assignee',
        description: 'Name of the new assignee',
        maxLength: 255,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateTaskRequestDto.prototype, "assigneeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'TASK-NEW-123',
        description: 'New task key/identifier',
        maxLength: 100,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateTaskRequestDto.prototype, "taskKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['frontend', 'urgent', 'customer-request'],
        description: 'Updated tags for the task',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateTaskRequestDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-02-15T10:00:00Z',
        description: 'New due date for the task',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTaskRequestDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 8,
        description: 'Estimated hours to complete the task',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateTaskRequestDto.prototype, "estimatedHours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            department: 'backend',
            epic: 'user-management',
            storyPoints: 5,
            customFields: {
                clientId: 'client-123',
                bugfix: false,
            },
        },
        description: 'Additional context and custom fields for the task',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateTaskRequestDto.prototype, "context", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Обновляю задачу после обратной связи от клиента',
        description: 'Reason for the update',
        maxLength: 1000,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], UpdateTaskRequestDto.prototype, "updateReason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'manager@example.com',
        description: 'Email of the person making the update',
        maxLength: 255,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateTaskRequestDto.prototype, "updatedByEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Project Manager',
        description: 'Name of the person making the update',
        maxLength: 255,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateTaskRequestDto.prototype, "updatedByName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'uuid-agent-123',
        description: 'ID of the agent performing this update',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTaskRequestDto.prototype, "agentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'agent_instruction',
        description: 'What triggered this update',
        required: false,
        default: 'manual',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTaskRequestDto.prototype, "triggerType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: false,
        description: 'Whether to preserve the current task status and column',
        required: false,
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateTaskRequestDto.prototype, "preservePosition", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Whether to send notifications about the update',
        required: false,
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateTaskRequestDto.prototype, "sendNotifications", void 0);
//# sourceMappingURL=update-task.request.dto.js.map