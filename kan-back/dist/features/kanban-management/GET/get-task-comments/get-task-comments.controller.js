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
exports.GetTaskCommentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_task_comments_service_1 = require("./get-task-comments.service");
const get_task_comments_request_dto_1 = require("./get-task-comments.request.dto");
const openapi_decorator_1 = require("./openapi.decorator");
let GetTaskCommentsController = class GetTaskCommentsController {
    service;
    constructor(service) {
        this.service = service;
    }
    async handle(taskId, query) {
        return this.service.execute(taskId, query);
    }
};
exports.GetTaskCommentsController = GetTaskCommentsController;
__decorate([
    (0, common_1.Get)(':id/comments'),
    (0, openapi_decorator_1.ApiGetTaskComments)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, get_task_comments_request_dto_1.GetTaskCommentsRequestDto]),
    __metadata("design:returntype", Promise)
], GetTaskCommentsController.prototype, "handle", null);
exports.GetTaskCommentsController = GetTaskCommentsController = __decorate([
    (0, common_1.Controller)('kanban/tasks'),
    (0, swagger_1.ApiTags)('GetTaskComments'),
    __metadata("design:paramtypes", [get_task_comments_service_1.GetTaskCommentsService])
], GetTaskCommentsController);
//# sourceMappingURL=get-task-comments.controller.js.map