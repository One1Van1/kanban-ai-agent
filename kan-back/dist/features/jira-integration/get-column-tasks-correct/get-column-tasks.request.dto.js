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
exports.GetColumnTasksRequestDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class GetColumnTasksRequestDto {
    columnStatus;
    maxResults;
    assignee;
    priority;
}
exports.GetColumnTasksRequestDto = GetColumnTasksRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Статус колонки для получения задач',
        example: 'In Progress',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetColumnTasksRequestDto.prototype, "columnStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Максимальное количество результатов',
        example: 20,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], GetColumnTasksRequestDto.prototype, "maxResults", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Фильтр по исполнителю',
        example: 'john.doe@company.com',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetColumnTasksRequestDto.prototype, "assignee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Фильтр по приоритету',
        example: 'High',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetColumnTasksRequestDto.prototype, "priority", void 0);
//# sourceMappingURL=get-column-tasks.request.dto.js.map