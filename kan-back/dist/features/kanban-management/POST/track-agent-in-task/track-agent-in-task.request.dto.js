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
exports.TrackAgentInTaskRequestDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class TrackAgentInTaskRequestDto {
    taskId;
    boardId;
    columnId;
    columnName;
    taskData;
    triggerType;
}
exports.TrackAgentInTaskRequestDto = TrackAgentInTaskRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Task ID from external system (e.g., Jira)',
        example: 'PROJ-123',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TrackAgentInTaskRequestDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Board ID where task is located',
        example: 'board-456',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TrackAgentInTaskRequestDto.prototype, "boardId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Column ID where task is currently located',
        example: 'col-789',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TrackAgentInTaskRequestDto.prototype, "columnId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Column name for better readability',
        example: 'To Do',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TrackAgentInTaskRequestDto.prototype, "columnName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional task data for context' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], TrackAgentInTaskRequestDto.prototype, "taskData", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Trigger type that caused this tracking',
        example: 'task_moved_to_column',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TrackAgentInTaskRequestDto.prototype, "triggerType", void 0);
//# sourceMappingURL=track-agent-in-task.request.dto.js.map