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
exports.DeleteTaskLinkResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class DeleteTaskLinkResponseDto {
    taskId;
    linkId;
    linkedTaskId;
    linkType;
    linkDirection;
    deletedBy;
    deletedAt;
    deleteReason;
    linkedTaskTitle;
    remainingLinksCount;
    success;
    historyLogId;
}
exports.DeleteTaskLinkResponseDto = DeleteTaskLinkResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of the task containing the link',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], DeleteTaskLinkResponseDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of the deleted link',
        example: 'link-456e7890-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], DeleteTaskLinkResponseDto.prototype, "linkId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of the linked task that was disconnected',
        example: '789e1234-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], DeleteTaskLinkResponseDto.prototype, "linkedTaskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of link that was deleted',
        example: 'blocks',
    }),
    __metadata("design:type", String)
], DeleteTaskLinkResponseDto.prototype, "linkType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Direction of the link (outbound/inbound)',
        example: 'outbound',
    }),
    __metadata("design:type", String)
], DeleteTaskLinkResponseDto.prototype, "linkDirection", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User who deleted the link',
        example: 'user-123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], DeleteTaskLinkResponseDto.prototype, "deletedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when link was deleted',
        example: '2024-01-15T10:30:00.000Z',
    }),
    __metadata("design:type", Date)
], DeleteTaskLinkResponseDto.prototype, "deletedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reason for deleting the link',
        example: 'Link is no longer relevant after task completion',
    }),
    __metadata("design:type", String)
], DeleteTaskLinkResponseDto.prototype, "deleteReason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Title of the task that was unlinked',
        example: 'Setup database configuration',
    }),
    __metadata("design:type", String)
], DeleteTaskLinkResponseDto.prototype, "linkedTaskTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of remaining links on the task',
        example: 3,
    }),
    __metadata("design:type", Number)
], DeleteTaskLinkResponseDto.prototype, "remainingLinksCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the operation was successful',
        example: true,
    }),
    __metadata("design:type", Boolean)
], DeleteTaskLinkResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'History log entry ID for audit trail',
        example: 'hist-789e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], DeleteTaskLinkResponseDto.prototype, "historyLogId", void 0);
//# sourceMappingURL=delete-task-link.response.dto.js.map