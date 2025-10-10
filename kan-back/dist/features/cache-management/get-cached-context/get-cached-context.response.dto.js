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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCachedContextResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class GetCachedContextResponseDto {
    found;
    cacheKey;
    contextData;
    message;
    retrievedAt;
    constructor(found, cacheKey, contextData, message) {
        this.found = found;
        this.cacheKey = cacheKey;
        this.contextData = contextData;
        this.message = message;
        this.retrievedAt = new Date().toISOString();
    }
}
exports.GetCachedContextResponseDto = GetCachedContextResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indicates if context was found in cache',
        example: true,
    }),
    __metadata("design:type", Boolean)
], GetCachedContextResponseDto.prototype, "found", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cache key that was requested',
        example: 'task-123-context',
    }),
    __metadata("design:type", String)
], GetCachedContextResponseDto.prototype, "cacheKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cached context data (null if not found)',
        example: {
            taskId: 'TASK-123',
            relatedTasks: ['TASK-124', 'TASK-125'],
            userComments: ['Great work!', 'Needs review'],
            externalData: { jiraStatus: 'In Progress' },
        },
    }),
    __metadata("design:type", Object)
], GetCachedContextResponseDto.prototype, "contextData", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Message about retrieval result',
        example: 'Context retrieved successfully',
    }),
    __metadata("design:type", String)
], GetCachedContextResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when context was retrieved',
        example: '2025-10-05T14:33:21.000Z',
    }),
    __metadata("design:type", String)
], GetCachedContextResponseDto.prototype, "retrievedAt", void 0);
//# sourceMappingURL=get-cached-context.response.dto.js.map