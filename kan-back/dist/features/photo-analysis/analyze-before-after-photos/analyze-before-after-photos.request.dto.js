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
exports.AnalyzeBeforeAfterPhotosRequestDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class AnalyzeBeforeAfterPhotosRequestDto {
    taskKey;
    beforePhoto;
    afterPhoto;
    declaredCategory;
}
exports.AnalyzeBeforeAfterPhotosRequestDto = AnalyzeBeforeAfterPhotosRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ключ задачи в Jira',
        example: 'KAN-123',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AnalyzeBeforeAfterPhotosRequestDto.prototype, "taskKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Base64 содержимое фото ДО стрижки',
        example: '/9j/4AAQSkZJRgABAQEAYABgAAD...',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AnalyzeBeforeAfterPhotosRequestDto.prototype, "beforePhoto", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Base64 содержимое фото ПОСЛЕ стрижки',
        example: '/9j/4AAQSkZJRgABAQEAYABgAAD...',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AnalyzeBeforeAfterPhotosRequestDto.prototype, "afterPhoto", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Заявленная категория стрижки',
        example: 'Женская стрижка',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AnalyzeBeforeAfterPhotosRequestDto.prototype, "declaredCategory", void 0);
//# sourceMappingURL=analyze-before-after-photos.request.dto.js.map