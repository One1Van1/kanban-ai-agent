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
exports.GetTaskStatisticsResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class GetTaskStatisticsResponseDto {
    total;
    completed;
    failed;
    pending;
    processing;
    agentId;
    success;
    timestamp;
    constructor(statistics, agentId) {
        this.total = statistics.total;
        this.completed = statistics.completed;
        this.failed = statistics.failed;
        this.pending = statistics.pending;
        this.processing = statistics.processing;
        this.agentId = agentId;
        this.success = true;
        this.timestamp = new Date().toISOString();
    }
}
exports.GetTaskStatisticsResponseDto = GetTaskStatisticsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 150, description: 'Total number of task records' }),
    __metadata("design:type", Number)
], GetTaskStatisticsResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 120, description: 'Number of completed tasks' }),
    __metadata("design:type", Number)
], GetTaskStatisticsResponseDto.prototype, "completed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5, description: 'Number of failed tasks' }),
    __metadata("design:type", Number)
], GetTaskStatisticsResponseDto.prototype, "failed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 20, description: 'Number of pending tasks' }),
    __metadata("design:type", Number)
], GetTaskStatisticsResponseDto.prototype, "pending", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 5,
        description: 'Number of tasks currently being processed',
    }),
    __metadata("design:type", Number)
], GetTaskStatisticsResponseDto.prototype, "processing", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'agent-uuid',
        description: 'Agent ID filter applied (if any)',
        required: false,
    }),
    __metadata("design:type", String)
], GetTaskStatisticsResponseDto.prototype, "agentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Success status' }),
    __metadata("design:type", Boolean)
], GetTaskStatisticsResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-01-01T00:00:00.000Z',
        description: 'Response timestamp',
    }),
    __metadata("design:type", String)
], GetTaskStatisticsResponseDto.prototype, "timestamp", void 0);
//# sourceMappingURL=get-task-statistics.response.dto.js.map