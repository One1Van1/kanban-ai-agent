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
exports.HealthCheckController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const health_check_service_1 = require("./health-check.service");
const openapi_decorator_1 = require("./openapi.decorator");
let HealthCheckController = class HealthCheckController {
    service;
    constructor(service) {
        this.service = service;
    }
    async handle() {
        return this.service.execute();
    }
};
exports.HealthCheckController = HealthCheckController;
__decorate([
    (0, common_1.Get)('health'),
    (0, openapi_decorator_1.ApiHealthCheck)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthCheckController.prototype, "handle", null);
exports.HealthCheckController = HealthCheckController = __decorate([
    (0, common_1.Controller)('jira'),
    (0, swagger_1.ApiTags)('HealthCheck'),
    __metadata("design:paramtypes", [health_check_service_1.HealthCheckService])
], HealthCheckController);
//# sourceMappingURL=health-check.controller.js.map