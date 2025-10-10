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
exports.CacheAgentConfigsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cache_agent_configs_service_1 = require("./cache-agent-configs.service");
const cache_agent_configs_request_dto_1 = require("./cache-agent-configs.request.dto");
const openapi_decorator_1 = require("./openapi.decorator");
let CacheAgentConfigsController = class CacheAgentConfigsController {
    service;
    constructor(service) {
        this.service = service;
    }
    async handle(request) {
        return this.service.execute(request);
    }
};
exports.CacheAgentConfigsController = CacheAgentConfigsController;
__decorate([
    (0, common_1.Post)(),
    (0, openapi_decorator_1.ApiCacheAgentConfigs)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cache_agent_configs_request_dto_1.CacheAgentConfigsRequestDto]),
    __metadata("design:returntype", Promise)
], CacheAgentConfigsController.prototype, "handle", null);
exports.CacheAgentConfigsController = CacheAgentConfigsController = __decorate([
    (0, common_1.Controller)('cache/agent-configs'),
    (0, swagger_1.ApiTags)('CacheAgentConfigs'),
    __metadata("design:paramtypes", [cache_agent_configs_service_1.CacheAgentConfigsService])
], CacheAgentConfigsController);
//# sourceMappingURL=cache-agent-configs.controller.js.map