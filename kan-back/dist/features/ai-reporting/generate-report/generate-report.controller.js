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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var GenerateReportController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateReportController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const generate_report_service_1 = require("./generate-report.service");
const generate_report_request_dto_1 = require("./generate-report.request.dto");
const openapi_decorator_1 = require("./openapi.decorator");
let GenerateReportController = GenerateReportController_1 = class GenerateReportController {
    service;
    logger = new common_1.Logger(GenerateReportController_1.name);
    constructor(service) {
        this.service = service;
    }
    async handle(dto) {
        this.logger.log(`🔍 Starting report generation for task: ${dto.taskKey}`);
        try {
            const report = await this.service.execute(dto);
            this.logger.log(`✅ Report generated successfully for ${dto.taskKey}`);
            return report;
        }
        catch (error) {
            this.logger.error(`❌ Failed to generate report for ${dto.taskKey}:`, error);
            throw error;
        }
    }
};
exports.GenerateReportController = GenerateReportController;
__decorate([
    (0, common_1.Post)(),
    (0, openapi_decorator_1.ApiGenerateReport)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generate_report_request_dto_1.GenerateReportRequestDto]),
    __metadata("design:returntype", Promise)
], GenerateReportController.prototype, "handle", null);
exports.GenerateReportController = GenerateReportController = GenerateReportController_1 = __decorate([
    (0, swagger_1.ApiTags)('GenerateReport'),
    (0, common_1.Controller)('ai-reporting-agent/generate-report'),
    __metadata("design:paramtypes", [generate_report_service_1.GenerateReportService])
], GenerateReportController);
//# sourceMappingURL=generate-report.controller.js.map