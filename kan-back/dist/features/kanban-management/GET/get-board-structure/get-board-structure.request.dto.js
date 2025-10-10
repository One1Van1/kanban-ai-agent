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
exports.GetBoardStructureRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class GetBoardStructureRequestDto {
    boardId;
    includeTaskCounts = true;
    includeMetadata = false;
    includeStatusTransitions = true;
    includeSampleTasks = false;
    sampleTasksLimit = 3;
    agentId;
    purpose;
}
exports.GetBoardStructureRequestDto = GetBoardStructureRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'project-alpha',
        description: 'Filter structure by specific board/project ID',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetBoardStructureRequestDto.prototype, "boardId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Include task counts for each column',
        required: false,
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GetBoardStructureRequestDto.prototype, "includeTaskCounts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: false,
        description: 'Include detailed column metadata (WIP limits, etc.)',
        required: false,
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GetBoardStructureRequestDto.prototype, "includeMetadata", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Include available status transitions for each column',
        required: false,
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GetBoardStructureRequestDto.prototype, "includeStatusTransitions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: false,
        description: 'Include sample tasks for each column (for AI context)',
        required: false,
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GetBoardStructureRequestDto.prototype, "includeSampleTasks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 3,
        description: 'Number of sample tasks to include per column (if includeSampleTasks=true)',
        minimum: 1,
        maximum: 10,
        required: false,
        default: 3,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], GetBoardStructureRequestDto.prototype, "sampleTasksLimit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'uuid-agent-123',
        description: 'ID of the agent requesting board structure',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetBoardStructureRequestDto.prototype, "agentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'task_assignment',
        description: 'Context of why board structure is needed',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetBoardStructureRequestDto.prototype, "purpose", void 0);
//# sourceMappingURL=get-board-structure.request.dto.js.map