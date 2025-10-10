"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiAddTaskComment = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const add_task_comment_request_dto_1 = require("./add-task-comment.request.dto");
const add_task_comment_response_dto_1 = require("./add-task-comment.response.dto");
const ApiAddTaskComment = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Добавить комментарий к задаче',
    description: 'Добавляет текстовый комментарий к указанной задаче в Jira',
}), (0, swagger_1.ApiParam)({
    name: 'taskKey',
    description: 'Ключ задачи в Jira',
    example: 'KAN-5',
}), (0, swagger_1.ApiBody)({ type: add_task_comment_request_dto_1.AddTaskCommentRequestDto }), (0, swagger_1.ApiOkResponse)({
    description: 'Комментарий успешно добавлен',
    type: add_task_comment_response_dto_1.AddTaskCommentResponseDto,
}));
exports.ApiAddTaskComment = ApiAddTaskComment;
//# sourceMappingURL=openapi.decorator.js.map