"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiGetTaskTransitions = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_task_transitions_response_dto_1 = require("./get-task-transitions.response.dto");
const ApiGetTaskTransitions = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Получение возможных переходов для задачи',
    description: 'Возвращает список всех доступных переходов (смена статуса) для указанной задачи',
}), (0, swagger_1.ApiParam)({
    name: 'taskKey',
    description: 'Ключ задачи для получения переходов',
    example: 'KAN-5',
}), (0, swagger_1.ApiOkResponse)({
    description: 'Список доступных переходов',
    type: get_task_transitions_response_dto_1.GetTaskTransitionsResponseDto,
}));
exports.ApiGetTaskTransitions = ApiGetTaskTransitions;
//# sourceMappingURL=openapi.decorator.js.map