import { GenerateReportService } from './generate-report.service';
import { GenerateReportRequestDto } from './generate-report.request.dto';
import { GenerateReportResponseDto } from './generate-report.response.dto';
export declare class GenerateReportController {
    private readonly service;
    private readonly logger;
    constructor(service: GenerateReportService);
    handle(dto: GenerateReportRequestDto): Promise<GenerateReportResponseDto>;
}
