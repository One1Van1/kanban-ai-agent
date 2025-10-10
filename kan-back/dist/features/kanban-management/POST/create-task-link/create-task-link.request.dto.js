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
exports.CreateTaskLinkRequestDto = exports.TaskLinkType = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var TaskLinkType;
(function (TaskLinkType) {
    TaskLinkType["BLOCKS"] = "blocks";
    TaskLinkType["BLOCKED_BY"] = "blocked_by";
    TaskLinkType["RELATES_TO"] = "relates_to";
    TaskLinkType["DUPLICATES"] = "duplicates";
    TaskLinkType["CLONES"] = "clones";
    TaskLinkType["DEPENDS_ON"] = "depends_on";
    TaskLinkType["REQUIRED_BY"] = "required_by";
})(TaskLinkType || (exports.TaskLinkType = TaskLinkType = {}));
class CreateTaskLinkRequestDto {
    targetTaskId;
    linkType;
    description;
    createdBy;
}
exports.CreateTaskLinkRequestDto = CreateTaskLinkRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the target task to link to',
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d480',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTaskLinkRequestDto.prototype, "targetTaskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: TaskLinkType,
        enumName: 'TaskLinkType',
        example: TaskLinkType.BLOCKS,
        description: 'Type of relationship between tasks',
    }),
    (0, class_validator_1.IsEnum)(TaskLinkType),
    __metadata("design:type", String)
], CreateTaskLinkRequestDto.prototype, "linkType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Optional description of the link relationship',
        example: 'This task must be completed before the target task can start',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTaskLinkRequestDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User who created the link',
        example: 'agent-001',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTaskLinkRequestDto.prototype, "createdBy", void 0);
//# sourceMappingURL=create-task-link.request.dto.js.map