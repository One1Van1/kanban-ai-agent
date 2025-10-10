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
exports.UpdateTaskLabelsResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const update_task_labels_request_dto_1 = require("./update-task-labels.request.dto");
class UpdateTaskLabelsResponseDto {
    taskId;
    operation;
    currentLabels;
    addedLabels;
    removedLabels;
    totalLabelsCount;
    updatedAt;
    updatedBy;
    updateReason;
    success;
    labelChanges;
    historyLogId;
}
exports.UpdateTaskLabelsResponseDto = UpdateTaskLabelsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of the updated task',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], UpdateTaskLabelsResponseDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Operation that was performed',
        enum: update_task_labels_request_dto_1.LabelOperation,
        enumName: 'LabelOperation',
        example: update_task_labels_request_dto_1.LabelOperation.ADD,
    }),
    __metadata("design:type", String)
], UpdateTaskLabelsResponseDto.prototype, "operation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current list of all labels on the task',
        type: [String],
        example: ['bug', 'high-priority', 'backend', 'in-review'],
    }),
    __metadata("design:type", Array)
], UpdateTaskLabelsResponseDto.prototype, "currentLabels", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Labels that were added in this operation',
        type: [String],
        example: ['high-priority', 'backend'],
    }),
    __metadata("design:type", Array)
], UpdateTaskLabelsResponseDto.prototype, "addedLabels", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Labels that were removed in this operation',
        type: [String],
        example: ['low-priority'],
    }),
    __metadata("design:type", Array)
], UpdateTaskLabelsResponseDto.prototype, "removedLabels", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of labels after update',
        example: 4,
    }),
    __metadata("design:type", Number)
], UpdateTaskLabelsResponseDto.prototype, "totalLabelsCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when labels were updated',
        example: '2024-01-15T10:30:00.000Z',
    }),
    __metadata("design:type", Date)
], UpdateTaskLabelsResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User who performed the update',
        example: 'user-123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], UpdateTaskLabelsResponseDto.prototype, "updatedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reason for the label update',
        example: 'Added priority labels after triage',
    }),
    __metadata("design:type", String)
], UpdateTaskLabelsResponseDto.prototype, "updateReason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the operation was successful',
        example: true,
    }),
    __metadata("design:type", Boolean)
], UpdateTaskLabelsResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Detailed changes made to labels',
        type: 'array',
        items: {
            type: 'object',
            properties: {
                labelName: { type: 'string' },
                operation: { type: 'string', enum: ['added', 'removed'] },
                timestamp: { type: 'string', format: 'date-time' },
            },
        },
        example: [
            {
                labelName: 'high-priority',
                operation: 'added',
                timestamp: '2024-01-15T10:30:00.000Z',
            },
            {
                labelName: 'low-priority',
                operation: 'removed',
                timestamp: '2024-01-15T10:30:00.000Z',
            },
        ],
    }),
    __metadata("design:type", Array)
], UpdateTaskLabelsResponseDto.prototype, "labelChanges", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'History log entry ID for audit trail',
        example: 'hist-789e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], UpdateTaskLabelsResponseDto.prototype, "historyLogId", void 0);
//# sourceMappingURL=update-task-labels.response.dto.js.map