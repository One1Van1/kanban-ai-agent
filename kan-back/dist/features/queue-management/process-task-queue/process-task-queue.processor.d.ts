import { Job } from 'bull';
export interface ProcessTaskData {
    taskId: string;
    taskType: string;
    data: any;
    createdAt: string;
}
export declare class ProcessTaskQueueProcessor {
    private readonly logger;
    handleTask(job: Job<ProcessTaskData>): Promise<{
        success: boolean;
        taskId: string;
        completedAt: string;
    }>;
    private processTaskByType;
}
