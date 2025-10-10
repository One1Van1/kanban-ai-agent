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
exports.DeleteTaskLinkRequestDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class DeleteTaskLinkRequestDto {
    deletedBy;
    deleteReason;
}
exports.DeleteTaskLinkRequestDto = DeleteTaskLinkRequestDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User performing the link deletion',
        example: 'user-123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DeleteTaskLinkRequestDto.prototype, "deletedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reason for deleting the task link',
        example: 'Link is no longer relevant after task completion',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DeleteTaskLinkRequestDto.prototype, "deleteReason", void 0);
//# sourceMappingURL=delete-task-link.request.dto.js.map