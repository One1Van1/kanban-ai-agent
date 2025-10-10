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
var GetReportConfigController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetReportConfigController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_report_config_service_1 = require("./get-report-config.service");
const openapi_decorator_1 = require("./openapi.decorator");
let GetReportConfigController = GetReportConfigController_1 = class GetReportConfigController {
    service;
    logger = new common_1.Logger(GetReportConfigController_1.name);
    constructor(service) {
        this.service = service;
    }
    async handle() {
        this.logger.log('⚙️ Configuration requested');
        try {
            const result = await this.service.execute();
            this.logger.log('✅ Configuration retrieved');
            return result;
        }
        catch (error) {
            this.logger.error('❌ Failed to get configuration:', error);
            throw error;
        }
    }
};
exports.GetReportConfigController = GetReportConfigController;
__decorate([
    (0, common_1.Get)('config'),
    (0, openapi_decorator_1.ApiGetReportConfig)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GetReportConfigController.prototype, "handle", null);
exports.GetReportConfigController = GetReportConfigController = GetReportConfigController_1 = __decorate([
    (0, swagger_1.ApiTags)('GetReportConfig'),
    (0, common_1.Controller)('ai-reporting-agent/generate-report'),
    __metadata("design:paramtypes", [get_report_config_service_1.GetReportConfigService])
], GetReportConfigController);
//# sourceMappingURL=get-report-config.controller.js.map