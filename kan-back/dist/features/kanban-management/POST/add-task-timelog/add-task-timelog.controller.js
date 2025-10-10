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
exports.AddTaskTimelogController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const add_task_timelog_service_1 = require("./add-task-timelog.service");
const add_task_timelog_request_dto_1 = require("./add-task-timelog.request.dto");
const openapi_decorator_1 = require("./openapi.decorator");
let AddTaskTimelogController = class AddTaskTimelogController {
    service;
    constructor(service) {
        this.service = service;
    }
    async handle(taskId, requestDto) {
        return this.service.execute(taskId, requestDto);
    }
};
exports.AddTaskTimelogController = AddTaskTimelogController;
__decorate([
    (0, common_1.Post)(':id/timelog'),
    (0, openapi_decorator_1.ApiAddTaskTimelog)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, add_task_timelog_request_dto_1.AddTaskTimelogRequestDto]),
    __metadata("design:returntype", Promise)
], AddTaskTimelogController.prototype, "handle", null);
exports.AddTaskTimelogController = AddTaskTimelogController = __decorate([
    (0, common_1.Controller)('kanban/tasks'),
    (0, swagger_1.ApiTags)('AddTaskTimelog'),
    __metadata("design:paramtypes", [add_task_timelog_service_1.AddTaskTimelogService])
], AddTaskTimelogController);
//# sourceMappingURL=add-task-timelog.controller.js.map