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
var GetJobDetailsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetJobDetailsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_job_details_service_1 = require("./get-job-details.service");
const openapi_decorator_1 = require("./openapi.decorator");
let GetJobDetailsController = GetJobDetailsController_1 = class GetJobDetailsController {
    getJobDetailsService;
    logger = new common_1.Logger(GetJobDetailsController_1.name);
    constructor(getJobDetailsService) {
        this.getJobDetailsService = getJobDetailsService;
    }
    async handle(jobId) {
        this.logger.log(`Received request for job details: ${jobId}`);
        const jobDetails = await this.getJobDetailsService.getJobDetails(jobId);
        if (!jobDetails) {
            throw new common_1.NotFoundException(`Job with ID ${jobId} not found`);
        }
        return jobDetails;
    }
};
exports.GetJobDetailsController = GetJobDetailsController;
__decorate([
    (0, common_1.Get)('jobs/:jobId'),
    (0, openapi_decorator_1.ApiGetJobDetails)(),
    __param(0, (0, common_1.Param)('jobId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GetJobDetailsController.prototype, "handle", null);
exports.GetJobDetailsController = GetJobDetailsController = GetJobDetailsController_1 = __decorate([
    (0, common_1.Controller)('queue'),
    (0, swagger_1.ApiTags)('GetJobDetails'),
    __metadata("design:paramtypes", [get_job_details_service_1.GetJobDetailsService])
], GetJobDetailsController);
//# sourceMappingURL=get-job-details.controller.js.map