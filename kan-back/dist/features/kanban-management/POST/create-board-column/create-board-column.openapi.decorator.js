"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBoardColumnOpenApi = CreateBoardColumnOpenApi;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_board_column_request_dto_1 = require("./create-board-column.request.dto");
const create_board_column_response_dto_1 = require("./create-board-column.response.dto");
function CreateBoardColumnOpenApi() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
        summary: 'Create new board column',
        description: 'Creates a new column in the specified board with position and configuration',
    }), (0, swagger_1.ApiBody)({
        type: create_board_column_request_dto_1.CreateBoardColumnRequestDto,
        description: 'Column creation parameters',
        examples: {
            customColumn: {
                summary: 'Custom Column',
                description: 'Create a custom testing column',
                value: {
                    boardId: 'board-001',
                    name: 'Ready for Testing',
                    type: 'custom',
                    position: 2,
                    description: 'Tasks ready for QA testing',
                    color: '#4CAF50',
                    wipLimit: 5,
                    createdBy: 'agent-001',
                },
            },
            standardColumn: {
                summary: 'Standard Column',
                description: 'Create a standard in_progress column',
                value: {
                    boardId: 'board-001',
                    name: 'In Progress',
                    type: 'in_progress',
                    position: 1,
                    description: 'Tasks currently being worked on',
                    color: '#FF9800',
                    wipLimit: 3,
                    createdBy: 'agent-001',
                },
            },
            simpleColumn: {
                summary: 'Simple Column',
                description: 'Create a basic column with minimal configuration',
                value: {
                    boardId: 'board-001',
                    name: 'Backlog',
                    type: 'todo',
                    position: 0,
                    createdBy: 'agent-001',
                },
            },
        },
    }), (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Column created successfully',
        type: create_board_column_response_dto_1.CreateBoardColumnResponseDto,
    }), (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid input data or position',
        schema: {
            example: {
                statusCode: 400,
                message: 'Invalid position 5. Must be between 0 and 3',
                error: 'Bad Request',
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
        description: 'Internal server error during column creation',
        schema: {
            example: {
                statusCode: 500,
                message: 'Failed to create board column',
                error: 'Internal Server Error',
            },
        },
    }));
}
//# sourceMappingURL=create-board-column.openapi.decorator.js.map