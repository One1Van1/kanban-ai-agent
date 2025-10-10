"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoAnalysisModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const analyze_before_after_photos_controller_1 = require("../features/photo-analysis/analyze-before-after-photos/analyze-before-after-photos.controller");
const analyze_before_after_photos_service_1 = require("../features/photo-analysis/analyze-before-after-photos/analyze-before-after-photos.service");
let PhotoAnalysisModule = class PhotoAnalysisModule {
};
exports.PhotoAnalysisModule = PhotoAnalysisModule;
exports.PhotoAnalysisModule = PhotoAnalysisModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        controllers: [analyze_before_after_photos_controller_1.AnalyzeBeforeAfterPhotosController],
        providers: [analyze_before_after_photos_service_1.AnalyzeBeforeAfterPhotosService],
        exports: [analyze_before_after_photos_service_1.AnalyzeBeforeAfterPhotosService],
    })
], PhotoAnalysisModule);
//# sourceMappingURL=photo-analysis.module.js.map