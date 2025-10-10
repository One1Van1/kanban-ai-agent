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
var CreateAgentController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAgentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_agent_service_1 = require("./create-agent.service");
const create_agent_request_dto_1 = require("./create-agent.request.dto");
const openapi_decorator_1 = require("./openapi.decorator");
let CreateAgentController = CreateAgentController_1 = class CreateAgentController {
    createAgentService;
    logger = new common_1.Logger(CreateAgentController_1.name);
    constructor(createAgentService) {
        this.createAgentService = createAgentService;
    }
    async handle(requestDto) {
        this.logger.log(`Received request to create AI agent: ${requestDto.name}`);
        return this.createAgentService.execute(requestDto);
    }
};
exports.CreateAgentController = CreateAgentController;
__decorate([
    (0, common_1.Post)(),
    (0, openapi_decorator_1.ApiCreateAgent)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_agent_request_dto_1.CreateAgentRequestDto]),
    __metadata("design:returntype", Promise)
], CreateAgentController.prototype, "handle", null);
exports.CreateAgentController = CreateAgentController = CreateAgentController_1 = __decorate([
    (0, common_1.Controller)('ai-agent'),
    (0, swagger_1.ApiTags)('CreateAgent'),
    __metadata("design:paramtypes", [create_agent_service_1.CreateAgentService])
], CreateAgentController);
//# sourceMappingURL=create-agent.controller.js.map