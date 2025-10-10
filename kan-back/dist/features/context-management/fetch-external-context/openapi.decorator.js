"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiFetchExternalContext = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const fetch_external_context_response_dto_1 = require("./fetch-external-context.response.dto");
const fetch_external_context_query_dto_1 = require("./fetch-external-context.query.dto");
const ApiFetchExternalContext = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Получить контекст из внешних источников',
    description: 'Собирает релевантный контекст для задачи из различных внешних источников: Confluence, Slack, GitHub, документации, базы знаний и других систем',
}), (0, swagger_1.ApiParam)({
    name: 'taskId',
    description: 'Уникальный идентификатор задачи для которой собирается контекст',
    example: 'task-uuid-123',
}), (0, swagger_1.ApiQuery)({
    name: 'sources',
    enum: fetch_external_context_query_dto_1.ExternalSourceType,
    isArray: true,
    description: 'Список типов внешних источников для поиска контекста',
    required: false,
}), (0, swagger_1.ApiQuery)({
    name: 'keywords',
    description: 'Ключевые слова для поиска в внешних источниках',
    isArray: true,
    required: false,
}), (0, swagger_1.ApiQuery)({
    name: 'searchDepthDays',
    description: 'Глубина поиска в днях (насколько далеко искать в истории)',
    example: 30,
    required: false,
}), (0, swagger_1.ApiQuery)({
    name: 'includeRelatedProjects',
    description: 'Включить контекст из связанных проектов',
    example: true,
    required: false,
}), (0, swagger_1.ApiQuery)({
    name: 'maxResultsPerSource',
    description: 'Максимальное количество результатов с каждого источника',
    example: 5,
    required: false,
}), (0, swagger_1.ApiOkResponse)({
    description: 'Контекст из внешних источников успешно собран',
    type: fetch_external_context_response_dto_1.FetchExternalContextResponseDto,
}), (0, swagger_1.ApiBadRequestResponse)({
    description: 'Некорректный формат параметров запроса',
}), (0, swagger_1.ApiNotFoundResponse)({
    description: 'Задача не найдена или недостаточно данных для поиска контекста',
}));
exports.ApiFetchExternalContext = ApiFetchExternalContext;
//# sourceMappingURL=openapi.decorator.js.map