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
exports.UpdateBoardColumnResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const update_board_column_request_dto_1 = require("./update-board-column.request.dto");
class UpdateBoardColumnResponseDto {
    columnId;
    boardId;
    name;
    type;
    position;
    description;
    color;
    wipLimit;
    isActive;
    updatedBy;
    updatedAt;
    fieldsUpdated;
    previousValues;
    positionChanges;
    updateComment;
    success;
    version;
    currentTaskCount;
    historyLogId;
}
exports.UpdateBoardColumnResponseDto = UpdateBoardColumnResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier of the updated column',
        example: 'col-a8f5f167-aa89-4f26-a2b1-2b5e4b9b2c8a',
    }),
    __metadata("design:type", String)
], UpdateBoardColumnResponseDto.prototype, "columnId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Board ID where column belongs',
        example: 'board-001',
    }),
    __metadata("design:type", String)
], UpdateBoardColumnResponseDto.prototype, "boardId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated column name',
        example: 'Ready for QA Testing',
    }),
    __metadata("design:type", String)
], UpdateBoardColumnResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: update_board_column_request_dto_1.ColumnType,
        enumName: 'ColumnType',
        example: update_board_column_request_dto_1.ColumnType.CUSTOM,
        description: 'Updated column type',
    }),
    __metadata("design:type", String)
], UpdateBoardColumnResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated position index in board (0-based)',
        example: 3,
    }),
    __metadata("design:type", Number)
], UpdateBoardColumnResponseDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated column description',
        example: 'Tasks that are ready for quality assurance testing',
        required: false,
    }),
    __metadata("design:type", String)
], UpdateBoardColumnResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated column color code',
        example: '#2196F3',
        required: false,
    }),
    __metadata("design:type", String)
], UpdateBoardColumnResponseDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated WIP (Work In Progress) limit',
        example: 8,
        required: false,
    }),
    __metadata("design:type", Number)
], UpdateBoardColumnResponseDto.prototype, "wipLimit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether column is active',
        example: true,
    }),
    __metadata("design:type", Boolean)
], UpdateBoardColumnResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User who performed the update',
        example: 'agent-001',
    }),
    __metadata("design:type", String)
], UpdateBoardColumnResponseDto.prototype, "updatedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when column was updated',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], UpdateBoardColumnResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of fields that were updated',
        example: ['name', 'wipLimit', 'color'],
        type: [String],
    }),
    __metadata("design:type", Array)
], UpdateBoardColumnResponseDto.prototype, "fieldsUpdated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Previous values before update',
        example: {
            name: 'Testing',
            wipLimit: 5,
            color: '#4CAF50',
        },
    }),
    __metadata("design:type", Object)
], UpdateBoardColumnResponseDto.prototype, "previousValues", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Position change information if position was updated',
        required: false,
        example: {
            from: 2,
            to: 3,
            affectedColumns: ['col-1', 'col-2'],
        },
    }),
    __metadata("design:type", Object)
], UpdateBoardColumnResponseDto.prototype, "positionChanges", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Comment about the column update',
        example: 'Updated WIP limit to improve flow efficiency',
        required: false,
    }),
    __metadata("design:type", String)
], UpdateBoardColumnResponseDto.prototype, "updateComment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether update was successful',
        example: true,
    }),
    __metadata("design:type", Boolean)
], UpdateBoardColumnResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current column version after update',
        example: 2,
    }),
    __metadata("design:type", Number)
], UpdateBoardColumnResponseDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of tasks currently in this column',
        example: 3,
    }),
    __metadata("design:type", Number)
], UpdateBoardColumnResponseDto.prototype, "currentTaskCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'History log ID for this update',
        example: 'b9f6f267-bb90-5f37-b3c2-3c6e5c0c3d9b',
    }),
    __metadata("design:type", String)
], UpdateBoardColumnResponseDto.prototype, "historyLogId", void 0);
//# sourceMappingURL=update-board-column.response.dto.js.map