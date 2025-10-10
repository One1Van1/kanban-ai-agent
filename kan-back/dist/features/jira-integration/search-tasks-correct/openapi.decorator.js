"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiSearchTasks = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const search_tasks_request_dto_1 = require("./search-tasks.request.dto");
const search_tasks_response_dto_1 = require("./search-tasks.response.dto");
const ApiSearchTasks = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Поиск задач по JQL запросу',
    description: 'Выполняет поиск задач в Jira с помощью JQL (Jira Query Language)',
}), (0, swagger_1.ApiBody)({ type: search_tasks_request_dto_1.SearchTasksRequestDto }), (0, swagger_1.ApiOkResponse)({
    description: 'Список найденных задач',
    type: search_tasks_response_dto_1.SearchTasksResponseDto,
}));
exports.ApiSearchTasks = ApiSearchTasks;
//# sourceMappingURL=openapi.decorator.js.map