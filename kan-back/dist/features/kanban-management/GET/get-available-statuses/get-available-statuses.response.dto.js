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
exports.GetAvailableStatusesResponseDto = exports.StatusesDataDto = exports.StatusTransitionDto = exports.TaskStatusDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class TaskStatusDto {
    id;
    name;
    description;
    color;
    category;
    order;
    isInitial;
    isFinal;
}
exports.TaskStatusDto = TaskStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique status identifier',
        example: 'in_progress',
    }),
    __metadata("design:type", String)
], TaskStatusDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Human-readable status name',
        example: 'In Progress',
    }),
    __metadata("design:type", String)
], TaskStatusDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status description',
        example: 'Tasks that are currently being worked on',
    }),
    __metadata("design:type", String)
], TaskStatusDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status color for UI display',
        example: '#0052CC',
    }),
    __metadata("design:type", String)
], TaskStatusDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status category',
        example: 'in_progress',
    }),
    __metadata("design:type", String)
], TaskStatusDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Display order of status',
        example: 2,
    }),
    __metadata("design:type", Number)
], TaskStatusDto.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether this is an initial status for new tasks',
        example: false,
    }),
    __metadata("design:type", Boolean)
], TaskStatusDto.prototype, "isInitial", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether this is a final status',
        example: false,
    }),
    __metadata("design:type", Boolean)
], TaskStatusDto.prototype, "isFinal", void 0);
class StatusTransitionDto {
    from;
    to;
    name;
}
exports.StatusTransitionDto = StatusTransitionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Source status ID',
        example: 'in_progress',
    }),
    __metadata("design:type", String)
], StatusTransitionDto.prototype, "from", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Target status ID',
        example: 'in_review',
    }),
    __metadata("design:type", String)
], StatusTransitionDto.prototype, "to", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Transition action name',
        example: 'Submit for Review',
    }),
    __metadata("design:type", String)
], StatusTransitionDto.prototype, "name", void 0);
class StatusesDataDto {
    statuses;
    transitions;
    defaultStatus;
    totalStatuses;
}
exports.StatusesDataDto = StatusesDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [TaskStatusDto],
        description: 'Array of available task statuses',
    }),
    __metadata("design:type", Array)
], StatusesDataDto.prototype, "statuses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [StatusTransitionDto],
        description: 'Array of possible status transitions',
    }),
    __metadata("design:type", Array)
], StatusesDataDto.prototype, "transitions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Default status ID for new tasks',
        example: 'todo',
    }),
    __metadata("design:type", String)
], StatusesDataDto.prototype, "defaultStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of available statuses',
        example: 5,
    }),
    __metadata("design:type", Number)
], StatusesDataDto.prototype, "totalStatuses", void 0);
class GetAvailableStatusesResponseDto {
    success;
    data;
    message;
}
exports.GetAvailableStatusesResponseDto = GetAvailableStatusesResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indicates if the request was successful',
        example: true,
    }),
    __metadata("design:type", Boolean)
], GetAvailableStatusesResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: StatusesDataDto,
        description: 'Available statuses and transitions data',
    }),
    __metadata("design:type", StatusesDataDto)
], GetAvailableStatusesResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Response message',
        example: 'Available statuses retrieved successfully',
    }),
    __metadata("design:type", String)
], GetAvailableStatusesResponseDto.prototype, "message", void 0);
//# sourceMappingURL=get-available-statuses.response.dto.js.map