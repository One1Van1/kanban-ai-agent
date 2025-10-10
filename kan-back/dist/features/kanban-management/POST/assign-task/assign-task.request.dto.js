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
exports.AssignTaskRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class AssignTaskRequestDto {
    assigneeEmail;
    assigneeName;
    assignedByEmail;
    assignedByName;
    assignmentMessage;
    context;
    agentId;
    triggerType = 'manual';
}
exports.AssignTaskRequestDto = AssignTaskRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'john.doe@example.com',
        description: 'Email of the person to assign the task to',
        maxLength: 255,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], AssignTaskRequestDto.prototype, "assigneeEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'John Doe',
        description: 'Name of the person to assign the task to',
        maxLength: 255,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], AssignTaskRequestDto.prototype, "assigneeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'jane.doe@example.com',
        description: 'Email of the person assigning the task',
        maxLength: 255,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], AssignTaskRequestDto.prototype, "assignedByEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Jane Doe',
        description: 'Name of the person assigning the task',
        maxLength: 255,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], AssignTaskRequestDto.prototype, "assignedByName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Назначаю тебе эту задачу, так как у тебя больше опыта в этой области.',
        description: 'Optional message for the assignment',
        maxLength: 1000,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], AssignTaskRequestDto.prototype, "assignmentMessage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            priority: 'high',
            department: 'backend',
            estimatedHours: 8,
        },
        description: 'Additional context for the assignment',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], AssignTaskRequestDto.prototype, "context", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'uuid-agent-123',
        description: 'ID of the agent performing this assignment',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignTaskRequestDto.prototype, "agentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'agent_instruction',
        description: 'What triggered this assignment',
        required: false,
        default: 'manual',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignTaskRequestDto.prototype, "triggerType", void 0);
//# sourceMappingURL=assign-task.request.dto.js.map