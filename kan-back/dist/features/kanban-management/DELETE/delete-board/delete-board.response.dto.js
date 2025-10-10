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
exports.DeleteBoardResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const delete_board_request_dto_1 = require("./delete-board.request.dto");
class DeleteBoardResponseDto {
    boardId;
    boardName;
    deleteMode;
    deletedBy;
    deletedAt;
    deleteReason;
    columnsDeleted;
    tasksInBoard;
    tasksRelocated;
    targetBoardId;
    targetBoardName;
    taskRelocations;
    notifiedMembers;
    success;
    canBeRestored;
    backupPath;
    filesDeletion;
    historyLogId;
}
exports.DeleteBoardResponseDto = DeleteBoardResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of the deleted board',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], DeleteBoardResponseDto.prototype, "boardId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the deleted board',
        example: 'Sprint Planning Board',
    }),
    __metadata("design:type", String)
], DeleteBoardResponseDto.prototype, "boardName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Deletion mode used',
        enum: delete_board_request_dto_1.BoardDeleteMode,
        enumName: 'BoardDeleteMode',
        example: delete_board_request_dto_1.BoardDeleteMode.SOFT_DELETE,
    }),
    __metadata("design:type", String)
], DeleteBoardResponseDto.prototype, "deleteMode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of the user who deleted the board',
        example: 'user-123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], DeleteBoardResponseDto.prototype, "deletedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when the board was deleted',
        example: '2024-01-15T10:30:00.000Z',
    }),
    __metadata("design:type", Date)
], DeleteBoardResponseDto.prototype, "deletedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reason for board deletion',
        example: 'Project completed, board no longer needed',
    }),
    __metadata("design:type", String)
], DeleteBoardResponseDto.prototype, "deleteReason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of columns that were in the board',
        example: 5,
    }),
    __metadata("design:type", Number)
], DeleteBoardResponseDto.prototype, "columnsDeleted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of tasks that were in the board',
        example: 23,
    }),
    __metadata("design:type", Number)
], DeleteBoardResponseDto.prototype, "tasksInBoard", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of tasks that were relocated to another board',
        example: 15,
    }),
    __metadata("design:type", Number)
], DeleteBoardResponseDto.prototype, "tasksRelocated", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Target board ID where tasks were moved',
        example: '456e7890-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], DeleteBoardResponseDto.prototype, "targetBoardId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Name of the target board where tasks were moved',
        example: 'Backlog Board',
    }),
    __metadata("design:type", String)
], DeleteBoardResponseDto.prototype, "targetBoardName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of task relocations',
        type: 'array',
        items: {
            type: 'object',
            properties: {
                taskId: { type: 'string' },
                taskTitle: { type: 'string' },
                fromBoardId: { type: 'string' },
                toBoardId: { type: 'string' },
                newColumnId: { type: 'string' },
                relocatedAt: { type: 'string', format: 'date-time' },
            },
        },
        example: [
            {
                taskId: 'task-001',
                taskTitle: 'Implement user authentication',
                fromBoardId: '123e4567-e89b-12d3-a456-426614174000',
                toBoardId: '456e7890-e89b-12d3-a456-426614174000',
                newColumnId: 'col-backlog',
                relocatedAt: '2024-01-15T10:30:00.000Z',
            },
        ],
    }),
    __metadata("design:type", Array)
], DeleteBoardResponseDto.prototype, "taskRelocations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of board members who were notified',
        type: 'array',
        items: { type: 'string' },
        example: ['user-456', 'user-789', 'user-101'],
    }),
    __metadata("design:type", Array)
], DeleteBoardResponseDto.prototype, "notifiedMembers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the operation was successful',
        example: true,
    }),
    __metadata("design:type", Boolean)
], DeleteBoardResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the board can be restored',
        example: true,
    }),
    __metadata("design:type", Boolean)
], DeleteBoardResponseDto.prototype, "canBeRestored", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Backup file path if backup was created',
        example: '/backups/boards/board-123_2024-01-15.json',
    }),
    __metadata("design:type", String)
], DeleteBoardResponseDto.prototype, "backupPath", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Files deletion summary',
        type: 'object',
        properties: {
            totalFiles: { type: 'number' },
            deletedFiles: { type: 'number' },
            failedDeletions: { type: 'array', items: { type: 'string' } },
            totalSizeDeleted: { type: 'number' },
        },
        example: {
            totalFiles: 12,
            deletedFiles: 10,
            failedDeletions: ['file1.pdf', 'image2.png'],
            totalSizeDeleted: 2048576,
        },
    }),
    __metadata("design:type", Object)
], DeleteBoardResponseDto.prototype, "filesDeletion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'History log entry ID for audit trail',
        example: 'hist-789e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], DeleteBoardResponseDto.prototype, "historyLogId", void 0);
//# sourceMappingURL=delete-board.response.dto.js.map