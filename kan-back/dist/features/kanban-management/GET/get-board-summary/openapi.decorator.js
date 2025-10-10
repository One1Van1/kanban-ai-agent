"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiGetBoardSummary = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_board_summary_response_dto_1 = require("./get-board-summary.response.dto");
const ApiGetBoardSummary = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Get kanban board summary statistics',
    description: 'Retrieves comprehensive statistics for the kanban board including column counts, priorities, and optional detailed metrics',
}), (0, swagger_1.ApiQuery)({
    name: 'boardId',
    required: false,
    description: 'Board ID to get summary for',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
}), (0, swagger_1.ApiQuery)({
    name: 'includeDetails',
    required: false,
    description: 'Include detailed statistics',
    example: true,
}), (0, swagger_1.ApiOkResponse)({
    type: get_board_summary_response_dto_1.GetBoardSummaryResponseDto,
    description: 'Board summary retrieved successfully',
}));
exports.ApiGetBoardSummary = ApiGetBoardSummary;
//# sourceMappingURL=openapi.decorator.js.map