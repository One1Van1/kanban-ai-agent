"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiGetTask = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_task_response_dto_1 = require("./get-task.response.dto");
const ApiGetTask = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Получить информацию о задаче',
    description: 'Возвращает подробную информацию о задаче по её ключу',
}), (0, swagger_1.ApiParam)({
    name: 'taskKey',
    description: 'Ключ задачи в Jira',
    example: 'KAN-5',
}), (0, swagger_1.ApiOkResponse)({
    description: 'Информация о задаче получена',
    type: get_task_response_dto_1.GetTaskResponseDto,
}));
exports.ApiGetTask = ApiGetTask;
//# sourceMappingURL=openapi.decorator.js.map