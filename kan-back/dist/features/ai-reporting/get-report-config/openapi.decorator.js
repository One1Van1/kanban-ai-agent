"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiGetReportConfig = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_report_config_response_dto_1 = require("./get-report-config.response.dto");
const ApiGetReportConfig = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Get current configuration for report generation',
    description: 'Display current configuration settings for the report generation service',
}), (0, swagger_1.ApiResponse)({
    status: 200,
    description: 'Configuration retrieved successfully',
    type: get_report_config_response_dto_1.GetReportConfigResponseDto,
}));
exports.ApiGetReportConfig = ApiGetReportConfig;
//# sourceMappingURL=openapi.decorator.js.map