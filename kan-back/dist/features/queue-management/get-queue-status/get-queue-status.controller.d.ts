import { GetQueueStatusService, QueueStatusResponse } from './get-queue-status.service';
export declare class GetQueueStatusController {
    private readonly getQueueStatusService;
    private readonly logger;
    constructor(getQueueStatusService: GetQueueStatusService);
    handle(): Promise<QueueStatusResponse>;
}
