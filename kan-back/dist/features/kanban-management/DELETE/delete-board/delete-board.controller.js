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
exports.DeleteBoardController = void 0;
const common_1 = require("@nestjs/common");
const delete_board_service_1 = require("./delete-board.service");
const delete_board_request_dto_1 = require("./delete-board.request.dto");
const delete_board_openapi_decorator_1 = require("./delete-board.openapi.decorator");
let DeleteBoardController = class DeleteBoardController {
    service;
    constructor(service) {
        this.service = service;
    }
    async deleteBoard(boardId, requestDto) {
        return this.service.deleteBoard(boardId, requestDto);
    }
};
exports.DeleteBoardController = DeleteBoardController;
__decorate([
    (0, common_1.Delete)('board/:boardId'),
    (0, delete_board_openapi_decorator_1.ApiDeleteBoard)(),
    __param(0, (0, common_1.Param)('boardId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, delete_board_request_dto_1.DeleteBoardRequestDto]),
    __metadata("design:returntype", Promise)
], DeleteBoardController.prototype, "deleteBoard", null);
exports.DeleteBoardController = DeleteBoardController = __decorate([
    (0, common_1.Controller)('kanban-management'),
    __metadata("design:paramtypes", [delete_board_service_1.DeleteBoardService])
], DeleteBoardController);
//# sourceMappingURL=delete-board.controller.js.map