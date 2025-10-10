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
var GetReportHealthController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetReportHealthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_report_health_service_1 = require("./get-report-health.service");
const openapi_decorator_1 = require("./openapi.decorator");
let GetReportHealthController = GetReportHealthController_1 = class GetReportHealthController {
    service;
    logger = new common_1.Logger(GetReportHealthController_1.name);
    constructor(service) {
        this.service = service;
    }
    async handle() {
        this.logger.log('🏥 Health check requested');
        try {
            const result = await this.service.execute();
            this.logger.log('✅ Health check completed');
            return result;
        }
        catch (error) {
            this.logger.error('❌ Health check failed:', error);
            throw error;
        }
    }
};
exports.GetReportHealthController = GetReportHealthController;
__decorate([
    (0, common_1.Get)('health'),
    (0, openapi_decorator_1.ApiGetReportHealth)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GetReportHealthController.prototype, "handle", null);
exports.GetReportHealthController = GetReportHealthController = GetReportHealthController_1 = __decorate([
    (0, swagger_1.ApiTags)('GetReportHealth'),
    (0, common_1.Controller)('ai-reporting-agent/generate-report'),
    __metadata("design:paramtypes", [get_report_health_service_1.GetReportHealthService])
], GetReportHealthController);
//# sourceMappingURL=get-report-health.controller.js.map