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
exports.UpdateTaskDetailsResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const update_task_details_request_dto_1 = require("./update-task-details.request.dto");
class UpdateTaskDetailsResponseDto {
    taskId;
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
    updatedAt;
    fieldsUpdated;
    previousValues;
    updateComment;
    success;
    version;
    historyLogId;
}
exports.UpdateTaskDetailsResponseDto = UpdateTaskDetailsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier of the updated task',
        example: 'a8f5f167-aa89-4f26-a2b1-2b5e4b9b2c8a',
    }),
    __metadata("design:type", String)
], UpdateTaskDetailsResponseDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated task title',
        example: 'Implement user authentication with OAuth2',
    }),
    __metadata("design:type", String)
], UpdateTaskDetailsResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated task description',
        example: 'Add OAuth2 integration for Google and GitHub authentication providers',
        required: false,
    }),
    __metadata("design:type", String)
], UpdateTaskDetailsResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: update_task_details_request_dto_1.TaskPriority,
        enumName: 'TaskPriority',
        example: update_task_details_request_dto_1.TaskPriority.HIGH,
        description: 'Updated task priority',
    }),
    __metadata("design:type", String)
], UpdateTaskDetailsResponseDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: update_task_details_request_dto_1.TaskType,
        enumName: 'TaskType',
        example: update_task_details_request_dto_1.TaskType.STORY,
        description: 'Updated task type',
    }),
    __metadata("design:type", String)
], UpdateTaskDetailsResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated assignee ID',
        example: 'agent-002',
        required: false,
    }),
    __metadata("design:type", String)
], UpdateTaskDetailsResponseDto.prototype, "assignee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated reporter ID',
        example: 'agent-001',
        required: false,
    }),
    __metadata("design:type", String)
], UpdateTaskDetailsResponseDto.prototype, "reporter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated task labels',
        example: ['frontend', 'authentication', 'security'],
        type: [String],
        required: false,
    }),
    __metadata("design:type", Array)
], UpdateTaskDetailsResponseDto.prototype, "labels", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated estimated hours',
        example: 8,
        required: false,
    }),
    __metadata("design:type", Number)
], UpdateTaskDetailsResponseDto.prototype, "estimatedHours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated story points',
        example: 5,
        required: false,
    }),
    __metadata("design:type", Number)
], UpdateTaskDetailsResponseDto.prototype, "storyPoints", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated due date',
        example: '2024-01-20T23:59:59Z',
        required: false,
    }),
    __metadata("design:type", String)
], UpdateTaskDetailsResponseDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated custom fields',
        type: [update_task_details_request_dto_1.TaskCustomField],
        required: false,
    }),
    __metadata("design:type", Array)
], UpdateTaskDetailsResponseDto.prototype, "customFields", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User who performed the update',
        example: 'agent-001',
    }),
    __metadata("design:type", String)
], UpdateTaskDetailsResponseDto.prototype, "updatedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when task was updated',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], UpdateTaskDetailsResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of fields that were updated',
        example: ['priority', 'assignee', 'labels'],
        type: [String],
    }),
    __metadata("design:type", Array)
], UpdateTaskDetailsResponseDto.prototype, "fieldsUpdated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Previous values before update',
        example: {
            priority: 'medium',
            assignee: 'agent-001',
            labels: ['backend'],
        },
    }),
    __metadata("design:type", Object)
], UpdateTaskDetailsResponseDto.prototype, "previousValues", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Comment about the update',
        example: 'Updated priority due to urgent business requirement',
        required: false,
    }),
    __metadata("design:type", String)
], UpdateTaskDetailsResponseDto.prototype, "updateComment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether update was successful',
        example: true,
    }),
    __metadata("design:type", Boolean)
], UpdateTaskDetailsResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current task version after update',
        example: 3,
    }),
    __metadata("design:type", Number)
], UpdateTaskDetailsResponseDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'History log ID for this update',
        example: 'b9f6f267-bb90-5f37-b3c2-3c6e5c0c3d9b',
    }),
    __metadata("design:type", String)
], UpdateTaskDetailsResponseDto.prototype, "historyLogId", void 0);
//# sourceMappingURL=update-task-details.response.dto.js.map