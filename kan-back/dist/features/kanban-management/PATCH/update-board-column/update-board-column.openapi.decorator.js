"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBoardColumnOpenApi = UpdateBoardColumnOpenApi;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const update_board_column_request_dto_1 = require("./update-board-column.request.dto");
const update_board_column_response_dto_1 = require("./update-board-column.response.dto");
function UpdateBoardColumnOpenApi() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
        summary: 'Update board column',
        description: 'Updates board column properties like name, position, WIP limit, color, etc. with change tracking',
    }), (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Unique identifier of the column to update',
        example: 'col-a8f5f167-aa89-4f26-a2b1-2b5e4b9b2c8a',
    }), (0, swagger_1.ApiBody)({
        type: update_board_column_request_dto_1.UpdateBoardColumnRequestDto,
        description: 'Column update parameters',
        examples: {
            nameAndColor: {
                summary: 'Update Name and Color',
                description: 'Update column name and visual appearance',
                value: {
                    name: 'Ready for QA Testing',
                    color: '#2196F3',
                    description: 'Tasks that are ready for quality assurance testing',
                    updatedBy: 'agent-001',
                    updateComment: 'Renamed column for clarity and updated color',
                },
            },
            wipLimitUpdate: {
                summary: 'Update WIP Limit',
                description: 'Adjust work-in-progress limit for better flow',
                value: {
                    wipLimit: 8,
                    updatedBy: 'agent-001',
                    updateComment: 'Increased WIP limit to accommodate team growth',
                },
            },
            positionChange: {
                summary: 'Change Position',
                description: 'Move column to different position in board',
                value: {
                    position: 3,
                    updatedBy: 'agent-001',
                    updateComment: 'Moved column to better reflect workflow order',
                },
            },
            deactivateColumn: {
                summary: 'Deactivate Column',
                description: 'Temporarily disable column without deleting',
                value: {
                    isActive: false,
                    updatedBy: 'agent-001',
                    updateComment: 'Temporarily disabling column during workflow restructure',
                },
            },
            comprehensiveUpdate: {
                summary: 'Comprehensive Update',
                description: 'Update multiple column properties',
                value: {
                    name: 'Quality Assurance',
                    type: 'custom',
                    description: 'Comprehensive quality assurance and testing phase',
                    color: '#9C27B0',
                    wipLimit: 5,
                    position: 4,
                    updatedBy: 'agent-001',
                    updateComment: 'Complete column restructure for improved workflow',
                },
            },
        },
    }), (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Column updated successfully',
        type: update_board_column_response_dto_1.UpdateBoardColumnResponseDto,
    }), (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid input data or no fields to update',
        schema: {
            example: {
                statusCode: 400,
                message: 'No fields to update provided',
                error: 'Bad Request',
            },
        },
    }), (0, swagger_1.ApiNotFoundResponse)({
        description: 'Column not found',
        schema: {
            example: {
                statusCode: 404,
                message: 'Column with ID col-a8f5f167-aa89-4f26-a2b1-2b5e4b9b2c8a not found',
                error: 'Not Found',
            },
        },
    }), (0, swagger_1.ApiConflictResponse)({
        description: 'Column with same name already exists',
        schema: {
            example: {
                statusCode: 409,
                message: 'Column with name "In Progress" already exists in board board-001',
                error: 'Conflict',
            },
        },
    }), (0, swagger_1.ApiInternalServerErrorResponse)({
        description: 'Internal server error during column update',
        schema: {
            example: {
                statusCode: 500,
                message: 'Failed to update board column',
                error: 'Internal Server Error',
            },
        },
    }));
}
//# sourceMappingURL=update-board-column.openapi.decorator.js.map