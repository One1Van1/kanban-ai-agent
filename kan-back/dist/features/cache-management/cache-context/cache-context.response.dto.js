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
exports.CacheContextResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CacheContextResponseDto {
    success;
    cacheKey;
    ttl;
    cachedAt;
    message;
    constructor(success, cacheKey, ttl, message) {
        this.success = success;
        this.cacheKey = cacheKey;
        this.ttl = ttl;
        this.cachedAt = new Date().toISOString();
        this.message = message;
    }
}
exports.CacheContextResponseDto = CacheContextResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indicates if context was cached successfully',
        example: true,
    }),
    __metadata("design:type", Boolean)
], CacheContextResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cache key where context was stored',
        example: 'task-123-context',
    }),
    __metadata("design:type", String)
], CacheContextResponseDto.prototype, "cacheKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'TTL applied to the cached data in seconds',
        example: 600,
    }),
    __metadata("design:type", Number)
], CacheContextResponseDto.prototype, "ttl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when context was cached',
        example: '2025-10-05T14:33:21.000Z',
    }),
    __metadata("design:type", String)
], CacheContextResponseDto.prototype, "cachedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Success message',
        example: 'Context cached successfully',
    }),
    __metadata("design:type", String)
], CacheContextResponseDto.prototype, "message", void 0);
//# sourceMappingURL=cache-context.response.dto.js.map