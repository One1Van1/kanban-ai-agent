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
exports.GetUserActivityController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_user_activity_service_1 = require("./get-user-activity.service");
const get_user_activity_request_dto_1 = require("./get-user-activity.request.dto");
const openapi_decorator_1 = require("./openapi.decorator");
let GetUserActivityController = class GetUserActivityController {
    service;
    constructor(service) {
        this.service = service;
    }
    async handle(userId, query) {
        return this.service.execute(userId, query);
    }
};
exports.GetUserActivityController = GetUserActivityController;
__decorate([
    (0, common_1.Get)(':id/activity'),
    (0, openapi_decorator_1.ApiGetUserActivity)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, get_user_activity_request_dto_1.GetUserActivityRequestDto]),
    __metadata("design:returntype", Promise)
], GetUserActivityController.prototype, "handle", null);
exports.GetUserActivityController = GetUserActivityController = __decorate([
    (0, common_1.Controller)('kanban/users'),
    (0, swagger_1.ApiTags)('GetUserActivity'),
    __metadata("design:paramtypes", [get_user_activity_service_1.GetUserActivityService])
], GetUserActivityController);
//# sourceMappingURL=get-user-activity.controller.js.map