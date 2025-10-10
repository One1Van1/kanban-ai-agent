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
exports.UpdateBoardColumnRequestDto = exports.ColumnType = void 0;
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
class UpdateBoardColumnRequestDto {
    name;
    type;
    position;
    description;
    color;
    wipLimit;
    isActive;
    updatedBy;
    updateComment;
}
exports.UpdateBoardColumnRequestDto = UpdateBoardColumnRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated column name',
        example: 'Ready for QA Testing',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBoardColumnRequestDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ColumnType,
        enumName: 'ColumnType',
        example: ColumnType.CUSTOM,
        description: 'Updated column type',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ColumnType),
    __metadata("design:type", String)
], UpdateBoardColumnRequestDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated position index in board (0-based)',
        example: 3,
        minimum: 0,
        maximum: 50,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(50),
    __metadata("design:type", Number)
], UpdateBoardColumnRequestDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated column description',
        example: 'Tasks that are ready for quality assurance testing',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBoardColumnRequestDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated column color code',
        example: '#2196F3',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBoardColumnRequestDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated WIP (Work In Progress) limit',
        example: 8,
        minimum: 1,
        maximum: 100,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], UpdateBoardColumnRequestDto.prototype, "wipLimit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether column is active',
        example: true,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateBoardColumnRequestDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User performing the update',
        example: 'agent-001',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBoardColumnRequestDto.prototype, "updatedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Comment about the column update',
        example: 'Updated WIP limit to improve flow efficiency',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBoardColumnRequestDto.prototype, "updateComment", void 0);
//# sourceMappingURL=update-board-column.request.dto.js.map