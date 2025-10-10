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
exports.StoreTaskHistoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const store_task_history_service_1 = require("./store-task-history.service");
const store_task_history_request_dto_1 = require("./store-task-history.request.dto");
const openapi_decorator_1 = require("./openapi.decorator");
let StoreTaskHistoryController = class StoreTaskHistoryController {
    service;
    constructor(service) {
        this.service = service;
    }
    async handle(requestDto) {
        return this.service.execute(requestDto);
    }
};
exports.StoreTaskHistoryController = StoreTaskHistoryController;
__decorate([
    (0, common_1.Post)('store'),
    (0, openapi_decorator_1.ApiStoreTaskHistory)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [store_task_history_request_dto_1.StoreTaskHistoryRequestDto]),
    __metadata("design:returntype", Promise)
], StoreTaskHistoryController.prototype, "handle", null);
exports.StoreTaskHistoryController = StoreTaskHistoryController = __decorate([
    (0, common_1.Controller)('database/task-history'),
    (0, swagger_1.ApiTags)('StoreTaskHistory'),
    __metadata("design:paramtypes", [store_task_history_service_1.StoreTaskHistoryService])
], StoreTaskHistoryController);
//# sourceMappingURL=store-task-history.controller.js.map