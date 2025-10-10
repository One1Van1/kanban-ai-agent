"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiCreateTaskQueue = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_task_queue_dto_1 = require("./create-task-queue.dto");
const ApiCreateTaskQueue = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Add task to processing queue' }), (0, swagger_1.ApiResponse)({
    status: 201,
    description: 'Task successfully added to queue',
    type: create_task_queue_dto_1.CreateTaskQueueResponseDto,
}), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request data' }), (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }));
exports.ApiCreateTaskQueue = ApiCreateTaskQueue;
//# sourceMappingURL=openapi.decorator.js.map