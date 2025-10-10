"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GetReportConfigService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetReportConfigService = void 0;
const common_1 = require("@nestjs/common");
const get_report_config_response_dto_1 = require("./get-report-config.response.dto");
let GetReportConfigService = GetReportConfigService_1 = class GetReportConfigService {
    logger = new common_1.Logger(GetReportConfigService_1.name);
    async execute() {
        this.logger.log('⚙️ Configuration requested');
        return new get_report_config_response_dto_1.GetReportConfigResponseDto('AI Reporting Agent - Generate Report', [
            'со вчера до сегодня',
            'за прошлую неделю',
            'DD.MM.YYYY - DD.MM.YYYY',
            'с DD/MM/YYYY по DD/MM/YYYY',
        ], 'last 7 days', [
            'haircut_statistics',
            'quality_analysis',
            'performance_trends',
            'recommendations',
        ]);
    }
};
exports.GetReportConfigService = GetReportConfigService;
exports.GetReportConfigService = GetReportConfigService = GetReportConfigService_1 = __decorate([
    (0, common_1.Injectable)()
], GetReportConfigService);
//# sourceMappingURL=get-report-config.service.js.map