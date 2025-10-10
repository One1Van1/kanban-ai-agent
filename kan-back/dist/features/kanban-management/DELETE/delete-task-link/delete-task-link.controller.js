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
exports.DeleteTaskLinkController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const delete_task_link_service_1 = require("./delete-task-link.service");
const delete_task_link_request_dto_1 = require("./delete-task-link.request.dto");
const delete_task_link_openapi_decorator_1 = require("./delete-task-link.openapi.decorator");
let DeleteTaskLinkController = class DeleteTaskLinkController {
    service;
    constructor(service) {
        this.service = service;
    }
    async handle(taskId, linkId, requestDto) {
        return this.service.execute(taskId, linkId, requestDto);
    }
};
exports.DeleteTaskLinkController = DeleteTaskLinkController;
__decorate([
    (0, common_1.Delete)('task/:taskId/link/:linkId'),
    (0, delete_task_link_openapi_decorator_1.ApiDeleteTaskLink)(),
    __param(0, (0, common_1.Param)('taskId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('linkId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, delete_task_link_request_dto_1.DeleteTaskLinkRequestDto]),
    __metadata("design:returntype", Promise)
], DeleteTaskLinkController.prototype, "handle", null);
exports.DeleteTaskLinkController = DeleteTaskLinkController = __decorate([
    (0, common_1.Controller)('kanban-management'),
    (0, swagger_1.ApiTags)('DeleteTaskLink'),
    __metadata("design:paramtypes", [delete_task_link_service_1.DeleteTaskLinkService])
], DeleteTaskLinkController);
//# sourceMappingURL=delete-task-link.controller.js.map