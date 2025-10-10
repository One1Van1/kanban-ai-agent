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
exports.GetTaskHistoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_task_history_service_1 = require("./get-task-history.service");
const openapi_decorator_1 = require("./openapi.decorator");
let GetTaskHistoryController = class GetTaskHistoryController {
    service;
    constructor(service) {
        this.service = service;
    }
    async handle(taskId) {
        return this.service.execute(taskId);
    }
};
exports.GetTaskHistoryController = GetTaskHistoryController;
__decorate([
    (0, common_1.Get)('task/:taskId'),
    (0, openapi_decorator_1.ApiGetTaskHistory)(),
    __param(0, (0, common_1.Param)('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GetTaskHistoryController.prototype, "handle", null);
exports.GetTaskHistoryController = GetTaskHistoryController = __decorate([
    (0, common_1.Controller)('database/task-history'),
    (0, swagger_1.ApiTags)('GetTaskHistory'),
    __metadata("design:paramtypes", [get_task_history_service_1.GetTaskHistoryService])
], GetTaskHistoryController);
//# sourceMappingURL=get-task-history.controller.js.map