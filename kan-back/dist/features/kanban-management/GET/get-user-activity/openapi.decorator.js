"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiGetUserActivity = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_user_activity_response_dto_1 = require("./get-user-activity.response.dto");
const ApiGetUserActivity = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Get user activity history',
    description: 'Retrieves paginated history of user activities on tasks',
}), (0, swagger_1.ApiParam)({
    name: 'id',
    description: 'User ID',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
}), (0, swagger_1.ApiQuery)({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    example: 1,
}), (0, swagger_1.ApiQuery)({
    name: 'limit',
    required: false,
    description: 'Number of activities per page',
    example: 20,
}), (0, swagger_1.ApiQuery)({
    name: 'type',
    required: false,
    description: 'Filter by activity type',
    example: 'status_changed',
}), (0, swagger_1.ApiOkResponse)({
    type: get_user_activity_response_dto_1.GetUserActivityResponseDto,
    description: 'User activity retrieved successfully',
}), (0, swagger_1.ApiBadRequestResponse)({
    description: 'Invalid request parameters',
}));
exports.ApiGetUserActivity = ApiGetUserActivity;
//# sourceMappingURL=openapi.decorator.js.map