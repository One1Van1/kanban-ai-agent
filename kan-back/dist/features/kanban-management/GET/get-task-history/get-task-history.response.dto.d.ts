import { TaskHistory } from '@/entities/task-history.entity';
export declare class GetTaskHistoryResponseDto {
    taskId: string;
    count: number;
    items: TaskHistory[];
    success: boolean;
    timestamp: string;
    constructor(taskId: string, items: TaskHistory[]);
}
