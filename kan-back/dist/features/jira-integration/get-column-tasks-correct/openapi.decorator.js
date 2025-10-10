"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiGetColumnTasks = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_column_tasks_response_dto_1 = require("./get-column-tasks.response.dto");
const ApiGetColumnTasks = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Получение задач из указанной колонки',
    description: 'Возвращает список задач с определенным статусом (колонкой) с возможностью фильтрации',
}), (0, swagger_1.ApiParam)({
    name: 'columnStatus',
    description: 'Статус колонки для получения задач',
    example: 'In Progress',
}), (0, swagger_1.ApiQuery)({
    name: 'maxResults',
    description: 'Максимальное количество результатов',
    required: false,
    example: 20,
}), (0, swagger_1.ApiQuery)({
    name: 'assignee',
    description: 'Фильтр по исполнителю',
    required: false,
    example: 'john.doe@company.com',
}), (0, swagger_1.ApiQuery)({
    name: 'priority',
    description: 'Фильтр по приоритету',
    required: false,
    example: 'High',
}), (0, swagger_1.ApiOkResponse)({
    description: 'Список задач из колонки',
    type: get_column_tasks_response_dto_1.GetColumnTasksResponseDto,
}));
exports.ApiGetColumnTasks = ApiGetColumnTasks;
//# sourceMappingURL=openapi.decorator.js.map