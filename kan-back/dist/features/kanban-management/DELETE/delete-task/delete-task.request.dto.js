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
exports.DeleteTaskRequestDto = exports.DeleteMode = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var DeleteMode;
(function (DeleteMode) {
    DeleteMode["SOFT_DELETE"] = "soft_delete";
    DeleteMode["HARD_DELETE"] = "hard_delete";
    DeleteMode["ARCHIVE"] = "archive";
})(DeleteMode || (exports.DeleteMode = DeleteMode = {}));
class DeleteTaskRequestDto {
    deleteMode = DeleteMode.SOFT_DELETE;
    deletedBy;
    deleteReason;
    forceDelete = false;
    deleteRelatedData = true;
    notifyUsers = true;
}
exports.DeleteTaskRequestDto = DeleteTaskRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: DeleteMode,
        enumName: 'DeleteMode',
        example: DeleteMode.SOFT_DELETE,
        description: 'Type of deletion to perform',
        required: false,
        default: DeleteMode.SOFT_DELETE,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(DeleteMode),
    __metadata("design:type", String)
], DeleteTaskRequestDto.prototype, "deleteMode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User performing the deletion',
        example: 'agent-001',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DeleteTaskRequestDto.prototype, "deletedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reason for deleting the task',
        example: 'Task is no longer relevant due to requirement changes',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DeleteTaskRequestDto.prototype, "deleteReason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether to force delete even if task has dependencies',
        example: false,
        required: false,
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], DeleteTaskRequestDto.prototype, "forceDelete", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether to delete related attachments and comments',
        example: true,
        required: false,
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], DeleteTaskRequestDto.prototype, "deleteRelatedData", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether to notify watchers and assignees about deletion',
        example: true,
        required: false,
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], DeleteTaskRequestDto.prototype, "notifyUsers", void 0);
//# sourceMappingURL=delete-task.request.dto.js.map