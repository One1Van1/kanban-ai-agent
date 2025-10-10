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
exports.UpdateBoardColumnController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const update_board_column_service_1 = require("./update-board-column.service");
const update_board_column_request_dto_1 = require("./update-board-column.request.dto");
const update_board_column_openapi_decorator_1 = require("./update-board-column.openapi.decorator");
let UpdateBoardColumnController = class UpdateBoardColumnController {
    service;
    constructor(service) {
        this.service = service;
    }
    async updateColumn(columnId, requestDto) {
        return this.service.updateColumn(columnId, requestDto);
    }
};
exports.UpdateBoardColumnController = UpdateBoardColumnController;
__decorate([
    (0, common_1.Patch)(':id'),
    (0, update_board_column_openapi_decorator_1.UpdateBoardColumnOpenApi)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_board_column_request_dto_1.UpdateBoardColumnRequestDto]),
    __metadata("design:returntype", Promise)
], UpdateBoardColumnController.prototype, "updateColumn", null);
exports.UpdateBoardColumnController = UpdateBoardColumnController = __decorate([
    (0, common_1.Controller)('kanban/boards/columns'),
    (0, swagger_1.ApiTags)('UpdateBoardColumn'),
    __metadata("design:paramtypes", [update_board_column_service_1.UpdateBoardColumnService])
], UpdateBoardColumnController);
//# sourceMappingURL=update-board-column.controller.js.map