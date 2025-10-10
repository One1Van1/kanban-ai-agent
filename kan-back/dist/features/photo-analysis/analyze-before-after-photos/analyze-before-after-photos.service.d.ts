import { ConfigService } from '@nestjs/config';
import { AnalyzeBeforeAfterPhotosRequestDto } from './analyze-before-after-photos.request.dto';
import { AnalyzeBeforeAfterPhotosResponseDto } from './analyze-before-after-photos.response.dto';
export declare class AnalyzeBeforeAfterPhotosService {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService);
    execute(requestDto: AnalyzeBeforeAfterPhotosRequestDto): Promise<AnalyzeBeforeAfterPhotosResponseDto>;
    private analyzePhotos;
}
