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
exports.DeleteTaskController = void 0;
const common_1 = require("@nestjs/common");
const delete_task_service_1 = require("./delete-task.service");
const delete_task_request_dto_1 = require("./delete-task.request.dto");
const delete_task_openapi_decorator_1 = require("./delete-task.openapi.decorator");
let DeleteTaskController = class DeleteTaskController {
    service;
    constructor(service) {
        this.service = service;
    }
    async deleteTask(taskId, requestDto) {
        return this.service.deleteTask(taskId, requestDto);
    }
};
exports.DeleteTaskController = DeleteTaskController;
__decorate([
    (0, common_1.Delete)('task/:taskId'),
    (0, delete_task_openapi_decorator_1.DeleteTaskOpenApi)(),
    __param(0, (0, common_1.Param)('taskId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, delete_task_request_dto_1.DeleteTaskRequestDto]),
    __metadata("design:returntype", Promise)
], DeleteTaskController.prototype, "deleteTask", null);
exports.DeleteTaskController = DeleteTaskController = __decorate([
    (0, common_1.Controller)('kanban-management'),
    __metadata("design:paramtypes", [delete_task_service_1.DeleteTaskService])
], DeleteTaskController);
//# sourceMappingURL=delete-task.controller.js.map