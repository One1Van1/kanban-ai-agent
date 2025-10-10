"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiHealthCheck = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const health_check_response_dto_1 = require("./health-check.response.dto");
const ApiHealthCheck = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Проверка состояния соединения с Jira',
    description: 'Проверяет доступность Jira API и возвращает статус соединения',
}), (0, swagger_1.ApiOkResponse)({
    description: 'Статус соединения с Jira',
    type: health_check_response_dto_1.HealthCheckResponseDto,
}));
exports.ApiHealthCheck = ApiHealthCheck;
//# sourceMappingURL=openapi.decorator.js.map