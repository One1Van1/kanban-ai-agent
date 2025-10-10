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
exports.FetchRelatedTasksQueryDto = exports.RelationshipType = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var RelationshipType;
(function (RelationshipType) {
    RelationshipType["BLOCKS"] = "blocks";
    RelationshipType["BLOCKED_BY"] = "blocked_by";
    RelationshipType["DEPENDS_ON"] = "depends_on";
    RelationshipType["RELATED_TO"] = "related_to";
    RelationshipType["DUPLICATE"] = "duplicate";
    RelationshipType["SUBTASK"] = "subtask";
    RelationshipType["PARENT"] = "parent";
})(RelationshipType || (exports.RelationshipType = RelationshipType = {}));
class FetchRelatedTasksQueryDto {
    relationshipType;
    limit = 10;
    includeSubtasks = true;
    includeParents = true;
}
exports.FetchRelatedTasksQueryDto = FetchRelatedTasksQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: RelationshipType,
        enumName: 'RelationshipType',
        example: RelationshipType.RELATED_TO,
        description: 'Тип связи между задачами',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(RelationshipType),
    __metadata("design:type", String)
], FetchRelatedTasksQueryDto.prototype, "relationshipType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Максимальное количество возвращаемых связанных задач',
        example: 10,
        minimum: 1,
        maximum: 100,
        required: false,
        default: 10,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], FetchRelatedTasksQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Включить подзадачи в результат',
        example: true,
        required: false,
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true'),
    __metadata("design:type", Boolean)
], FetchRelatedTasksQueryDto.prototype, "includeSubtasks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Включить родительские задачи в результат',
        example: true,
        required: false,
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true'),
    __metadata("design:type", Boolean)
], FetchRelatedTasksQueryDto.prototype, "includeParents", void 0);
//# sourceMappingURL=fetch-related-tasks.query.dto.js.map