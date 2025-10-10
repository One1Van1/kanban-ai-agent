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
exports.AnalyzeBeforeAfterPhotosResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class AnalyzeBeforeAfterPhotosResponseDto {
    success;
    taskKey;
    message;
    analysis;
    processedAt;
    constructor(success, taskKey, message, analysis) {
        this.success = success;
        this.taskKey = taskKey;
        this.message = message;
        this.analysis = analysis;
        this.processedAt = new Date().toISOString();
    }
}
exports.AnalyzeBeforeAfterPhotosResponseDto = AnalyzeBeforeAfterPhotosResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Успешность выполнения анализа',
        example: true,
    }),
    __metadata("design:type", Boolean)
], AnalyzeBeforeAfterPhotosResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ключ задачи',
        example: 'KAN-123',
    }),
    __metadata("design:type", String)
], AnalyzeBeforeAfterPhotosResponseDto.prototype, "taskKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Сообщение о результате',
        example: 'Before/after analysis completed successfully',
    }),
    __metadata("design:type", String)
], AnalyzeBeforeAfterPhotosResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Результат анализа фото',
        example: {
            detectedCategory: 'Женская стрижка',
            qualityScore: 85,
            improvements: ['Аккуратность линий', 'Общая форма'],
            compliance: true,
            notes: 'Качественная работа',
            confidenceLevel: 90,
        },
    }),
    __metadata("design:type", Object)
], AnalyzeBeforeAfterPhotosResponseDto.prototype, "analysis", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Время обработки',
        example: '2024-01-20T12:00:00Z',
    }),
    __metadata("design:type", String)
], AnalyzeBeforeAfterPhotosResponseDto.prototype, "processedAt", void 0);
//# sourceMappingURL=analyze-before-after-photos.response.dto.js.map