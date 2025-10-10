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
exports.DeleteBoardColumnController = void 0;
const common_1 = require("@nestjs/common");
const delete_board_column_service_1 = require("./delete-board-column.service");
const delete_board_column_request_dto_1 = require("./delete-board-column.request.dto");
const delete_board_column_openapi_decorator_1 = require("./delete-board-column.openapi.decorator");
let DeleteBoardColumnController = class DeleteBoardColumnController {
    service;
    constructor(service) {
        this.service = service;
    }
    async deleteColumn(columnId, requestDto) {
        return this.service.deleteColumn(columnId, requestDto);
    }
};
exports.DeleteBoardColumnController = DeleteBoardColumnController;
__decorate([
    (0, common_1.Delete)('board-column/:columnId'),
    (0, delete_board_column_openapi_decorator_1.ApiDeleteBoardColumn)(),
    __param(0, (0, common_1.Param)('columnId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, delete_board_column_request_dto_1.DeleteBoardColumnRequestDto]),
    __metadata("design:returntype", Promise)
], DeleteBoardColumnController.prototype, "deleteColumn", null);
exports.DeleteBoardColumnController = DeleteBoardColumnController = __decorate([
    (0, common_1.Controller)('kanban-management'),
    __metadata("design:paramtypes", [delete_board_column_service_1.DeleteBoardColumnService])
], DeleteBoardColumnController);
//# sourceMappingURL=delete-board-column.controller.js.map