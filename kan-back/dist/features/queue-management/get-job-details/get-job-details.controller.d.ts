import { GetJobDetailsService } from './get-job-details.service';
export declare class GetJobDetailsController {
    private readonly getJobDetailsService;
    private readonly logger;
    constructor(getJobDetailsService: GetJobDetailsService);
    handle(jobId: string): Promise<import("./get-job-details.service").JobDetailsResponse>;
}
