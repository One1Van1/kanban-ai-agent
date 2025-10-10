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
exports.GetTasksByColumnController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_tasks_by_column_service_1 = require("./get-tasks-by-column.service");
const get_tasks_by_column_query_dto_1 = require("./get-tasks-by-column.query.dto");
const openapi_decorator_1 = require("./openapi.decorator");
let GetTasksByColumnController = class GetTasksByColumnController {
    service;
    constructor(service) {
        this.service = service;
    }
    async handle(column, query) {
        return this.service.execute(column, query);
    }
};
exports.GetTasksByColumnController = GetTasksByColumnController;
__decorate([
    (0, common_1.Get)(':column/tasks'),
    (0, openapi_decorator_1.ApiGetTasksByColumn)(),
    __param(0, (0, common_1.Param)('column')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, get_tasks_by_column_query_dto_1.GetTasksByColumnQueryDto]),
    __metadata("design:returntype", Promise)
], GetTasksByColumnController.prototype, "handle", null);
exports.GetTasksByColumnController = GetTasksByColumnController = __decorate([
    (0, common_1.Controller)('kanban/columns'),
    (0, swagger_1.ApiTags)('GetTasksByColumn'),
    __metadata("design:paramtypes", [get_tasks_by_column_service_1.GetTasksByColumnService])
], GetTasksByColumnController);
//# sourceMappingURL=get-tasks-by-column.controller.js.map