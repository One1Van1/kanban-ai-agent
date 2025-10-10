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
exports.ExecuteTaskTransitionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const execute_task_transition_service_1 = require("./execute-task-transition.service");
const execute_task_transition_request_dto_1 = require("./execute-task-transition.request.dto");
const execute_task_transition_openapi_decorator_1 = require("./execute-task-transition.openapi.decorator");
let ExecuteTaskTransitionController = class ExecuteTaskTransitionController {
    service;
    constructor(service) {
        this.service = service;
    }
    async executeTransition(taskId, requestDto) {
        return this.service.executeTransition(taskId, requestDto);
    }
};
exports.ExecuteTaskTransitionController = ExecuteTaskTransitionController;
__decorate([
    (0, common_1.Post)(':id/transition'),
    (0, execute_task_transition_openapi_decorator_1.ExecuteTaskTransitionOpenApi)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, execute_task_transition_request_dto_1.ExecuteTaskTransitionRequestDto]),
    __metadata("design:returntype", Promise)
], ExecuteTaskTransitionController.prototype, "executeTransition", null);
exports.ExecuteTaskTransitionController = ExecuteTaskTransitionController = __decorate([
    (0, common_1.Controller)('kanban/tasks'),
    (0, swagger_1.ApiTags)('ExecuteTaskTransition'),
    __metadata("design:paramtypes", [execute_task_transition_service_1.ExecuteTaskTransitionService])
], ExecuteTaskTransitionController);
//# sourceMappingURL=execute-task-transition.controller.js.map