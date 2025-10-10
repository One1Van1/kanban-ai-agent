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
exports.MoveTaskRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class MoveTaskRequestDto {
    targetColumn;
    newStatus;
    context;
    agentId;
    triggerType = 'manual';
}
exports.MoveTaskRequestDto = MoveTaskRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'In Progress',
        description: 'Target column to move the task to',
        maxLength: 255,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], MoveTaskRequestDto.prototype, "targetColumn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'in_progress',
        description: 'New status for the task',
        maxLength: 255,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], MoveTaskRequestDto.prototype, "newStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            reason: 'Starting work on this task',
            assignee: 'john.doe@example.com',
        },
        description: 'Additional context for the move operation',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], MoveTaskRequestDto.prototype, "context", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'uuid-agent-123',
        description: 'ID of the agent performing this move',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MoveTaskRequestDto.prototype, "agentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'agent_instruction',
        description: 'What triggered this move',
        required: false,
        default: 'manual',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MoveTaskRequestDto.prototype, "triggerType", void 0);
//# sourceMappingURL=move-task-request.dto.js.map