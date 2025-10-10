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
exports.AddTaskCommentRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class AddTaskCommentRequestDto {
    comment;
    authorEmail;
    authorName;
    context;
    agentId;
    triggerType = 'manual';
}
exports.AddTaskCommentRequestDto = AddTaskCommentRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Работа над задачей начата. Планирую завершить до конца дня.',
        description: 'Comment text content',
        minLength: 1,
        maxLength: 2000,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], AddTaskCommentRequestDto.prototype, "comment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'john.doe@example.com',
        description: 'Email of the person adding the comment',
        maxLength: 255,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], AddTaskCommentRequestDto.prototype, "authorEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'John Doe',
        description: 'Name of the person adding the comment',
        maxLength: 255,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], AddTaskCommentRequestDto.prototype, "authorName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            commentType: 'status_update',
            visibility: 'public',
            priority: 'normal',
        },
        description: 'Additional context for the comment',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], AddTaskCommentRequestDto.prototype, "context", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'uuid-agent-123',
        description: 'ID of the agent adding this comment',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddTaskCommentRequestDto.prototype, "agentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'agent_instruction',
        description: 'What triggered this comment creation',
        required: false,
        default: 'manual',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddTaskCommentRequestDto.prototype, "triggerType", void 0);
//# sourceMappingURL=add-task-comment.request.dto.js.map