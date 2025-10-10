"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiGetReportHealth = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_report_health_response_dto_1 = require("./get-report-health.response.dto");
const ApiGetReportHealth = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Health check for report generation service',
    description: 'Check if the report generation service is operational',
}), (0, swagger_1.ApiResponse)({
    status: 200,
    description: 'Service is healthy',
    type: get_report_health_response_dto_1.GetReportHealthResponseDto,
}));
exports.ApiGetReportHealth = ApiGetReportHealth;
//# sourceMappingURL=openapi.decorator.js.map