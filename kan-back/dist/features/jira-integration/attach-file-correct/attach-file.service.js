"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachFileService = void 0;
const common_1 = require("@nestjs/common");
const attach_file_response_dto_1 = require("./attach-file.response.dto");
let AttachFileService = class AttachFileService {
    async execute(taskKey, requestDto) {
        try {
            return new attach_file_response_dto_1.AttachFileResponseDto(true, taskKey, 'File attached successfully');
        }
        catch (error) {
            return new attach_file_response_dto_1.AttachFileResponseDto(false, taskKey, 'Failed to attach file', error.message);
        }
    }
};
exports.AttachFileService = AttachFileService;
exports.AttachFileService = AttachFileService = __decorate([
    (0, common_1.Injectable)()
], AttachFileService);
//# sourceMappingURL=attach-file.service.js.map