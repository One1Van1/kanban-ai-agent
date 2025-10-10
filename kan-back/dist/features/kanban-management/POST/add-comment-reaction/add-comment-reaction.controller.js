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
exports.AddCommentReactionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const add_comment_reaction_service_1 = require("./add-comment-reaction.service");
const add_comment_reaction_request_dto_1 = require("./add-comment-reaction.request.dto");
const add_comment_reaction_openapi_decorator_1 = require("./add-comment-reaction.openapi.decorator");
let AddCommentReactionController = class AddCommentReactionController {
    service;
    constructor(service) {
        this.service = service;
    }
    async handle(commentId, requestDto) {
        return this.service.execute(commentId, requestDto);
    }
};
exports.AddCommentReactionController = AddCommentReactionController;
__decorate([
    (0, common_1.Post)('comment/:commentId/reactions'),
    (0, add_comment_reaction_openapi_decorator_1.ApiAddCommentReaction)(),
    __param(0, (0, common_1.Param)('commentId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, add_comment_reaction_request_dto_1.AddCommentReactionRequestDto]),
    __metadata("design:returntype", Promise)
], AddCommentReactionController.prototype, "handle", null);
exports.AddCommentReactionController = AddCommentReactionController = __decorate([
    (0, common_1.Controller)('kanban-management'),
    (0, swagger_1.ApiTags)('AddCommentReaction'),
    __metadata("design:paramtypes", [add_comment_reaction_service_1.AddCommentReactionService])
], AddCommentReactionController);
//# sourceMappingURL=add-comment-reaction.controller.js.map