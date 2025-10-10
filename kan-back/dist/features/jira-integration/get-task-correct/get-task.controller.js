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
exports.GetTaskController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_task_service_1 = require("./get-task.service");
const openapi_decorator_1 = require("./openapi.decorator");
let GetTaskController = class GetTaskController {
    service;
    constructor(service) {
        this.service = service;
    }
    async handle(taskKey) {
        return this.service.execute(taskKey);
    }
};
exports.GetTaskController = GetTaskController;
__decorate([
    (0, common_1.Get)('tasks/:taskKey'),
    (0, openapi_decorator_1.ApiGetTask)(),
    __param(0, (0, common_1.Param)('taskKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GetTaskController.prototype, "handle", null);
exports.GetTaskController = GetTaskController = __decorate([
    (0, common_1.Controller)('jira'),
    (0, swagger_1.ApiTags)('GetTask'),
    __metadata("design:paramtypes", [get_task_service_1.GetTaskService])
], GetTaskController);
//# sourceMappingURL=get-task.controller.js.map