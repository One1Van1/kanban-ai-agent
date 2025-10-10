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
exports.ExecuteTaskTransitionRequestDto = exports.TransitionAction = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var TransitionAction;
(function (TransitionAction) {
    TransitionAction["START_PROGRESS"] = "start_progress";
    TransitionAction["SUBMIT_FOR_REVIEW"] = "submit_for_review";
    TransitionAction["APPROVE"] = "approve";
    TransitionAction["REQUEST_CHANGES"] = "request_changes";
    TransitionAction["COMPLETE"] = "complete";
    TransitionAction["BLOCK"] = "block";
    TransitionAction["UNBLOCK"] = "unblock";
    TransitionAction["REOPEN"] = "reopen";
    TransitionAction["CLOSE"] = "close";
})(TransitionAction || (exports.TransitionAction = TransitionAction = {}));
class ExecuteTaskTransitionRequestDto {
    action;
    toStatus;
    toColumn;
    executedBy;
    comment;
    resolution;
}
exports.ExecuteTaskTransitionRequestDto = ExecuteTaskTransitionRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: TransitionAction,
        enumName: 'TransitionAction',
        example: TransitionAction.START_PROGRESS,
        description: 'Transition action to execute',
    }),
    (0, class_validator_1.IsEnum)(TransitionAction),
    __metadata("design:type", String)
], ExecuteTaskTransitionRequestDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Target status after transition',
        example: 'in_progress',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExecuteTaskTransitionRequestDto.prototype, "toStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Target column after transition',
        example: 'In Progress',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExecuteTaskTransitionRequestDto.prototype, "toColumn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User executing the transition',
        example: 'agent-001',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExecuteTaskTransitionRequestDto.prototype, "executedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Optional comment about the transition',
        example: 'Starting work on this task after clarification',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExecuteTaskTransitionRequestDto.prototype, "comment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Optional resolution for completing tasks',
        example: 'Fixed',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExecuteTaskTransitionRequestDto.prototype, "resolution", void 0);
//# sourceMappingURL=execute-task-transition.request.dto.js.map