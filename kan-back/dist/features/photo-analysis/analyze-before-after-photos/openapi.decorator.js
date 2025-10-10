"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiAnalyzeBeforeAfterPhotos = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const analyze_before_after_photos_request_dto_1 = require("./analyze-before-after-photos.request.dto");
const analyze_before_after_photos_response_dto_1 = require("./analyze-before-after-photos.response.dto");
const ApiAnalyzeBeforeAfterPhotos = () => (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
    summary: 'Анализ фото до и после стрижки',
    description: 'Анализирует фотографии до и после стрижки с помощью ИИ и оценивает качество работы',
}), (0, swagger_1.ApiBody)({ type: analyze_before_after_photos_request_dto_1.AnalyzeBeforeAfterPhotosRequestDto }), (0, swagger_1.ApiOkResponse)({
    description: 'Результат анализа фотографий',
    type: analyze_before_after_photos_response_dto_1.AnalyzeBeforeAfterPhotosResponseDto,
}));
exports.ApiAnalyzeBeforeAfterPhotos = ApiAnalyzeBeforeAfterPhotos;
//# sourceMappingURL=openapi.decorator.js.map