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
exports.DeleteBoardColumnResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const delete_board_column_request_dto_1 = require("./delete-board-column.request.dto");
class DeleteBoardColumnResponseDto {
    columnId;
    boardId;
    columnName;
    deleteMode;
    deletedBy;
    deletedAt;
    deleteReason;
    originalPosition;
    tasksInColumn;
    tasksRelocated;
    targetColumnId;
    targetColumnName;
    positionAdjustments;
    notifiedUsers;
    success;
    canBeRestored;
    remainingColumnsInBoard;
    historyLogId;
}
exports.DeleteBoardColumnResponseDto = DeleteBoardColumnResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier of the deleted column',
        example: 'col-a8f5f167-aa89-4f26-a2b1-2b5e4b9b2c8a',
    }),
    __metadata("design:type", String)
], DeleteBoardColumnResponseDto.prototype, "columnId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Board ID where column was deleted',
        example: 'board-001',
    }),
    __metadata("design:type", String)
], DeleteBoardColumnResponseDto.prototype, "boardId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the deleted column',
        example: 'Testing',
    }),
    __metadata("design:type", String)
], DeleteBoardColumnResponseDto.prototype, "columnName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: delete_board_column_request_dto_1.ColumnDeleteMode,
        enumName: 'ColumnDeleteMode',
        example: delete_board_column_request_dto_1.ColumnDeleteMode.SOFT_DELETE,
        description: 'Type of deletion that was performed',
    }),
    __metadata("design:type", String)
], DeleteBoardColumnResponseDto.prototype, "deleteMode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User who performed the deletion',
        example: 'agent-001',
    }),
    __metadata("design:type", String)
], DeleteBoardColumnResponseDto.prototype, "deletedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when column was deleted',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], DeleteBoardColumnResponseDto.prototype, "deletedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reason for deleting the column',
        example: 'Column is redundant after workflow optimization',
        required: false,
    }),
    __metadata("design:type", String)
], DeleteBoardColumnResponseDto.prototype, "deleteReason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Position of deleted column in board',
        example: 2,
    }),
    __metadata("design:type", Number)
], DeleteBoardColumnResponseDto.prototype, "originalPosition", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of tasks that were in the column',
        example: 5,
    }),
    __metadata("design:type", Number)
], DeleteBoardColumnResponseDto.prototype, "tasksInColumn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of tasks that were relocated to other columns',
        example: 5,
    }),
    __metadata("design:type", Number)
], DeleteBoardColumnResponseDto.prototype, "tasksRelocated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Target column where tasks were moved (for merge operations)',
        example: 'col-b8f5f167-aa89-4f26-a2b1-2b5e4b9b2c8b',
        required: false,
    }),
    __metadata("design:type", String)
], DeleteBoardColumnResponseDto.prototype, "targetColumnId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of target column where tasks were moved',
        example: 'Done',
        required: false,
    }),
    __metadata("design:type", String)
], DeleteBoardColumnResponseDto.prototype, "targetColumnName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Columns that had their positions adjusted',
        type: [Object],
        example: [
            { columnId: 'col-c', oldPosition: 3, newPosition: 2 },
            { columnId: 'col-d', oldPosition: 4, newPosition: 3 },
        ],
    }),
    __metadata("design:type", Array)
], DeleteBoardColumnResponseDto.prototype, "positionAdjustments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of users who were notified about the deletion',
        example: ['agent-002', 'agent-003'],
        type: [String],
    }),
    __metadata("design:type", Array)
], DeleteBoardColumnResponseDto.prototype, "notifiedUsers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether deletion was successful',
        example: true,
    }),
    __metadata("design:type", Boolean)
], DeleteBoardColumnResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether column can be restored (for soft deletes)',
        example: true,
    }),
    __metadata("design:type", Boolean)
], DeleteBoardColumnResponseDto.prototype, "canBeRestored", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of columns remaining in board',
        example: 4,
    }),
    __metadata("design:type", Number)
], DeleteBoardColumnResponseDto.prototype, "remainingColumnsInBoard", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'History log ID for this deletion',
        example: 'b9f6f267-bb90-5f37-b3c2-3c6e5c0c3d9b',
    }),
    __metadata("design:type", String)
], DeleteBoardColumnResponseDto.prototype, "historyLogId", void 0);
//# sourceMappingURL=delete-board-column.response.dto.js.map