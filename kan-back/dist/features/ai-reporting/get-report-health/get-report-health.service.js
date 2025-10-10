"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GetReportHealthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetReportHealthService = void 0;
const common_1 = require("@nestjs/common");
const get_report_health_response_dto_1 = require("./get-report-health.response.dto");
let GetReportHealthService = GetReportHealthService_1 = class GetReportHealthService {
    logger = new common_1.Logger(GetReportHealthService_1.name);
    async execute() {
        this.logger.log('🏥 Health check requested');
        return new get_report_health_response_dto_1.GetReportHealthResponseDto('healthy', new Date().toISOString(), 'AI Reporting Agent - Generate Report');
    }
};
exports.GetReportHealthService = GetReportHealthService;
exports.GetReportHealthService = GetReportHealthService = GetReportHealthService_1 = __decorate([
    (0, common_1.Injectable)()
], GetReportHealthService);
//# sourceMappingURL=get-report-health.service.js.map