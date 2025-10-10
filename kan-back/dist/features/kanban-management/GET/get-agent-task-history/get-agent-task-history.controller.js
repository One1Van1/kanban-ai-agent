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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAgentTaskHistoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_agent_task_history_service_1 = require("./get-agent-task-history.service");
const get_agent_task_history_request_dto_1 = require("./get-agent-task-history.request.dto");
const openapi_decorator_1 = require("./openapi.decorator");
let GetAgentTaskHistoryController = class GetAgentTaskHistoryController {
    service;
    constructor(service) {
        this.service = service;
    }
    async handle(agentId, query) {
        return this.service.execute(agentId, query);
    }
};
exports.GetAgentTaskHistoryController = GetAgentTaskHistoryController;
__decorate([
    (0, common_1.Get)('agent/:agentId'),
    (0, openapi_decorator_1.ApiGetAgentTaskHistory)(),
    __param(0, (0, common_1.Param)('agentId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, get_agent_task_history_request_dto_1.GetAgentTaskHistoryQueryDto]),
    __metadata("design:returntype", Promise)
], GetAgentTaskHistoryController.prototype, "handle", null);
exports.GetAgentTaskHistoryController = GetAgentTaskHistoryController = __decorate([
    (0, common_1.Controller)('database/task-history'),
    (0, swagger_1.ApiTags)('GetAgentTaskHistory'),
    __metadata("design:paramtypes", [get_agent_task_history_service_1.GetAgentTaskHistoryService])
], GetAgentTaskHistoryController);
//# sourceMappingURL=get-agent-task-history.controller.js.map