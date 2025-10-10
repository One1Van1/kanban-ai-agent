"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiStoreTaskHistory = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const store_task_history_response_dto_1 = require("./store-task-history.response.dto");
const ApiStoreTaskHistory = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Store task history record',
    description: 'Creates a new task history record in the database',
}), (0, swagger_1.ApiOkResponse)({
    type: store_task_history_response_dto_1.StoreTaskHistoryResponseDto,
    description: 'Task history stored successfully',
}), (0, swagger_1.ApiBadRequestResponse)({
    description: 'Invalid request data',
}));
exports.ApiStoreTaskHistory = ApiStoreTaskHistory;
//# sourceMappingURL=openapi.decorator.js.map