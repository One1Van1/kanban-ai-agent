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
exports.GetReportHealthResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class GetReportHealthResponseDto {
    status;
    timestamp;
    service;
    constructor(status, timestamp, service) {
        this.status = status;
        this.timestamp = timestamp;
        this.service = service;
    }
}
exports.GetReportHealthResponseDto = GetReportHealthResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Service health status',
        example: 'healthy',
    }),
    __metadata("design:type", String)
], GetReportHealthResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current timestamp',
        example: '2025-10-04T10:30:00.000Z',
    }),
    __metadata("design:type", String)
], GetReportHealthResponseDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Service name',
        example: 'AI Reporting Agent - Generate Report',
    }),
    __metadata("design:type", String)
], GetReportHealthResponseDto.prototype, "service", void 0);
//# sourceMappingURL=get-report-health.response.dto.js.map