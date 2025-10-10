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
exports.UpdateTaskLabelsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const update_task_labels_service_1 = require("./update-task-labels.service");
const update_task_labels_request_dto_1 = require("./update-task-labels.request.dto");
const update_task_labels_openapi_decorator_1 = require("./update-task-labels.openapi.decorator");
let UpdateTaskLabelsController = class UpdateTaskLabelsController {
    service;
    constructor(service) {
        this.service = service;
    }
    async handle(taskId, requestDto) {
        return this.service.execute(taskId, requestDto);
    }
};
exports.UpdateTaskLabelsController = UpdateTaskLabelsController;
__decorate([
    (0, common_1.Patch)('task/:taskId/labels'),
    (0, update_task_labels_openapi_decorator_1.ApiUpdateTaskLabels)(),
    __param(0, (0, common_1.Param)('taskId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_task_labels_request_dto_1.UpdateTaskLabelsRequestDto]),
    __metadata("design:returntype", Promise)
], UpdateTaskLabelsController.prototype, "handle", null);
exports.UpdateTaskLabelsController = UpdateTaskLabelsController = __decorate([
    (0, common_1.Controller)('kanban-management'),
    (0, swagger_1.ApiTags)('UpdateTaskLabels'),
    __metadata("design:paramtypes", [update_task_labels_service_1.UpdateTaskLabelsService])
], UpdateTaskLabelsController);
//# sourceMappingURL=update-task-labels.controller.js.map