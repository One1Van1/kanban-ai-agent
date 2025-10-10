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
exports.CacheContextController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cache_context_service_1 = require("./cache-context.service");
const cache_context_request_dto_1 = require("./cache-context.request.dto");
const openapi_decorator_1 = require("./openapi.decorator");
let CacheContextController = class CacheContextController {
    service;
    constructor(service) {
        this.service = service;
    }
    async handle(request) {
        return this.service.execute(request);
    }
};
exports.CacheContextController = CacheContextController;
__decorate([
    (0, common_1.Post)(),
    (0, openapi_decorator_1.ApiCacheContext)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cache_context_request_dto_1.CacheContextRequestDto]),
    __metadata("design:returntype", Promise)
], CacheContextController.prototype, "handle", null);
exports.CacheContextController = CacheContextController = __decorate([
    (0, common_1.Controller)('cache/context'),
    (0, swagger_1.ApiTags)('CacheContext'),
    __metadata("design:paramtypes", [cache_context_service_1.CacheContextService])
], CacheContextController);
//# sourceMappingURL=cache-context.controller.js.map