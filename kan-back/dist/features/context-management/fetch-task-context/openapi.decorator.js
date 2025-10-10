"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiFetchTaskContext = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const fetch_task_context_response_dto_1 = require("./fetch-task-context.response.dto");
const ApiFetchTaskContext = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Получить контекст задачи',
    description: 'Собирает полный контекст задачи включая комментарии, вложения, записи времени и дополнительные поля',
}), (0, swagger_1.ApiParam)({
    name: 'taskId',
    description: 'Уникальный идентификатор задачи',
    example: 'task-uuid-123',
}), (0, swagger_1.ApiOkResponse)({
    description: 'Контекст задачи успешно получен',
    type: fetch_task_context_response_dto_1.FetchTaskContextResponseDto,
}), (0, swagger_1.ApiBadRequestResponse)({
    description: 'Некорректный формат идентификатора задачи',
}), (0, swagger_1.ApiNotFoundResponse)({
    description: 'Задача не найдена',
}));
exports.ApiFetchTaskContext = ApiFetchTaskContext;
//# sourceMappingURL=openapi.decorator.js.map