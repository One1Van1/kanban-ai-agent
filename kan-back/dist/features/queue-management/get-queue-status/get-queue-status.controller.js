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
var GetQueueStatusController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetQueueStatusController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_queue_status_service_1 = require("./get-queue-status.service");
const openapi_decorator_1 = require("./openapi.decorator");
let GetQueueStatusController = GetQueueStatusController_1 = class GetQueueStatusController {
    getQueueStatusService;
    logger = new common_1.Logger(GetQueueStatusController_1.name);
    constructor(getQueueStatusService) {
        this.getQueueStatusService = getQueueStatusService;
    }
    async handle() {
        this.logger.log('Received request for queue status');
        return this.getQueueStatusService.getQueueStatus();
    }
};
exports.GetQueueStatusController = GetQueueStatusController;
__decorate([
    (0, common_1.Get)('status'),
    (0, openapi_decorator_1.ApiGetQueueStatus)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GetQueueStatusController.prototype, "handle", null);
exports.GetQueueStatusController = GetQueueStatusController = GetQueueStatusController_1 = __decorate([
    (0, common_1.Controller)('queue'),
    (0, swagger_1.ApiTags)('GetQueueStatus'),
    __metadata("design:paramtypes", [get_queue_status_service_1.GetQueueStatusService])
], GetQueueStatusController);
//# sourceMappingURL=get-queue-status.controller.js.map