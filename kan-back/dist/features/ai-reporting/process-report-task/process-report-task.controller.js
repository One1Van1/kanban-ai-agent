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
var ProcessReportTaskController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessReportTaskController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const process_report_task_service_1 = require("./process-report-task.service");
const process_report_task_request_dto_1 = require("./process-report-task.request.dto");
const openapi_decorator_1 = require("./openapi.decorator");
let ProcessReportTaskController = ProcessReportTaskController_1 = class ProcessReportTaskController {
    service;
    logger = new common_1.Logger(ProcessReportTaskController_1.name);
    constructor(service) {
        this.service = service;
    }
    async handle(dto) {
        this.logger.log(`🎯 Processing report task: ${dto.taskKey}`);
        try {
            const result = await this.service.execute(dto);
            this.logger.log(`✅ ${result.message}`);
            return result;
        }
        catch (error) {
            this.logger.error(`❌ Failed to process report task ${dto.taskKey}:`, error);
            throw error;
        }
    }
};
exports.ProcessReportTaskController = ProcessReportTaskController;
__decorate([
    (0, common_1.Post)('process-task'),
    (0, openapi_decorator_1.ApiProcessReportTask)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [process_report_task_request_dto_1.ProcessReportTaskRequestDto]),
    __metadata("design:returntype", Promise)
], ProcessReportTaskController.prototype, "handle", null);
exports.ProcessReportTaskController = ProcessReportTaskController = ProcessReportTaskController_1 = __decorate([
    (0, swagger_1.ApiTags)('ProcessReportTask'),
    (0, common_1.Controller)('ai-reporting-agent/generate-report'),
    __metadata("design:paramtypes", [process_report_task_service_1.ProcessReportTaskService])
], ProcessReportTaskController);
//# sourceMappingURL=process-report-task.controller.js.map