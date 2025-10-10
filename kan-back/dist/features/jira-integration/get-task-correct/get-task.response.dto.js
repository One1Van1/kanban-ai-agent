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
exports.GetTaskResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class GetTaskResponseDto {
    key;
    id;
    self;
    fields;
    constructor(task) {
        this.key = task.key;
        this.id = task.id;
        this.self = task.self;
        this.fields = task.fields;
    }
}
exports.GetTaskResponseDto = GetTaskResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ключ задачи в Jira',
        example: 'KAN-5',
    }),
    __metadata("design:type", String)
], GetTaskResponseDto.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID задачи',
        example: '10001',
    }),
    __metadata("design:type", String)
], GetTaskResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ссылка на задачу',
        example: 'https://your-domain.atlassian.net/rest/api/2/issue/10001',
    }),
    __metadata("design:type", String)
], GetTaskResponseDto.prototype, "self", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Поля задачи',
        example: {
            summary: 'Название задачи',
            description: 'Описание задачи',
            status: { name: 'In Progress' },
            priority: { name: 'High' },
        },
    }),
    __metadata("design:type", Object)
], GetTaskResponseDto.prototype, "fields", void 0);
//# sourceMappingURL=get-task.response.dto.js.map