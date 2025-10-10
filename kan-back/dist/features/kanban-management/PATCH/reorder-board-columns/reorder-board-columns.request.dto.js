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
exports.ReorderBoardColumnsRequestDto = exports.ColumnOrderDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class ColumnOrderDto {
    columnId;
    position;
    columnName;
}
exports.ColumnOrderDto = ColumnOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of the column',
        example: 'col-123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ColumnOrderDto.prototype, "columnId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New position index for the column (0-based)',
        example: 0,
        minimum: 0,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], ColumnOrderDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Column name for reference (optional)',
        example: 'To Do',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ColumnOrderDto.prototype, "columnName", void 0);
class ReorderBoardColumnsRequestDto {
    boardId;
    columnOrder;
    userId;
    reorderReason;
    validateComplete = true;
}
exports.ReorderBoardColumnsRequestDto = ReorderBoardColumnsRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of the board to reorder columns for',
        example: 'board-123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ReorderBoardColumnsRequestDto.prototype, "boardId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [ColumnOrderDto],
        description: 'Array of columns with their new positions',
        example: [
            { columnId: 'col-1', position: 0, columnName: 'Backlog' },
            { columnId: 'col-2', position: 1, columnName: 'To Do' },
            { columnId: 'col-3', position: 2, columnName: 'In Progress' },
            { columnId: 'col-4', position: 3, columnName: 'Done' },
        ],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ColumnOrderDto),
    __metadata("design:type", Array)
], ReorderBoardColumnsRequestDto.prototype, "columnOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of the user performing the reorder',
        example: 'user-123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ReorderBoardColumnsRequestDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reason for reordering columns',
        example: 'Reorganizing workflow to match new process',
        maxLength: 500,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReorderBoardColumnsRequestDto.prototype, "reorderReason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether to validate that all board columns are included',
        example: true,
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ReorderBoardColumnsRequestDto.prototype, "validateComplete", void 0);
//# sourceMappingURL=reorder-board-columns.request.dto.js.map