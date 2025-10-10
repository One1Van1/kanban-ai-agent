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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeTaskStatusController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const change_task_status_service_1 = require("./change-task-status.service");
const change_task_status_request_dto_1 = require("./change-task-status.request.dto");
const openapi_decorator_1 = require("./openapi.decorator");
let ChangeTaskStatusController = class ChangeTaskStatusController {
    service;
    constructor(service) {
        this.service = service;
    }
    async handle(taskId, statusDto) {
        return this.service.execute(taskId, statusDto);
    }
};
exports.ChangeTaskStatusController = ChangeTaskStatusController;
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, openapi_decorator_1.ApiChangeTaskStatus)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, change_task_status_request_dto_1.ChangeTaskStatusRequestDto]),
    __metadata("design:returntype", Promise)
], ChangeTaskStatusController.prototype, "handle", null);
exports.ChangeTaskStatusController = ChangeTaskStatusController = __decorate([
    (0, common_1.Controller)('kanban/tasks'),
    (0, swagger_1.ApiTags)('ChangeTaskStatus'),
    __metadata("design:paramtypes", [change_task_status_service_1.ChangeTaskStatusService])
], ChangeTaskStatusController);
//# sourceMappingURL=change-task-status.controller.js.map