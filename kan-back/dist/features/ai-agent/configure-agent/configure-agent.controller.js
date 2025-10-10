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
var ConfigureAgentController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigureAgentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const configure_agent_service_1 = require("./configure-agent.service");
const configure_agent_request_dto_1 = require("./configure-agent.request.dto");
const openapi_decorator_1 = require("./openapi.decorator");
let ConfigureAgentController = ConfigureAgentController_1 = class ConfigureAgentController {
    configureAgentService;
    logger = new common_1.Logger(ConfigureAgentController_1.name);
    constructor(configureAgentService) {
        this.configureAgentService = configureAgentService;
    }
    async handle(agentId, requestDto) {
        this.logger.log(`Received request to configure AI agent: ${agentId}`);
        return this.configureAgentService.execute(agentId, requestDto);
    }
};
exports.ConfigureAgentController = ConfigureAgentController;
__decorate([
    (0, common_1.Put)(':agentId/configure'),
    (0, openapi_decorator_1.ApiConfigureAgent)(),
    __param(0, (0, common_1.Param)('agentId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, configure_agent_request_dto_1.ConfigureAgentRequestDto]),
    __metadata("design:returntype", Promise)
], ConfigureAgentController.prototype, "handle", null);
exports.ConfigureAgentController = ConfigureAgentController = ConfigureAgentController_1 = __decorate([
    (0, common_1.Controller)('ai-agent'),
    (0, swagger_1.ApiTags)('ConfigureAgent'),
    __metadata("design:paramtypes", [configure_agent_service_1.ConfigureAgentService])
], ConfigureAgentController);
//# sourceMappingURL=configure-agent.controller.js.map