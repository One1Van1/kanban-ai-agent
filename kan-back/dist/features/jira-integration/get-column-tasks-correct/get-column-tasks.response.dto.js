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
exports.GetColumnTasksResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class GetColumnTasksResponseDto {
    tasks;
    columnStatus;
    total;
    constructor(tasks, columnStatus, total) {
        this.tasks = tasks;
        this.columnStatus = columnStatus;
        this.total = total;
    }
}
exports.GetColumnTasksResponseDto = GetColumnTasksResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Задачи из указанной колонки',
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
], GetColumnTasksResponseDto.prototype, "tasks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Статус колонки',
        example: 'In Progress',
    }),
    __metadata("design:type", String)
], GetColumnTasksResponseDto.prototype, "columnStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Общее количество задач',
        example: 15,
    }),
    __metadata("design:type", Number)
], GetColumnTasksResponseDto.prototype, "total", void 0);
//# sourceMappingURL=get-column-tasks.response.dto.js.map