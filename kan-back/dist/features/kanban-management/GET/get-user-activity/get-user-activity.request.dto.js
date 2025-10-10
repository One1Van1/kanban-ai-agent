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
exports.GetUserActivityRequestDto = exports.ActivityType = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var ActivityType;
(function (ActivityType) {
    ActivityType["ALL"] = "all";
    ActivityType["CREATED"] = "created";
    ActivityType["UPDATED"] = "updated";
    ActivityType["ASSIGNED"] = "assigned";
    ActivityType["COMMENTED"] = "commented";
    ActivityType["STATUS_CHANGED"] = "status_changed";
})(ActivityType || (exports.ActivityType = ActivityType = {}));
class GetUserActivityRequestDto {
    page = 1;
    limit = 20;
    type = ActivityType.ALL;
}
exports.GetUserActivityRequestDto = GetUserActivityRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Page number for pagination',
        example: 1,
        required: false,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], GetUserActivityRequestDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of activities per page',
        example: 20,
        required: false,
        minimum: 1,
        maximum: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], GetUserActivityRequestDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ActivityType,
        enumName: 'ActivityType',
        example: ActivityType.ALL,
        description: 'Filter by activity type',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ActivityType),
    __metadata("design:type", String)
], GetUserActivityRequestDto.prototype, "type", void 0);
//# sourceMappingURL=get-user-activity.request.dto.js.map