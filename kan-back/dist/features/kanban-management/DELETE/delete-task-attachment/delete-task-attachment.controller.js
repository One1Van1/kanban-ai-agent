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
exports.DeleteTaskAttachmentController = void 0;
const common_1 = require("@nestjs/common");
const delete_task_attachment_service_1 = require("./delete-task-attachment.service");
const delete_task_attachment_request_dto_1 = require("./delete-task-attachment.request.dto");
const delete_task_attachment_openapi_decorator_1 = require("./delete-task-attachment.openapi.decorator");
let DeleteTaskAttachmentController = class DeleteTaskAttachmentController {
    service;
    constructor(service) {
        this.service = service;
    }
    async deleteAttachment(taskId, attachmentId, requestDto) {
        return this.service.deleteAttachment(taskId, attachmentId, requestDto);
    }
};
exports.DeleteTaskAttachmentController = DeleteTaskAttachmentController;
__decorate([
    (0, common_1.Delete)('task/:taskId/attachment/:attachmentId'),
    (0, delete_task_attachment_openapi_decorator_1.ApiDeleteTaskAttachment)(),
    __param(0, (0, common_1.Param)('taskId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('attachmentId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, delete_task_attachment_request_dto_1.DeleteTaskAttachmentRequestDto]),
    __metadata("design:returntype", Promise)
], DeleteTaskAttachmentController.prototype, "deleteAttachment", null);
exports.DeleteTaskAttachmentController = DeleteTaskAttachmentController = __decorate([
    (0, common_1.Controller)('kanban-management'),
    __metadata("design:paramtypes", [delete_task_attachment_service_1.DeleteTaskAttachmentService])
], DeleteTaskAttachmentController);
//# sourceMappingURL=delete-task-attachment.controller.js.map