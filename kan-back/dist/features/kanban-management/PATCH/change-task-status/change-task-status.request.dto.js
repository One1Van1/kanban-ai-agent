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
exports.ChangeTaskStatusRequestDto = exports.TaskStatus = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["TODO"] = "todo";
    TaskStatus["IN_PROGRESS"] = "in-progress";
    TaskStatus["IN_REVIEW"] = "in-review";
    TaskStatus["TESTING"] = "testing";
    TaskStatus["DONE"] = "done";
    TaskStatus["BLOCKED"] = "blocked";
    TaskStatus["CANCELLED"] = "cancelled";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
class ChangeTaskStatusRequestDto {
    newStatus;
    statusComment;
    changedByEmail;
    changedByName;
    context;
    agentId;
    triggerType = 'manual';
    forceChange = false;
}
exports.ChangeTaskStatusRequestDto = ChangeTaskStatusRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: TaskStatus,
        example: TaskStatus.IN_PROGRESS,
        description: 'New status for the task',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(TaskStatus),
    __metadata("design:type", String)
], ChangeTaskStatusRequestDto.prototype, "newStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Начинаю работу над задачей',
        description: 'Optional comment explaining the status change',
        maxLength: 1000,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], ChangeTaskStatusRequestDto.prototype, "statusComment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'john.doe@example.com',
        description: 'Email of the person changing the status',
        maxLength: 255,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], ChangeTaskStatusRequestDto.prototype, "changedByEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'John Doe',
        description: 'Name of the person changing the status',
        maxLength: 255,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], ChangeTaskStatusRequestDto.prototype, "changedByName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            reason: 'requirements_clarified',
            estimatedCompletion: '2024-01-15T10:00:00Z',
            blockers: [],
        },
        description: 'Additional context for the status change',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], ChangeTaskStatusRequestDto.prototype, "context", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'uuid-agent-123',
        description: 'ID of the agent performing this status change',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ChangeTaskStatusRequestDto.prototype, "agentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'agent_instruction',
        description: 'What triggered this status change',
        required: false,
        default: 'manual',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ChangeTaskStatusRequestDto.prototype, "triggerType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: false,
        description: 'Whether to force the status change even if it violates workflow rules',
        required: false,
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ChangeTaskStatusRequestDto.prototype, "forceChange", void 0);
//# sourceMappingURL=change-task-status.request.dto.js.map