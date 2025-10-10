"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiProcessReportTask = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const process_report_task_response_dto_1 = require("./process-report-task.response.dto");
const ApiProcessReportTask = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Process report task assigned to AI-Report-maker',
    description: 'Automatically process a Jira task assigned to AI-Report-maker to generate and post a report',
}), (0, swagger_1.ApiResponse)({
    status: 200,
    description: 'Report task processed successfully',
    type: process_report_task_response_dto_1.ProcessReportTaskResponseDto,
}), (0, swagger_1.ApiResponse)({
    status: 400,
    description: 'Invalid task or not assigned to AI-Report-maker',
}), (0, swagger_1.ApiResponse)({
    status: 500,
    description: 'Internal server error during task processing',
}));
exports.ApiProcessReportTask = ApiProcessReportTask;
//# sourceMappingURL=openapi.decorator.js.map