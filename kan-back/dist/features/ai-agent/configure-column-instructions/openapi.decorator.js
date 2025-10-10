"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiConfigureColumnInstructions = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const configure_column_instructions_response_dto_1 = require("./configure-column-instructions.response.dto");
const ApiConfigureColumnInstructions = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Configure column-specific instructions for AI agent',
    description: 'Sets up specific instructions and trigger conditions for an AI agent when tasks are in a particular Kanban column. This allows the agent to behave differently based on the task status/column.',
}), (0, swagger_1.ApiCreatedResponse)({
    type: configure_column_instructions_response_dto_1.ConfigureColumnInstructionsResponseDto,
    description: 'Column instructions configured successfully',
}), (0, swagger_1.ApiBadRequestResponse)({
    description: 'Invalid request data or agent/column validation failed',
}), (0, swagger_1.ApiInternalServerErrorResponse)({
    description: 'Internal server error occurred',
}));
exports.ApiConfigureColumnInstructions = ApiConfigureColumnInstructions;
//# sourceMappingURL=openapi.decorator.js.map