import { Queue } from 'bull';
export interface QueueStatusResponse {
    queueName: string;
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
    paused: boolean;
}
export declare class GetQueueStatusService {
    private readonly aiAgentQueue;
    private readonly logger;
    constructor(aiAgentQueue: Queue);
    getQueueStatus(): Promise<QueueStatusResponse>;
}
