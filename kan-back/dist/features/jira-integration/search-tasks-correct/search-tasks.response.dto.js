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
exports.SearchTasksResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class SearchTasksResponseDto {
    issues;
    total;
    startAt;
    maxResults;
    constructor(issues, total, startAt, maxResults) {
        this.issues = issues;
        this.total = total;
        this.startAt = startAt;
        this.maxResults = maxResults;
    }
}
exports.SearchTasksResponseDto = SearchTasksResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Найденные задачи',
        type: 'array',
        items: {
            type: 'object',
            properties: {
                key: { type: 'string', example: 'KAN-5' },
                fields: { type: 'object' },
            },
        },
    }),
    __metadata("design:type", Array)
], SearchTasksResponseDto.prototype, "issues", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Общее количество задач',
        example: 156,
    }),
    __metadata("design:type", Number)
], SearchTasksResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Начальная позиция',
        example: 0,
    }),
    __metadata("design:type", Number)
], SearchTasksResponseDto.prototype, "startAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Количество возвращенных результатов',
        example: 20,
    }),
    __metadata("design:type", Number)
], SearchTasksResponseDto.prototype, "maxResults", void 0);
//# sourceMappingURL=search-tasks.response.dto.js.map