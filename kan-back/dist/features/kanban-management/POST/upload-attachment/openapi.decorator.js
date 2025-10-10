"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiUploadAttachment = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const upload_attachment_response_dto_1 = require("./upload-attachment.response.dto");
const ApiUploadAttachment = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Upload attachment to task',
    description: 'Uploads a file attachment to a specific task with validation and storage',
}), (0, swagger_1.ApiParam)({
    name: 'id',
    description: 'Task ID',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
}), (0, swagger_1.ApiCreatedResponse)({
    type: upload_attachment_response_dto_1.UploadAttachmentResponseDto,
    description: 'File uploaded successfully',
}), (0, swagger_1.ApiBadRequestResponse)({
    description: 'Invalid file format, size exceeded, or invalid file content',
}));
exports.ApiUploadAttachment = ApiUploadAttachment;
//# sourceMappingURL=openapi.decorator.js.map