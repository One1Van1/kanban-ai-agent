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
exports.FetchExternalContextController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const fetch_external_context_service_1 = require("./fetch-external-context.service");
const fetch_external_context_query_dto_1 = require("./fetch-external-context.query.dto");
const openapi_decorator_1 = require("./openapi.decorator");
let FetchExternalContextController = class FetchExternalContextController {
    service;
    constructor(service) {
        this.service = service;
    }
    async handle(taskId, query) {
        return this.service.execute(taskId, query);
    }
};
exports.FetchExternalContextController = FetchExternalContextController;
__decorate([
    (0, common_1.Get)(':taskId'),
    (0, openapi_decorator_1.ApiFetchExternalContext)(),
    __param(0, (0, common_1.Param)('taskId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, fetch_external_context_query_dto_1.FetchExternalContextQueryDto]),
    __metadata("design:returntype", Promise)
], FetchExternalContextController.prototype, "handle", null);
exports.FetchExternalContextController = FetchExternalContextController = __decorate([
    (0, common_1.Controller)('context-management/external-context'),
    (0, swagger_1.ApiTags)('FetchExternalContext'),
    __metadata("design:paramtypes", [fetch_external_context_service_1.FetchExternalContextService])
], FetchExternalContextController);
//# sourceMappingURL=fetch-external-context.controller.js.map