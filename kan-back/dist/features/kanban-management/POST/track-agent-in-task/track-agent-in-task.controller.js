"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var TrackAgentInTaskController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackAgentInTaskController = void 0;
const common_1 = require("@nestjs/common");
const track_agent_in_task_service_1 = require("./track-agent-in-task.service");
const track_agent_in_task_request_dto_1 = require("./track-agent-in-task.request.dto");
const track_agent_in_task_openapi_decorator_1 = require("./track-agent-in-task.openapi.decorator");
let TrackAgentInTaskController = TrackAgentInTaskController_1 = class TrackAgentInTaskController {
    trackAgentInTaskService;
    logger = new common_1.Logger(TrackAgentInTaskController_1.name);
    constructor(trackAgentInTaskService) {
        this.trackAgentInTaskService = trackAgentInTaskService;
    }
    async trackAgentInTask(agentId, requestDto) {
        try {
            this.logger.log(`Received request to track agent ${agentId} in task ${requestDto.taskId}`);
            if (!agentId || agentId.trim() === '') {
                throw new common_1.HttpException('Agent ID is required', common_1.HttpStatus.BAD_REQUEST);
            }
            const result = await this.trackAgentInTaskService.execute(agentId, requestDto);
            this.logger.log(`Successfully started tracking for agent ${agentId} in task ${requestDto.taskId}`);
            return result;
        }
        catch (error) {
            this.logger.error(`Failed to track agent ${agentId} in task: ${error.message}`, error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            if (error.message.includes('not found')) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
            }
            if (error.message.includes('not active')) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
            }
            throw new common_1.HttpException('Internal server error while tracking agent in task', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.TrackAgentInTaskController = TrackAgentInTaskController;
__decorate([
    (0, common_1.Post)('track-agent-in-task/:agentId'),
    (0, track_agent_in_task_openapi_decorator_1.TrackAgentInTaskOpenApiDecorator)(),
    __param(0, (0, common_1.Param)('agentId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, track_agent_in_task_request_dto_1.TrackAgentInTaskRequestDto]),
    __metadata("design:returntype", Promise)
], TrackAgentInTaskController.prototype, "trackAgentInTask", null);
exports.TrackAgentInTaskController = TrackAgentInTaskController = TrackAgentInTaskController_1 = __decorate([
    (0, common_1.Controller)('ai-agent'),
    __metadata("design:paramtypes", [track_agent_in_task_service_1.TrackAgentInTaskService])
], TrackAgentInTaskController);
//# sourceMappingURL=track-agent-in-task.controller.js.map