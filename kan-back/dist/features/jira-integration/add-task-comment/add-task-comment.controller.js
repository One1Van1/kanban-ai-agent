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
exports.AddTaskCommentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const add_task_comment_service_1 = require("./add-task-comment.service");
const add_task_comment_request_dto_1 = require("./add-task-comment.request.dto");
const add_task_comment_response_dto_1 = require("./add-task-comment.response.dto");
const openapi_decorator_1 = require("./openapi.decorator");
let AddTaskCommentController = class AddTaskCommentController {
    addTaskCommentService;
    constructor(addTaskCommentService) {
        this.addTaskCommentService = addTaskCommentService;
    }
    async handle(taskKey, requestDto) {
        const result = await this.addTaskCommentService.addCommentToTask(taskKey, requestDto.comment);
        return new add_task_comment_response_dto_1.AddTaskCommentResponseDto(result.success, result.taskKey, result.message, result.error);
    }
};
exports.AddTaskCommentController = AddTaskCommentController;
__decorate([
    (0, common_1.Post)('tasks/:taskKey/comment'),
    (0, openapi_decorator_1.ApiAddTaskComment)(),
    __param(0, (0, common_1.Param)('taskKey')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, add_task_comment_request_dto_1.AddTaskCommentRequestDto]),
    __metadata("design:returntype", Promise)
], AddTaskCommentController.prototype, "handle", null);
exports.AddTaskCommentController = AddTaskCommentController = __decorate([
    (0, swagger_1.ApiTags)('AddTaskComment'),
    (0, common_1.Controller)('jira'),
    __metadata("design:paramtypes", [add_task_comment_service_1.AddTaskCommentService])
], AddTaskCommentController);
//# sourceMappingURL=add-task-comment.controller.js.map