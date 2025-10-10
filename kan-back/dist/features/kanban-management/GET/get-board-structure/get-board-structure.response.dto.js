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
exports.GetBoardStructureResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class GetBoardStructureResponseDto {
    success;
    message;
    boardId;
    boardName;
    columns;
    workflow;
    totalTasks;
    timestamp;
    metadata;
}
exports.GetBoardStructureResponseDto = GetBoardStructureResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Whether the request was successful',
    }),
    __metadata("design:type", Boolean)
], GetBoardStructureResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Board structure retrieved successfully',
        description: 'Human-readable message about the operation result',
    }),
    __metadata("design:type", String)
], GetBoardStructureResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'project-alpha',
        description: 'ID or name of the board',
    }),
    __metadata("design:type", String)
], GetBoardStructureResponseDto.prototype, "boardId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Project Alpha Kanban Board',
        description: 'Human-readable name of the board',
    }),
    __metadata("design:type", String)
], GetBoardStructureResponseDto.prototype, "boardName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [Object],
        description: 'Array of column information',
        example: [
            {
                id: 'backlog',
                name: 'backlog',
                displayName: 'Backlog',
                order: 0,
                taskCount: 15,
                allowedStatuses: ['todo'],
                statusTransitions: ['in-progress', 'blocked'],
                wipLimit: null,
                description: 'Tasks waiting to be started',
                color: '#gray',
                metadata: {
                    defaultPriority: 'medium',
                    autoAssignment: false,
                },
                sampleTasks: [
                    {
                        id: 'task-123',
                        title: 'Implement user authentication',
                        status: 'todo',
                        assignee: 'john.doe@example.com',
                        priority: 'high',
                        createdAt: '2024-01-01T10:00:00Z',
                    },
                ],
            },
        ],
    }),
    __metadata("design:type", Array)
], GetBoardStructureResponseDto.prototype, "columns", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Object,
        description: 'Workflow rules and allowed status transitions',
        example: {
            name: 'Standard Development Workflow',
            description: 'Default workflow for development tasks',
            allowedTransitions: {
                todo: ['in-progress', 'blocked', 'cancelled'],
                'in-progress': ['in-review', 'blocked', 'todo', 'cancelled'],
                'in-review': ['testing', 'in-progress', 'done', 'blocked'],
                testing: ['done', 'in-review', 'blocked'],
                done: ['in-review', 'testing'],
                blocked: ['todo', 'in-progress', 'cancelled'],
                cancelled: ['todo'],
            },
            statuses: [
                'todo',
                'in-progress',
                'in-review',
                'testing',
                'done',
                'blocked',
                'cancelled',
            ],
        },
    }),
    __metadata("design:type", Object)
], GetBoardStructureResponseDto.prototype, "workflow", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 47,
        description: 'Total number of tasks across all columns',
    }),
    __metadata("design:type", Number)
], GetBoardStructureResponseDto.prototype, "totalTasks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-01-01T12:00:00.000Z',
        description: 'Timestamp when structure was retrieved',
    }),
    __metadata("design:type", String)
], GetBoardStructureResponseDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Object,
        description: 'Additional metadata about the board and operation',
        example: {
            lastUpdated: '2024-01-01T11:30:00Z',
            activeUsers: 8,
            recentActivity: '15 tasks moved today',
            agentAccessLevel: 'full',
            availableActions: [
                'create',
                'move',
                'assign',
                'comment',
                'status_change',
            ],
            boardSettings: {
                autoAssignment: true,
                notifications: true,
                wipLimitsEnabled: false,
            },
        },
        required: false,
    }),
    __metadata("design:type", Object)
], GetBoardStructureResponseDto.prototype, "metadata", void 0);
//# sourceMappingURL=get-board-structure.response.dto.js.map