"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiGetQueueStatus = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ApiGetQueueStatus = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Get queue status and statistics' }), (0, swagger_1.ApiResponse)({
    status: 200,
    description: 'Queue status retrieved successfully',
}));
exports.ApiGetQueueStatus = ApiGetQueueStatus;
//# sourceMappingURL=openapi.decorator.js.map