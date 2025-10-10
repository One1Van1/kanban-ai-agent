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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAvailableStatusesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_available_statuses_service_1 = require("./get-available-statuses.service");
const openapi_decorator_1 = require("./openapi.decorator");
let GetAvailableStatusesController = class GetAvailableStatusesController {
    service;
    constructor(service) {
        this.service = service;
    }
    async handle() {
        return this.service.execute();
    }
};
exports.GetAvailableStatusesController = GetAvailableStatusesController;
__decorate([
    (0, common_1.Get)(),
    (0, openapi_decorator_1.ApiGetAvailableStatuses)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GetAvailableStatusesController.prototype, "handle", null);
exports.GetAvailableStatusesController = GetAvailableStatusesController = __decorate([
    (0, common_1.Controller)('kanban/statuses'),
    (0, swagger_1.ApiTags)('GetAvailableStatuses'),
    __metadata("design:paramtypes", [get_available_statuses_service_1.GetAvailableStatusesService])
], GetAvailableStatusesController);
//# sourceMappingURL=get-available-statuses.controller.js.map