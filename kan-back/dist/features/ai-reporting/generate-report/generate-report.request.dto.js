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
exports.GenerateReportRequestDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class GenerateReportRequestDto {
    taskKey;
    dateRange;
    assigneeEmail;
}
exports.GenerateReportRequestDto = GenerateReportRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Task key for the report request',
        example: 'KAN-33',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateReportRequestDto.prototype, "taskKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date range description in free form',
        example: 'со вчера до вторника',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateReportRequestDto.prototype, "dateRange", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Assignee email who requested the report',
        example: 'ai-report-maker@example.com',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateReportRequestDto.prototype, "assigneeEmail", void 0);
//# sourceMappingURL=generate-report.request.dto.js.map