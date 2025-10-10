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
exports.GetTaskHistoryResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class GetTaskHistoryResponseDto {
    taskId;
    count;
    items;
    success;
    timestamp;
    constructor(taskId, items) {
        this.taskId = taskId;
        this.count = items.length;
        this.items = items;
        this.success = true;
        this.timestamp = new Date().toISOString();
    }
}
exports.GetTaskHistoryResponseDto = GetTaskHistoryResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'TASK-123', description: 'ID of the task' }),
    __metadata("design:type", String)
], GetTaskHistoryResponseDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 3,
        description: 'Number of history records returned',
    }),
    __metadata("design:type", Number)
], GetTaskHistoryResponseDto.prototype, "count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'array',
        description: 'Task history records for the task',
        example: [
            {
                id: 'history-uuid',
                agentId: 'agent-uuid',
                taskId: 'TASK-123',
                taskKey: 'PROJ-123',
                taskTitle: 'Sample task',
                action: 'status_changed',
                fromStatus: 'To Do',
                toStatus: 'In Progress',
                status: 'completed',
                createdAt: '2024-01-01T00:00:00.000Z',
            },
        ],
    }),
    __metadata("design:type", Array)
], GetTaskHistoryResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Success status' }),
    __metadata("design:type", Boolean)
], GetTaskHistoryResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-01-01T00:00:00.000Z',
        description: 'Response timestamp',
    }),
    __metadata("design:type", String)
], GetTaskHistoryResponseDto.prototype, "timestamp", void 0);
//# sourceMappingURL=get-task-history.response.dto.js.map