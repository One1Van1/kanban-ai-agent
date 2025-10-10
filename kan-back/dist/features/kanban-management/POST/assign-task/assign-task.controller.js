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
exports.AssignTaskController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const assign_task_service_1 = require("./assign-task.service");
const assign_task_request_dto_1 = require("./assign-task.request.dto");
const openapi_decorator_1 = require("./openapi.decorator");
let AssignTaskController = class AssignTaskController {
    service;
    constructor(service) {
        this.service = service;
    }
    async handle(taskId, assignDto) {
        return this.service.execute(taskId, assignDto);
    }
};
exports.AssignTaskController = AssignTaskController;
__decorate([
    (0, common_1.Post)(':id/assign'),
    (0, openapi_decorator_1.ApiAssignTask)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, assign_task_request_dto_1.AssignTaskRequestDto]),
    __metadata("design:returntype", Promise)
], AssignTaskController.prototype, "handle", null);
exports.AssignTaskController = AssignTaskController = __decorate([
    (0, common_1.Controller)('kanban/tasks'),
    (0, swagger_1.ApiTags)('AssignTask'),
    __metadata("design:paramtypes", [assign_task_service_1.AssignTaskService])
], AssignTaskController);
//# sourceMappingURL=assign-task.controller.js.map