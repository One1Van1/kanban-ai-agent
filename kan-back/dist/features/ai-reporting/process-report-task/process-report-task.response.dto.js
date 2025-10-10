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
exports.ProcessReportTaskResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ProcessReportTaskResponseDto {
    success;
    message;
    constructor(success, message) {
        this.success = success;
        this.message = message;
    }
}
exports.ProcessReportTaskResponseDto = ProcessReportTaskResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Operation success status',
        example: true,
    }),
    __metadata("design:type", Boolean)
], ProcessReportTaskResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Operation result message',
        example: 'Report task KAN-33 processed successfully',
    }),
    __metadata("design:type", String)
], ProcessReportTaskResponseDto.prototype, "message", void 0);
//# sourceMappingURL=process-report-task.response.dto.js.map