"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiReorderBoardColumns = ApiReorderBoardColumns;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reorder_board_columns_request_dto_1 = require("./reorder-board-columns.request.dto");
const reorder_board_columns_response_dto_1 = require("./reorder-board-columns.response.dto");
function ApiReorderBoardColumns() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiTags)('Kanban Management - Board Columns'), (0, swagger_1.ApiOperation)({
        summary: 'Reorder board columns',
        description: `
        Changes the order of columns on a kanban board. This endpoint supports:
        - Complete reordering of all columns
        - Partial reordering with validation
        - Position validation and conflict detection
        - Audit trail for layout changes
        - Workflow optimization tracking
        
        Common use cases:
        - Reorganize workflow to match new processes
        - Optimize board layout for team efficiency
        - Adjust column order based on priority changes
        - Implement new workflow stages
        - Fix incorrectly ordered columns
        
        Important notes:
        - Positions are 0-based indices
        - All positions must be unique
        - By default, all columns must be included in reorder
        - Changes are tracked in audit history
      `,
        operationId: 'reorderBoardColumns',
    }), (0, swagger_1.ApiBody)({
        type: reorder_board_columns_request_dto_1.ReorderBoardColumnsRequestDto,
        description: 'Board ID and new column order specification',
        examples: {
            completeReorder: {
                summary: 'Complete board reorder',
                description: 'Reorder all columns with new positions',
                value: {
                    boardId: 'board-123e4567-e89b-12d3-a456-426614174000',
                    columnOrder: [
                        { columnId: 'col-backlog', position: 0, columnName: 'Backlog' },
                        { columnId: 'col-todo', position: 1, columnName: 'To Do' },
                        {
                            columnId: 'col-progress',
                            position: 2,
                            columnName: 'In Progress',
                        },
                        { columnId: 'col-review', position: 3, columnName: 'Review' },
                        { columnId: 'col-done', position: 4, columnName: 'Done' },
                    ],
                    userId: 'user-123e4567-e89b-12d3-a456-426614174000',
                    reorderReason: 'Reorganizing workflow to match new development process',
                },
            },
            simpleSwap: {
                summary: 'Simple column swap',
                description: 'Swap two columns positions',
                value: {
                    boardId: 'board-123e4567-e89b-12d3-a456-426614174000',
                    columnOrder: [
                        { columnId: 'col-review', position: 0 },
                        { columnId: 'col-progress', position: 1 },
                        { columnId: 'col-todo', position: 2 },
                        { columnId: 'col-done', position: 3 },
                    ],
                    userId: 'user-123e4567-e89b-12d3-a456-426614174000',
                    reorderReason: 'Moving review column to the beginning for better visibility',
                },
            },
            workflowOptimization: {
                summary: 'Workflow optimization',
                description: 'Reorder to optimize team workflow',
                value: {
                    boardId: 'board-123e4567-e89b-12d3-a456-426614174000',
                    columnOrder: [
                        { columnId: 'col-ready', position: 0, columnName: 'Ready' },
                        {
                            columnId: 'col-development',
                            position: 1,
                            columnName: 'Development',
                        },
                        { columnId: 'col-testing', position: 2, columnName: 'Testing' },
                        {
                            columnId: 'col-deployment',
                            position: 3,
                            columnName: 'Deployment',
                        },
                        { columnId: 'col-complete', position: 4, columnName: 'Complete' },
                    ],
                    userId: 'user-123e4567-e89b-12d3-a456-426614174000',
                    reorderReason: 'Implementing new DevOps workflow stages',
                    validateComplete: true,
                },
            },
        },
    }), (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Board columns successfully reordered',
        type: reorder_board_columns_response_dto_1.ReorderBoardColumnsResponseDto,
        example: {
            boardId: 'board-123e4567-e89b-12d3-a456-426614174000',
            userId: 'user-123e4567-e89b-12d3-a456-426614174000',
            userName: 'John Doe',
            reorderedAt: '2024-01-15T10:30:00.000Z',
            reorderReason: 'Reorganizing workflow to match new development process',
            columnsChanged: 3,
            boardLayout: {
                boardId: 'board-123e4567-e89b-12d3-a456-426614174000',
                boardName: 'Project Kanban Board',
                totalColumns: 4,
                columns: [
                    {
                        columnId: 'col-backlog',
                        columnName: 'Backlog',
                        previousPosition: 3,
                        newPosition: 0,
                        positionChanged: true,
                    },
                    {
                        columnId: 'col-todo',
                        columnName: 'To Do',
                        previousPosition: 0,
                        newPosition: 1,
                        positionChanged: true,
                    },
                ],
            },
            success: true,
            historyLogId: 'hist-789e4567-e89b-12d3-a456-426614174000',
            changesSummary: 'Reordered 4 columns: moved "Backlog" from position 3 to 0, "To Do" from position 0 to 1',
            previousOrder: [0, 1, 2, 3],
            newOrder: [3, 0, 1, 2],
        },
    }), (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid request parameters or validation errors',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 400 },
                message: {
                    oneOf: [
                        {
                            type: 'string',
                            example: 'Duplicate positions found in column order',
                        },
                        {
                            type: 'string',
                            example: 'Invalid position range. Positions must be between 0 and 3',
                        },
                        { type: 'string', example: 'Column col-123 not found on board' },
                        {
                            type: 'string',
                            example: 'All columns must be included. Expected 4, got 3',
                        },
                    ],
                },
                error: { type: 'string', example: 'Bad Request' },
            },
        },
    }), (0, swagger_1.ApiNotFoundResponse)({
        description: 'Board not found',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 404 },
                message: {
                    type: 'string',
                    example: 'Board with ID board-123e4567-e89b-12d3-a456-426614174000 not found',
                },
                error: { type: 'string', example: 'Not Found' },
            },
        },
    }), (0, swagger_1.ApiInternalServerErrorResponse)({
        description: 'Internal server error during column reordering',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 500 },
                message: { type: 'string', example: 'Internal server error' },
                error: { type: 'string', example: 'Internal Server Error' },
            },
        },
    }));
}
//# sourceMappingURL=reorder-board-columns.openapi.decorator.js.map