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
exports.CreateTaskRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateTaskRequestDto {
    taskKey;
    taskTitle;
    initialColumn;
    initialStatus = 'pending';
    context;
    agentId;
}
exports.CreateTaskRequestDto = CreateTaskRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'PROJ-123',
        description: 'Unique task key/identifier',
        minLength: 1,
        maxLength: 255,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateTaskRequestDto.prototype, "taskKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Fix user authentication bug',
        description: 'Task title/summary',
        minLength: 1,
        maxLength: 500,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateTaskRequestDto.prototype, "taskTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'To Do',
        description: 'Initial column for the task',
        maxLength: 255,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateTaskRequestDto.prototype, "initialColumn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'pending',
        description: 'Initial task status',
        maxLength: 100,
        required: false,
        default: 'pending',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateTaskRequestDto.prototype, "initialStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: { priority: 'high', assignee: 'john.doe@example.com' },
        description: 'Additional context and metadata for the task',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateTaskRequestDto.prototype, "context", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'uuid-agent-123',
        description: 'ID of the agent creating this task',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTaskRequestDto.prototype, "agentId", void 0);
//# sourceMappingURL=create-task.request.dto.js.map