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
exports.GetBoardStructureController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_board_structure_service_1 = require("./get-board-structure.service");
const get_board_structure_request_dto_1 = require("./get-board-structure.request.dto");
const openapi_decorator_1 = require("./openapi.decorator");
let GetBoardStructureController = class GetBoardStructureController {
    service;
    constructor(service) {
        this.service = service;
    }
    async handle(queryDto) {
        return this.service.execute(queryDto);
    }
};
exports.GetBoardStructureController = GetBoardStructureController;
__decorate([
    (0, common_1.Get)('structure'),
    (0, openapi_decorator_1.ApiGetBoardStructure)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_board_structure_request_dto_1.GetBoardStructureRequestDto]),
    __metadata("design:returntype", Promise)
], GetBoardStructureController.prototype, "handle", null);
exports.GetBoardStructureController = GetBoardStructureController = __decorate([
    (0, common_1.Controller)('kanban/board'),
    (0, swagger_1.ApiTags)('GetBoardStructure'),
    __metadata("design:paramtypes", [get_board_structure_service_1.GetBoardStructureService])
], GetBoardStructureController);
//# sourceMappingURL=get-board-structure.controller.js.map