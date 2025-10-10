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
exports.GetReportConfigResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class GetReportConfigResponseDto {
    service;
    supportedDateFormats;
    defaultDateRange;
    reportTypes;
    constructor(service, supportedDateFormats, defaultDateRange, reportTypes) {
        this.service = service;
        this.supportedDateFormats = supportedDateFormats;
        this.defaultDateRange = defaultDateRange;
        this.reportTypes = reportTypes;
    }
}
exports.GetReportConfigResponseDto = GetReportConfigResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Service name',
        example: 'AI Reporting Agent - Generate Report',
    }),
    __metadata("design:type", String)
], GetReportConfigResponseDto.prototype, "service", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Supported date formats',
        isArray: true,
        example: [
            'со вчера до сегодня',
            'за прошлую неделю',
            'DD.MM.YYYY - DD.MM.YYYY',
        ],
    }),
    __metadata("design:type", Array)
], GetReportConfigResponseDto.prototype, "supportedDateFormats", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Default date range',
        example: 'last 7 days',
    }),
    __metadata("design:type", String)
], GetReportConfigResponseDto.prototype, "defaultDateRange", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Available report types',
        isArray: true,
        example: ['haircut_statistics', 'quality_analysis', 'performance_trends'],
    }),
    __metadata("design:type", Array)
], GetReportConfigResponseDto.prototype, "reportTypes", void 0);
//# sourceMappingURL=get-report-config.response.dto.js.map