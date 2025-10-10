"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiExecuteAgentAction = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const execute_agent_action_response_dto_1 = require("./execute-agent-action.response.dto");
const ApiExecuteAgentAction = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Execute AI agent action based on task events',
    description: 'Triggers the AI agent to perform actions based on task events like moving to a column, assignment changes, etc. The agent will analyze the task context and execute appropriate actions according to its configured instructions.',
}), (0, swagger_1.ApiOkResponse)({
    type: execute_agent_action_response_dto_1.ExecuteAgentActionResponseDto,
    description: 'Agent action executed successfully',
}), (0, swagger_1.ApiBadRequestResponse)({
    description: 'Invalid request data or missing required fields',
}), (0, swagger_1.ApiInternalServerErrorResponse)({
    description: 'Internal server error during agent execution',
}));
exports.ApiExecuteAgentAction = ApiExecuteAgentAction;
//# sourceMappingURL=openapi.decorator.js.map