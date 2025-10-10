"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiGetAvailableStatuses = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_available_statuses_response_dto_1 = require("./get-available-statuses.response.dto");
const ApiGetAvailableStatuses = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Get all available task statuses',
    description: 'Retrieves all possible task statuses with transitions and metadata',
}), (0, swagger_1.ApiOkResponse)({
    type: get_available_statuses_response_dto_1.GetAvailableStatusesResponseDto,
    description: 'Available statuses retrieved successfully',
}));
exports.ApiGetAvailableStatuses = ApiGetAvailableStatuses;
//# sourceMappingURL=openapi.decorator.js.map