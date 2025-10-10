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
exports.UpdateTaskDetailsRequestDto = exports.TaskCustomField = exports.TaskType = exports.TaskPriority = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var TaskPriority;
(function (TaskPriority) {
    TaskPriority["LOWEST"] = "lowest";
    TaskPriority["LOW"] = "low";
    TaskPriority["MEDIUM"] = "medium";
    TaskPriority["HIGH"] = "high";
    TaskPriority["HIGHEST"] = "highest";
})(TaskPriority || (exports.TaskPriority = TaskPriority = {}));
var TaskType;
(function (TaskType) {
    TaskType["TASK"] = "task";
    TaskType["BUG"] = "bug";
    TaskType["STORY"] = "story";
    TaskType["EPIC"] = "epic";
    TaskType["SUBTASK"] = "subtask";
})(TaskType || (exports.TaskType = TaskType = {}));
class TaskCustomField {
    name;
    value;
}
exports.TaskCustomField = TaskCustomField;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Custom field name',
        example: 'Sprint',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TaskCustomField.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Custom field value',
        example: 'Sprint 24.1',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TaskCustomField.prototype, "value", void 0);
class UpdateTaskDetailsRequestDto {
    title;
    description;
    priority;
    type;
    assignee;
    reporter;
    labels;
    estimatedHours;
    storyPoints;
    dueDate;
    customFields;
    updatedBy;
    updateComment;
}
exports.UpdateTaskDetailsRequestDto = UpdateTaskDetailsRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated task title',
        example: 'Implement user authentication with OAuth2',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTaskDetailsRequestDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated task description',
        example: 'Add OAuth2 integration for Google and GitHub authentication providers',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTaskDetailsRequestDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: TaskPriority,
        enumName: 'TaskPriority',
        example: TaskPriority.HIGH,
        description: 'Updated task priority',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(TaskPriority),
    __metadata("design:type", String)
], UpdateTaskDetailsRequestDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: TaskType,
        enumName: 'TaskType',
        example: TaskType.STORY,
        description: 'Updated task type',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(TaskType),
    __metadata("design:type", String)
], UpdateTaskDetailsRequestDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated assignee ID',
        example: 'agent-002',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTaskDetailsRequestDto.prototype, "assignee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated reporter ID',
        example: 'agent-001',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTaskDetailsRequestDto.prototype, "reporter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated task labels',
        example: ['frontend', 'authentication', 'security'],
        type: [String],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateTaskDetailsRequestDto.prototype, "labels", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated estimated hours',
        example: 8,
        minimum: 0,
        maximum: 1000,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1000),
    __metadata("design:type", Number)
], UpdateTaskDetailsRequestDto.prototype, "estimatedHours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated story points',
        example: 5,
        minimum: 0,
        maximum: 100,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], UpdateTaskDetailsRequestDto.prototype, "storyPoints", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated due date',
        example: '2024-01-20T23:59:59Z',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTaskDetailsRequestDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated custom fields',
        type: [TaskCustomField],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => TaskCustomField),
    __metadata("design:type", Array)
], UpdateTaskDetailsRequestDto.prototype, "customFields", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User performing the update',
        example: 'agent-001',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTaskDetailsRequestDto.prototype, "updatedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Comment about the update',
        example: 'Updated priority due to urgent business requirement',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTaskDetailsRequestDto.prototype, "updateComment", void 0);
//# sourceMappingURL=update-task-details.request.dto.js.map