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
exports.TrackAgentInTaskResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class TrackAgentInTaskResponseDto {
    success;
    agentId;
    taskId;
    message;
    tracking;
    nextActions;
}
exports.TrackAgentInTaskResponseDto = TrackAgentInTaskResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Success status' }),
    __metadata("design:type", Boolean)
], TrackAgentInTaskResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Agent ID' }),
    __metadata("design:type", String)
], TrackAgentInTaskResponseDto.prototype, "agentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Task ID being tracked' }),
    __metadata("design:type", String)
], TrackAgentInTaskResponseDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Response message' }),
    __metadata("design:type", String)
], TrackAgentInTaskResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tracking details' }),
    __metadata("design:type", Object)
], TrackAgentInTaskResponseDto.prototype, "tracking", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Next actions that will be triggered',
        isArray: true,
    }),
    __metadata("design:type", Array)
], TrackAgentInTaskResponseDto.prototype, "nextActions", void 0);
//# sourceMappingURL=track-agent-in-task.response.dto.js.map