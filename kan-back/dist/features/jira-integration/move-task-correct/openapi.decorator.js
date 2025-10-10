"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiMoveTask = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const move_task_request_dto_1 = require("./move-task.request.dto");
const move_task_response_dto_1 = require("./move-task.response.dto");
const ApiMoveTask = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Переместить задачу между колонками',
    description: 'Перемещает задачу в указанную колонку (статус) в Jira',
}), (0, swagger_1.ApiParam)({
    name: 'taskKey',
    description: 'Ключ задачи в Jira',
    example: 'KAN-5',
}), (0, swagger_1.ApiBody)({ type: move_task_request_dto_1.MoveTaskRequestDto }), (0, swagger_1.ApiOkResponse)({
    description: 'Задача успешно перемещена',
    type: move_task_response_dto_1.MoveTaskResponseDto,
}));
exports.ApiMoveTask = ApiMoveTask;
//# sourceMappingURL=openapi.decorator.js.map