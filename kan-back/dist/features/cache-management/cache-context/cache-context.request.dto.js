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
exports.CacheContextRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CacheContextRequestDto {
    key;
    contextData;
    ttl;
}
exports.CacheContextRequestDto = CacheContextRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique cache key for storing context',
        example: 'task-123-context',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CacheContextRequestDto.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Context data to cache',
        example: {
            taskId: 'TASK-123',
            relatedTasks: ['TASK-124', 'TASK-125'],
            userComments: ['Great work!', 'Needs review'],
            externalData: { jiraStatus: 'In Progress' },
        },
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CacheContextRequestDto.prototype, "contextData", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'TTL in seconds (optional, uses default if not provided)',
        example: 600,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CacheContextRequestDto.prototype, "ttl", void 0);
//# sourceMappingURL=cache-context.request.dto.js.map