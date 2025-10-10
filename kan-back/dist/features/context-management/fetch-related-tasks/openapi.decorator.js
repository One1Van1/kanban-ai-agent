"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiFetchRelatedTasks = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const fetch_related_tasks_response_dto_1 = require("./fetch-related-tasks.response.dto");
const fetch_related_tasks_query_dto_1 = require("./fetch-related-tasks.query.dto");
const ApiFetchRelatedTasks = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Получить связанные задачи',
    description: 'Находит все задачи, связанные с указанной задачей различными типами связей (блокирует, заблокирована, зависит от, и т.д.)',
}), (0, swagger_1.ApiParam)({
    name: 'taskId',
    description: 'Уникальный идентификатор основной задачи',
    example: 'task-uuid-123',
}), (0, swagger_1.ApiQuery)({
    name: 'relationshipType',
    enum: fetch_related_tasks_query_dto_1.RelationshipType,
    description: 'Фильтр по типу связи между задачами',
    required: false,
}), (0, swagger_1.ApiQuery)({
    name: 'limit',
    description: 'Максимальное количество возвращаемых связанных задач',
    example: 10,
    required: false,
}), (0, swagger_1.ApiQuery)({
    name: 'includeSubtasks',
    description: 'Включить подзадачи в результат',
    example: true,
    required: false,
}), (0, swagger_1.ApiQuery)({
    name: 'includeParents',
    description: 'Включить родительские задачи в результат',
    example: true,
    required: false,
}), (0, swagger_1.ApiOkResponse)({
    description: 'Связанные задачи успешно найдены',
    type: fetch_related_tasks_response_dto_1.FetchRelatedTasksResponseDto,
}), (0, swagger_1.ApiBadRequestResponse)({
    description: 'Некорректный формат параметров запроса',
}), (0, swagger_1.ApiNotFoundResponse)({
    description: 'Основная задача не найдена',
}));
exports.ApiFetchRelatedTasks = ApiFetchRelatedTasks;
//# sourceMappingURL=openapi.decorator.js.map