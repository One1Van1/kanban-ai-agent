import { Queue } from 'bull';
export interface JobDetailsResponse {
    id: string;
    name: string;
    data: any;
    progress: number;
    attemptsMade: number;
    processedOn?: number;
    finishedOn?: number;
    failedReason?: string;
}
export declare class GetJobDetailsService {
    private readonly aiAgentQueue;
    private readonly logger;
    constructor(aiAgentQueue: Queue);
    getJobDetails(jobId: string): Promise<JobDetailsResponse | null>;
}
