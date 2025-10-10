import { AnalyzeBeforeAfterPhotosService } from './analyze-before-after-photos.service';
import { AnalyzeBeforeAfterPhotosRequestDto } from './analyze-before-after-photos.request.dto';
import { AnalyzeBeforeAfterPhotosResponseDto } from './analyze-before-after-photos.response.dto';
export declare class AnalyzeBeforeAfterPhotosController {
    private readonly service;
    constructor(service: AnalyzeBeforeAfterPhotosService);
    handle(requestDto: AnalyzeBeforeAfterPhotosRequestDto): Promise<AnalyzeBeforeAfterPhotosResponseDto>;
}
