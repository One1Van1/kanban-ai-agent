import { TaskHistory } from '@/entities/task-history.entity';
export declare class GetAgentTaskHistoryResponseDto {
    agentId: string;
    count: number;
    items: TaskHistory[];
    success: boolean;
    timestamp: string;
    constructor(agentId: string, items: TaskHistory[]);
}
