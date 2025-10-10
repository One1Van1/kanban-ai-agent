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
exports.MoveTaskToColumnController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const move_task_to_column_service_1 = require("./move-task-to-column.service");
const move_task_request_dto_1 = require("./move-task-request.dto");
const openapi_decorator_1 = require("./openapi.decorator");
let MoveTaskToColumnController = class MoveTaskToColumnController {
    service;
    constructor(service) {
        this.service = service;
    }
    async handle(taskId, moveDto) {
        return this.service.execute(taskId, moveDto);
    }
};
exports.MoveTaskToColumnController = MoveTaskToColumnController;
__decorate([
    (0, common_1.Patch)(':id/move'),
    (0, openapi_decorator_1.ApiMoveTaskToColumn)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, move_task_request_dto_1.MoveTaskRequestDto]),
    __metadata("design:returntype", Promise)
], MoveTaskToColumnController.prototype, "handle", null);
exports.MoveTaskToColumnController = MoveTaskToColumnController = __decorate([
    (0, common_1.Controller)('kanban/tasks'),
    (0, swagger_1.ApiTags)('MoveTaskToColumn'),
    __metadata("design:paramtypes", [move_task_to_column_service_1.MoveTaskToColumnService])
], MoveTaskToColumnController);
//# sourceMappingURL=move-task-to-column.controller.js.map