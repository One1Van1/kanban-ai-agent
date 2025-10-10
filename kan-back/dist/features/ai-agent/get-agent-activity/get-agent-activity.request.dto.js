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
exports.GetAgentActivityRequestDto = exports.ActivityResultFilter = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var ActivityResultFilter;
(function (ActivityResultFilter) {
    ActivityResultFilter["ALL"] = "all";
    ActivityResultFilter["SUCCESS"] = "success";
    ActivityResultFilter["ERROR"] = "error";
    ActivityResultFilter["PENDING"] = "pending";
})(ActivityResultFilter || (exports.ActivityResultFilter = ActivityResultFilter = {}));
class GetAgentActivityRequestDto {
    agentId;
    limit = 10;
    offset = 0;
    result = ActivityResultFilter.ALL;
    taskId;
    fromDate;
    toDate;
}
exports.GetAgentActivityRequestDto = GetAgentActivityRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'agent_123',
        description: 'ID of the AI agent to get activity for',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetAgentActivityRequestDto.prototype, "agentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 10,
        description: 'Number of activities to return',
        minimum: 1,
        maximum: 100,
        default: 10,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], GetAgentActivityRequestDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 0,
        description: 'Number of activities to skip (for pagination)',
        minimum: 0,
        default: 0,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], GetAgentActivityRequestDto.prototype, "offset", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ActivityResultFilter,
        enumName: 'ActivityResultFilter',
        example: ActivityResultFilter.ALL,
        description: 'Filter activities by result status',
        default: ActivityResultFilter.ALL,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ActivityResultFilter),
    __metadata("design:type", String)
], GetAgentActivityRequestDto.prototype, "result", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'task_456',
        description: 'Filter activities by specific task ID',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetAgentActivityRequestDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2023-12-01',
        description: 'Filter activities from this date (YYYY-MM-DD)',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetAgentActivityRequestDto.prototype, "fromDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2023-12-07',
        description: 'Filter activities to this date (YYYY-MM-DD)',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetAgentActivityRequestDto.prototype, "toDate", void 0);
//# sourceMappingURL=get-agent-activity.request.dto.js.map