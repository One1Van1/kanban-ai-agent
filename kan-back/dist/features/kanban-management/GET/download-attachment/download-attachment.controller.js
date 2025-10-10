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
exports.DownloadAttachmentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const download_attachment_service_1 = require("./download-attachment.service");
const download_attachment_query_dto_1 = require("./download-attachment.query.dto");
const download_attachment_openapi_decorator_1 = require("./download-attachment.openapi.decorator");
let DownloadAttachmentController = class DownloadAttachmentController {
    service;
    constructor(service) {
        this.service = service;
    }
    async handle(attachmentId, query, res) {
        return this.service.execute(attachmentId, query, res);
    }
};
exports.DownloadAttachmentController = DownloadAttachmentController;
__decorate([
    (0, common_1.Get)('attachment/:attachmentId/download'),
    (0, download_attachment_openapi_decorator_1.ApiDownloadAttachment)(),
    __param(0, (0, common_1.Param)('attachmentId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, download_attachment_query_dto_1.DownloadAttachmentQueryDto, Object]),
    __metadata("design:returntype", Promise)
], DownloadAttachmentController.prototype, "handle", null);
exports.DownloadAttachmentController = DownloadAttachmentController = __decorate([
    (0, common_1.Controller)('kanban-management'),
    (0, swagger_1.ApiTags)('DownloadAttachment'),
    __metadata("design:paramtypes", [download_attachment_service_1.DownloadAttachmentService])
], DownloadAttachmentController);
//# sourceMappingURL=download-attachment.controller.js.map