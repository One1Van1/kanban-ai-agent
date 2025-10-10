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
exports.ReorderBoardColumnsResponseDto = exports.BoardLayoutDto = exports.ReorderedColumnDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ReorderedColumnDto {
    columnId;
    columnName;
    previousPosition;
    newPosition;
    positionChanged;
}
exports.ReorderedColumnDto = ReorderedColumnDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of the column',
        example: 'col-123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], ReorderedColumnDto.prototype, "columnId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the column',
        example: 'To Do',
    }),
    __metadata("design:type", String)
], ReorderedColumnDto.prototype, "columnName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Previous position of the column',
        example: 2,
    }),
    __metadata("design:type", Number)
], ReorderedColumnDto.prototype, "previousPosition", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New position of the column',
        example: 0,
    }),
    __metadata("design:type", Number)
], ReorderedColumnDto.prototype, "newPosition", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the position actually changed',
        example: true,
    }),
    __metadata("design:type", Boolean)
], ReorderedColumnDto.prototype, "positionChanged", void 0);
class BoardLayoutDto {
    boardId;
    boardName;
    totalColumns;
    columns;
}
exports.BoardLayoutDto = BoardLayoutDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of the board',
        example: 'board-123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], BoardLayoutDto.prototype, "boardId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the board',
        example: 'Project Kanban Board',
    }),
    __metadata("design:type", String)
], BoardLayoutDto.prototype, "boardName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of columns',
        example: 4,
    }),
    __metadata("design:type", Number)
], BoardLayoutDto.prototype, "totalColumns", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [ReorderedColumnDto],
        description: 'Array of all columns in their new order',
    }),
    __metadata("design:type", Array)
], BoardLayoutDto.prototype, "columns", void 0);
class ReorderBoardColumnsResponseDto {
    boardId;
    userId;
    userName;
    reorderedAt;
    reorderReason;
    columnsChanged;
    boardLayout;
    success;
    historyLogId;
    changesSummary;
    previousOrder;
    newOrder;
}
exports.ReorderBoardColumnsResponseDto = ReorderBoardColumnsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of the board that was reordered',
        example: 'board-123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], ReorderBoardColumnsResponseDto.prototype, "boardId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of the user who performed the reorder',
        example: 'user-123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], ReorderBoardColumnsResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Display name of the user who reordered',
        example: 'John Doe',
    }),
    __metadata("design:type", String)
], ReorderBoardColumnsResponseDto.prototype, "userName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when the reorder was completed',
        example: '2024-01-15T10:30:00.000Z',
    }),
    __metadata("design:type", Date)
], ReorderBoardColumnsResponseDto.prototype, "reorderedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reason provided for the reorder',
        example: 'Reorganizing workflow to match new process',
    }),
    __metadata("design:type", String)
], ReorderBoardColumnsResponseDto.prototype, "reorderReason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of columns that actually changed position',
        example: 2,
    }),
    __metadata("design:type", Number)
], ReorderBoardColumnsResponseDto.prototype, "columnsChanged", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: BoardLayoutDto,
        description: 'Complete board layout after reordering',
    }),
    __metadata("design:type", BoardLayoutDto)
], ReorderBoardColumnsResponseDto.prototype, "boardLayout", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the operation was successful',
        example: true,
    }),
    __metadata("design:type", Boolean)
], ReorderBoardColumnsResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'History log entry ID for audit trail',
        example: 'hist-789e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], ReorderBoardColumnsResponseDto.prototype, "historyLogId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Summary of changes made',
        example: 'Reordered 4 columns: moved "To Do" from position 2 to 0, "In Progress" from position 0 to 1',
    }),
    __metadata("design:type", String)
], ReorderBoardColumnsResponseDto.prototype, "changesSummary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Previous column order (positions before reorder)',
        example: [2, 0, 1, 3],
    }),
    __metadata("design:type", Array)
], ReorderBoardColumnsResponseDto.prototype, "previousOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New column order (positions after reorder)',
        example: [0, 1, 2, 3],
    }),
    __metadata("design:type", Array)
], ReorderBoardColumnsResponseDto.prototype, "newOrder", void 0);
//# sourceMappingURL=reorder-board-columns.response.dto.js.map