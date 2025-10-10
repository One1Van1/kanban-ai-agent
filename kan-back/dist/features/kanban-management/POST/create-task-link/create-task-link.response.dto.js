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
exports.CreateTaskLinkResponseDto = exports.TaskLinkDataDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class TaskLinkDataDto {
    id;
    sourceTaskId;
    targetTaskId;
    linkType;
    description;
    createdBy;
    createdAt;
    isActive;
}
exports.TaskLinkDataDto = TaskLinkDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Link identifier',
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    }),
    __metadata("design:type", String)
], TaskLinkDataDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Source task ID',
        example: 'TASK-123',
    }),
    __metadata("design:type", String)
], TaskLinkDataDto.prototype, "sourceTaskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Target task ID',
        example: 'TASK-456',
    }),
    __metadata("design:type", String)
], TaskLinkDataDto.prototype, "targetTaskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of link relationship',
        example: 'blocks',
    }),
    __metadata("design:type", String)
], TaskLinkDataDto.prototype, "linkType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Optional description of the link',
        example: 'This task must be completed before the target task can start',
        required: false,
    }),
    __metadata("design:type", String)
], TaskLinkDataDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User who created the link',
        example: 'agent-001',
    }),
    __metadata("design:type", String)
], TaskLinkDataDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'When the link was created',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], TaskLinkDataDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the link is currently active',
        example: true,
    }),
    __metadata("design:type", Boolean)
], TaskLinkDataDto.prototype, "isActive", void 0);
class CreateTaskLinkResponseDto {
    success;
    data;
    message;
}
exports.CreateTaskLinkResponseDto = CreateTaskLinkResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indicates if the request was successful',
        example: true,
    }),
    __metadata("design:type", Boolean)
], CreateTaskLinkResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: TaskLinkDataDto,
        description: 'Created task link data',
    }),
    __metadata("design:type", TaskLinkDataDto)
], CreateTaskLinkResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Response message',
        example: 'Task link created successfully',
    }),
    __metadata("design:type", String)
], CreateTaskLinkResponseDto.prototype, "message", void 0);
//# sourceMappingURL=create-task-link.response.dto.js.map