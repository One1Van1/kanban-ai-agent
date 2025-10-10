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
exports.CreateBoardColumnRequestDto = exports.ColumnType = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var ColumnType;
(function (ColumnType) {
    ColumnType["TODO"] = "todo";
    ColumnType["IN_PROGRESS"] = "in_progress";
    ColumnType["IN_REVIEW"] = "in_review";
    ColumnType["DONE"] = "done";
    ColumnType["CUSTOM"] = "custom";
})(ColumnType || (exports.ColumnType = ColumnType = {}));
class CreateBoardColumnRequestDto {
    boardId;
    name;
    type;
    position;
    description;
    color;
    wipLimit;
    createdBy;
}
exports.CreateBoardColumnRequestDto = CreateBoardColumnRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Board ID to add column to',
        example: 'board-001',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBoardColumnRequestDto.prototype, "boardId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Column name',
        example: 'Ready for Testing',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBoardColumnRequestDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ColumnType,
        enumName: 'ColumnType',
        example: ColumnType.CUSTOM,
        description: 'Type of column',
    }),
    (0, class_validator_1.IsEnum)(ColumnType),
    __metadata("design:type", String)
], CreateBoardColumnRequestDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Position index in board (0-based)',
        example: 2,
        minimum: 0,
        maximum: 50,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(50),
    __metadata("design:type", Number)
], CreateBoardColumnRequestDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Column description',
        example: 'Tasks ready for QA testing',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBoardColumnRequestDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Column color code',
        example: '#4CAF50',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBoardColumnRequestDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Maximum number of tasks allowed in column (WIP limit)',
        example: 5,
        minimum: 1,
        maximum: 100,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateBoardColumnRequestDto.prototype, "wipLimit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User creating the column',
        example: 'agent-001',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBoardColumnRequestDto.prototype, "createdBy", void 0);
//# sourceMappingURL=create-board-column.request.dto.js.map