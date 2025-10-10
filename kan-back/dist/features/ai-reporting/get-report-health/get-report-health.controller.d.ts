import { GetReportHealthService } from './get-report-health.service';
import { GetReportHealthResponseDto } from './get-report-health.response.dto';
export declare class GetReportHealthController {
    private readonly service;
    private readonly logger;
    constructor(service: GetReportHealthService);
    handle(): Promise<GetReportHealthResponseDto>;
}
