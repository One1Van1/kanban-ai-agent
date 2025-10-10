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
exports.GetCachedContextController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_cached_context_service_1 = require("./get-cached-context.service");
const openapi_decorator_1 = require("./openapi.decorator");
let GetCachedContextController = class GetCachedContextController {
    service;
    constructor(service) {
        this.service = service;
    }
    async handle(key) {
        return this.service.execute(key);
    }
};
exports.GetCachedContextController = GetCachedContextController;
__decorate([
    (0, common_1.Get)(':key'),
    (0, openapi_decorator_1.ApiGetCachedContext)(),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GetCachedContextController.prototype, "handle", null);
exports.GetCachedContextController = GetCachedContextController = __decorate([
    (0, common_1.Controller)('cache/context'),
    (0, swagger_1.ApiTags)('GetCachedContext'),
    __metadata("design:paramtypes", [get_cached_context_service_1.GetCachedContextService])
], GetCachedContextController);
//# sourceMappingURL=get-cached-context.controller.js.map