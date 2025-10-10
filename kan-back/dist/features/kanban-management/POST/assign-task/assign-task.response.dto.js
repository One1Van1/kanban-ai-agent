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
exports.AssignTaskResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class AssignTaskResponseDto {
    success;
    message;
    taskId;
    assignment;
    timestamp;
    metadata;
}
exports.AssignTaskResponseDto = AssignTaskResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Whether the assignment was successful',
    }),
    __metadata("design:type", Boolean)
], AssignTaskResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Task assigned successfully',
        description: 'Human-readable message about the assignment result',
    }),
    __metadata("design:type", String)
], AssignTaskResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'ID of the assigned task',
    }),
    __metadata("design:type", String)
], AssignTaskResponseDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Object,
        description: 'Complete assignment information',
        example: {
            id: 'assignment-123',
            taskId: '550e8400-e29b-41d4-a716-446655440000',
            assigneeEmail: 'john.doe@example.com',
            assigneeName: 'John Doe',
            assignedByEmail: 'jane.doe@example.com',
            assignedByName: 'Jane Doe',
            assignmentMessage: 'Назначаю тебе эту задачу',
            assignedAt: '2024-01-01T12:00:00Z',
            context: { priority: 'high' },
            agentId: 'uuid-agent-123',
            triggerType: 'agent_instruction',
        },
    }),
    __metadata("design:type", Object)
], AssignTaskResponseDto.prototype, "assignment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-01-01T12:00:00.000Z',
        description: 'Timestamp when assignment was created',
    }),
    __metadata("design:type", String)
], AssignTaskResponseDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Object,
        description: 'Additional metadata about the operation',
        example: {
            previousAssignee: 'previous.user@example.com',
            notificationsSent: ['email', 'telegram'],
            queueJobId: 'job-123',
        },
        required: false,
    }),
    __metadata("design:type", Object)
], AssignTaskResponseDto.prototype, "metadata", void 0);
//# sourceMappingURL=assign-task.response.dto.js.map