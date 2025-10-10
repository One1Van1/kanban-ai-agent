"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiGenerateReport = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const generate_report_response_dto_1 = require("./generate-report.response.dto");
const ApiGenerateReport = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Generate haircut report for specified date range',
    description: 'Generate comprehensive report of all haircuts performed within the specified date range',
}), (0, swagger_1.ApiResponse)({
    status: 200,
    description: 'Report generated successfully',
    type: generate_report_response_dto_1.GenerateReportResponseDto,
}), (0, swagger_1.ApiResponse)({
    status: 400,
    description: 'Invalid request parameters',
}), (0, swagger_1.ApiResponse)({
    status: 500,
    description: 'Internal server error during report generation',
}));
exports.ApiGenerateReport = ApiGenerateReport;
//# sourceMappingURL=openapi.decorator.js.map