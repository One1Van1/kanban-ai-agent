"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiAttachFile = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const attach_file_request_dto_1 = require("./attach-file.request.dto");
const attach_file_response_dto_1 = require("./attach-file.response.dto");
const ApiAttachFile = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Прикрепить файл к задаче',
    description: 'Прикрепляет файл к указанной задаче в Jira',
}), (0, swagger_1.ApiParam)({
    name: 'taskKey',
    description: 'Ключ задачи в Jira',
    example: 'KAN-5',
}), (0, swagger_1.ApiBody)({ type: attach_file_request_dto_1.AttachFileRequestDto }), (0, swagger_1.ApiOkResponse)({
    description: 'Файл успешно прикреплен',
    type: attach_file_response_dto_1.AttachFileResponseDto,
}));
exports.ApiAttachFile = ApiAttachFile;
//# sourceMappingURL=openapi.decorator.js.map