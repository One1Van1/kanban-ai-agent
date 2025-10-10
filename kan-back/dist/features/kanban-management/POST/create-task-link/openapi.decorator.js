"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiCreateTaskLink = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_task_link_response_dto_1 = require("./create-task-link.response.dto");
const ApiCreateTaskLink = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Create a link between tasks',
    description: 'Creates a relationship link between two tasks (blocks, depends on, relates to, etc.)',
}), (0, swagger_1.ApiParam)({
    name: 'id',
    description: 'Source task ID',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
}), (0, swagger_1.ApiCreatedResponse)({
    type: create_task_link_response_dto_1.CreateTaskLinkResponseDto,
    description: 'Task link created successfully',
}), (0, swagger_1.ApiBadRequestResponse)({
    description: 'Invalid request data, task linking to itself, or link already exists',
}));
exports.ApiCreateTaskLink = ApiCreateTaskLink;
//# sourceMappingURL=openapi.decorator.js.map