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
exports.FetchExternalContextQueryDto = exports.ExternalSourceType = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var ExternalSourceType;
(function (ExternalSourceType) {
    ExternalSourceType["CONFLUENCE"] = "confluence";
    ExternalSourceType["SLACK"] = "slack";
    ExternalSourceType["GITHUB"] = "github";
    ExternalSourceType["DOCUMENTATION"] = "documentation";
    ExternalSourceType["KNOWLEDGE_BASE"] = "knowledge_base";
    ExternalSourceType["PREVIOUS_TICKETS"] = "previous_tickets";
    ExternalSourceType["CODE_REPOSITORY"] = "code_repository";
    ExternalSourceType["API_DOCUMENTATION"] = "api_documentation";
})(ExternalSourceType || (exports.ExternalSourceType = ExternalSourceType = {}));
class FetchExternalContextQueryDto {
    sources;
    keywords;
    searchDepthDays = 30;
    includeRelatedProjects = false;
    maxResultsPerSource = 5;
}
exports.FetchExternalContextQueryDto = FetchExternalContextQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ExternalSourceType,
        enumName: 'ExternalSourceType',
        isArray: true,
        example: [ExternalSourceType.CONFLUENCE, ExternalSourceType.GITHUB],
        description: 'Типы внешних источников для сбора контекста',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(ExternalSourceType, { each: true }),
    (0, class_transformer_1.Transform)(({ value }) => (Array.isArray(value) ? value : [value])),
    __metadata("design:type", Array)
], FetchExternalContextQueryDto.prototype, "sources", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ключевые слова для поиска в внешних источниках',
        example: ['authentication', 'user management', 'API'],
        isArray: true,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_transformer_1.Transform)(({ value }) => (Array.isArray(value) ? value : [value])),
    __metadata("design:type", Array)
], FetchExternalContextQueryDto.prototype, "keywords", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Глубина поиска в днях (насколько далеко искать в истории)',
        example: 30,
        required: false,
        default: 30,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    __metadata("design:type", Number)
], FetchExternalContextQueryDto.prototype, "searchDepthDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Включить контекст из связанных проектов',
        example: true,
        required: false,
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true'),
    __metadata("design:type", Boolean)
], FetchExternalContextQueryDto.prototype, "includeRelatedProjects", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Максимальное количество результатов с каждого источника',
        example: 5,
        required: false,
        default: 5,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    __metadata("design:type", Number)
], FetchExternalContextQueryDto.prototype, "maxResultsPerSource", void 0);
//# sourceMappingURL=fetch-external-context.query.dto.js.map