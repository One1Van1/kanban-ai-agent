"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackAgentInTaskOpenApiDecorator = TrackAgentInTaskOpenApiDecorator;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const track_agent_in_task_request_dto_1 = require("./track-agent-in-task.request.dto");
const track_agent_in_task_response_dto_1 = require("./track-agent-in-task.response.dto");
function TrackAgentInTaskOpenApiDecorator() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiTags)('AI Agent'), (0, swagger_1.ApiOperation)({
        summary: 'Track AI agent in specific task',
        description: 'Assigns an AI agent to track and work on a specific Jira task in a kanban board',
    }), (0, swagger_1.ApiParam)({
        name: 'agentId',
        description: 'Unique identifier of the AI agent',
        type: 'string',
        example: 'agent-123e4567-e89b-12d3-a456-426614174000',
    }), (0, swagger_1.ApiBody)({
        type: track_agent_in_task_request_dto_1.TrackAgentInTaskRequestDto,
        description: 'Task tracking configuration',
    }), (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Agent successfully assigned to track the task',
        type: track_agent_in_task_response_dto_1.TrackAgentInTaskResponseDto,
    }), (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - invalid agent ID or agent not active',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 400 },
                message: {
                    type: 'string',
                    example: 'Agent agent-123 is not active and cannot track tasks',
                },
                error: { type: 'string', example: 'Bad Request' },
            },
        },
    }), (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Agent not found',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 404 },
                message: {
                    type: 'string',
                    example: 'Agent with ID agent-123 not found',
                },
                error: { type: 'string', example: 'Not Found' },
            },
        },
    }), (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 500 },
                message: {
                    type: 'string',
                    example: 'Internal server error while tracking agent in task',
                },
                error: { type: 'string', example: 'Internal Server Error' },
            },
        },
    }));
}
//# sourceMappingURL=track-agent-in-task.openapi.decorator.js.map