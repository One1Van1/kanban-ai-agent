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
exports.CreateBoardColumnResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_board_column_request_dto_1 = require("./create-board-column.request.dto");
class CreateBoardColumnResponseDto {
    columnId;
    boardId;
    name;
    type;
    position;
    description;
    color;
    wipLimit;
    createdBy;
    createdAt;
    success;
    totalColumnsInBoard;
    adjacentColumns;
    historyLogId;
}
exports.CreateBoardColumnResponseDto = CreateBoardColumnResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier of the created column',
        example: 'col-a8f5f167-aa89-4f26-a2b1-2b5e4b9b2c8a',
    }),
    __metadata("design:type", String)
], CreateBoardColumnResponseDto.prototype, "columnId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Board ID where column was created',
        example: 'board-001',
    }),
    __metadata("design:type", String)
], CreateBoardColumnResponseDto.prototype, "boardId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Column name',
        example: 'Ready for Testing',
    }),
    __metadata("design:type", String)
], CreateBoardColumnResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: create_board_column_request_dto_1.ColumnType,
        enumName: 'ColumnType',
        example: create_board_column_request_dto_1.ColumnType.CUSTOM,
        description: 'Type of column',
    }),
    __metadata("design:type", String)
], CreateBoardColumnResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Position index in board (0-based)',
        example: 2,
    }),
    __metadata("design:type", Number)
], CreateBoardColumnResponseDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Column description',
        example: 'Tasks ready for QA testing',
        required: false,
    }),
    __metadata("design:type", String)
], CreateBoardColumnResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Column color code',
        example: '#4CAF50',
        required: false,
    }),
    __metadata("design:type", String)
], CreateBoardColumnResponseDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Maximum number of tasks allowed in column (WIP limit)',
        example: 5,
        required: false,
    }),
    __metadata("design:type", Number)
], CreateBoardColumnResponseDto.prototype, "wipLimit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User who created the column',
        example: 'agent-001',
    }),
    __metadata("design:type", String)
], CreateBoardColumnResponseDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Column creation timestamp',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], CreateBoardColumnResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether column creation was successful',
        example: true,
    }),
    __metadata("design:type", Boolean)
], CreateBoardColumnResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of columns in board after creation',
        example: 5,
    }),
    __metadata("design:type", Number)
], CreateBoardColumnResponseDto.prototype, "totalColumnsInBoard", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Adjacent column information',
        example: {
            before: 'In Progress',
            after: 'Done',
        },
        required: false,
    }),
    __metadata("design:type", Object)
], CreateBoardColumnResponseDto.prototype, "adjacentColumns", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'History log ID for this column creation',
        example: 'b9f6f267-bb90-5f37-b3c2-3c6e5c0c3d9b',
    }),
    __metadata("design:type", String)
], CreateBoardColumnResponseDto.prototype, "historyLogId", void 0);
//# sourceMappingURL=create-board-column.response.dto.js.map