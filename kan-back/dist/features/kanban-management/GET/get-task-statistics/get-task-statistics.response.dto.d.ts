export interface TaskStatistics {
    total: number;
    completed: number;
    failed: number;
    pending: number;
    processing: number;
}
export declare class GetTaskStatisticsResponseDto {
    total: number;
    completed: number;
    failed: number;
    pending: number;
    processing: number;
    agentId?: string;
    success: boolean;
    timestamp: string;
    constructor(statistics: TaskStatistics, agentId?: string);
}
