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
exports.CreateBoardColumnController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_board_column_service_1 = require("./create-board-column.service");
const create_board_column_request_dto_1 = require("./create-board-column.request.dto");
const create_board_column_openapi_decorator_1 = require("./create-board-column.openapi.decorator");
let CreateBoardColumnController = class CreateBoardColumnController {
    service;
    constructor(service) {
        this.service = service;
    }
    async createColumn(requestDto) {
        return this.service.createColumn(requestDto);
    }
};
exports.CreateBoardColumnController = CreateBoardColumnController;
__decorate([
    (0, common_1.Post)('columns'),
    (0, create_board_column_openapi_decorator_1.CreateBoardColumnOpenApi)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_board_column_request_dto_1.CreateBoardColumnRequestDto]),
    __metadata("design:returntype", Promise)
], CreateBoardColumnController.prototype, "createColumn", null);
exports.CreateBoardColumnController = CreateBoardColumnController = __decorate([
    (0, common_1.Controller)('kanban/boards'),
    (0, swagger_1.ApiTags)('CreateBoardColumn'),
    __metadata("design:paramtypes", [create_board_column_service_1.CreateBoardColumnService])
], CreateBoardColumnController);
//# sourceMappingURL=create-board-column.controller.js.map