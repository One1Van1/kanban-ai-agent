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
exports.UpdateCommentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const update_comment_service_1 = require("./update-comment.service");
const update_comment_request_dto_1 = require("./update-comment.request.dto");
const update_comment_openapi_decorator_1 = require("./update-comment.openapi.decorator");
let UpdateCommentController = class UpdateCommentController {
    service;
    constructor(service) {
        this.service = service;
    }
    async handle(commentId, requestDto) {
        return this.service.execute(commentId, requestDto);
    }
};
exports.UpdateCommentController = UpdateCommentController;
__decorate([
    (0, common_1.Patch)('comment/:commentId'),
    (0, update_comment_openapi_decorator_1.ApiUpdateComment)(),
    __param(0, (0, common_1.Param)('commentId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_comment_request_dto_1.UpdateCommentRequestDto]),
    __metadata("design:returntype", Promise)
], UpdateCommentController.prototype, "handle", null);
exports.UpdateCommentController = UpdateCommentController = __decorate([
    (0, common_1.Controller)('kanban-management'),
    (0, swagger_1.ApiTags)('UpdateComment'),
    __metadata("design:paramtypes", [update_comment_service_1.UpdateCommentService])
], UpdateCommentController);
//# sourceMappingURL=update-comment.controller.js.map