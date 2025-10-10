import { GetReportConfigService } from './get-report-config.service';
import { GetReportConfigResponseDto } from './get-report-config.response.dto';
export declare class GetReportConfigController {
    private readonly service;
    private readonly logger;
    constructor(service: GetReportConfigService);
    handle(): Promise<GetReportConfigResponseDto>;
}
