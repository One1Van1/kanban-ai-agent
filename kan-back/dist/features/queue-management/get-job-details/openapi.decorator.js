"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiGetJobDetails = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ApiGetJobDetails = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Get specific job details' }), (0, swagger_1.ApiParam)({ name: 'jobId', description: 'Job ID to retrieve' }), (0, swagger_1.ApiResponse)({
    status: 200,
    description: 'Job details retrieved successfully',
}), (0, swagger_1.ApiResponse)({ status: 404, description: 'Job not found' }));
exports.ApiGetJobDetails = ApiGetJobDetails;
//# sourceMappingURL=openapi.decorator.js.map