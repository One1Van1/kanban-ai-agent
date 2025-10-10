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
exports.GetColumnTasksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_column_tasks_service_1 = require("./get-column-tasks.service");
const get_column_tasks_request_dto_1 = require("./get-column-tasks.request.dto");
const openapi_decorator_1 = require("./openapi.decorator");
let GetColumnTasksController = class GetColumnTasksController {
    service;
    constructor(service) {
        this.service = service;
    }
    async handle(columnStatus, query) {
        const requestDto = new get_column_tasks_request_dto_1.GetColumnTasksRequestDto();
        requestDto.columnStatus = columnStatus;
        requestDto.maxResults = query.maxResults;
        requestDto.assignee = query.assignee;
        requestDto.priority = query.priority;
        return this.service.execute(requestDto);
    }
};
exports.GetColumnTasksController = GetColumnTasksController;
__decorate([
    (0, common_1.Get)(':columnStatus/tasks'),
    (0, openapi_decorator_1.ApiGetColumnTasks)(),
    __param(0, (0, common_1.Param)('columnStatus')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GetColumnTasksController.prototype, "handle", null);
exports.GetColumnTasksController = GetColumnTasksController = __decorate([
    (0, common_1.Controller)('jira/columns'),
    (0, swagger_1.ApiTags)('GetColumnTasks'),
    __metadata("design:paramtypes", [get_column_tasks_service_1.GetColumnTasksService])
], GetColumnTasksController);
//# sourceMappingURL=get-column-tasks.controller.js.map