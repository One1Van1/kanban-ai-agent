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
exports.AddTaskTimelogRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class AddTaskTimelogRequestDto {
    description;
    timeSpentMinutes;
    startTime;
    endTime;
    userId;
    notes;
}
exports.AddTaskTimelogRequestDto = AddTaskTimelogRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Description of work performed',
        example: 'Implemented user authentication module',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddTaskTimelogRequestDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Time spent in minutes',
        example: 120,
        minimum: 1,
        maximum: 1440,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(1440),
    __metadata("design:type", Number)
], AddTaskTimelogRequestDto.prototype, "timeSpentMinutes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'When work started (ISO string)',
        example: '2024-01-15T09:00:00Z',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AddTaskTimelogRequestDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'When work ended (ISO string)',
        example: '2024-01-15T11:00:00Z',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AddTaskTimelogRequestDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID who performed the work',
        example: 'agent-001',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddTaskTimelogRequestDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional notes or context',
        example: 'Used TDD approach, included unit tests',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddTaskTimelogRequestDto.prototype, "notes", void 0);
//# sourceMappingURL=add-task-timelog.request.dto.js.map