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
exports.UpdateTaskAssignmentRequestDto = exports.AssignmentDetails = exports.AssignmentAction = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var AssignmentAction;
(function (AssignmentAction) {
    AssignmentAction["ASSIGN"] = "assign";
    AssignmentAction["REASSIGN"] = "reassign";
    AssignmentAction["UNASSIGN"] = "unassign";
    AssignmentAction["ADD_WATCHER"] = "add_watcher";
    AssignmentAction["REMOVE_WATCHER"] = "remove_watcher";
})(AssignmentAction || (exports.AssignmentAction = AssignmentAction = {}));
class AssignmentDetails {
    userId;
    role;
    startDate;
    endDate;
}
exports.AssignmentDetails = AssignmentDetails;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID being assigned',
        example: 'agent-002',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignmentDetails.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Role in assignment',
        example: 'primary_assignee',
        enum: ['primary_assignee', 'secondary_assignee', 'reviewer', 'watcher'],
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignmentDetails.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Assignment start date',
        example: '2024-01-15T10:00:00Z',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignmentDetails.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Assignment end date',
        example: '2024-01-20T17:00:00Z',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignmentDetails.prototype, "endDate", void 0);
class UpdateTaskAssignmentRequestDto {
    action;
    assignee;
    watchers;
    assignmentDetails;
    updatedBy;
    assignmentReason;
    notifyAssignees;
    assignmentPriority;
}
exports.UpdateTaskAssignmentRequestDto = UpdateTaskAssignmentRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: AssignmentAction,
        enumName: 'AssignmentAction',
        example: AssignmentAction.REASSIGN,
        description: 'Type of assignment action to perform',
    }),
    (0, class_validator_1.IsEnum)(AssignmentAction),
    __metadata("design:type", String)
], UpdateTaskAssignmentRequestDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Primary assignee ID',
        example: 'agent-002',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTaskAssignmentRequestDto.prototype, "assignee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of watchers for this task',
        example: ['agent-003', 'agent-004'],
        type: [String],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateTaskAssignmentRequestDto.prototype, "watchers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Detailed assignment information',
        type: [AssignmentDetails],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => AssignmentDetails),
    __metadata("design:type", Array)
], UpdateTaskAssignmentRequestDto.prototype, "assignmentDetails", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User performing the assignment update',
        example: 'agent-001',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTaskAssignmentRequestDto.prototype, "updatedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reason for assignment change',
        example: 'Reassigning to team member with more relevant expertise',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTaskAssignmentRequestDto.prototype, "assignmentReason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether to notify assigned users',
        example: true,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateTaskAssignmentRequestDto.prototype, "notifyAssignees", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Priority level for this assignment',
        example: 'normal',
        enum: ['low', 'normal', 'high', 'urgent'],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTaskAssignmentRequestDto.prototype, "assignmentPriority", void 0);
//# sourceMappingURL=update-task-assignment.request.dto.js.map